import { supabase } from '@/integrations/supabase/client';
import { AFFILIATE_PROGRAMS, getProgramById } from '@/config/affiliates';
import type { AffiliateProgram } from '@/config/affiliates';

export interface AffiliateClick {
  click_id: string;
  affiliate_program_id: string;
  destination_url: string;
  referrer_url?: string;
}

export interface CommissionRecord {
  order_id: string;
  click_id: string;
  affiliate_program_id: string;
  order_amount: number;
  commission_amount: number;
  commission_currency: string;
}

export interface PerformanceMetrics {
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  total_commission_usd: number;
  total_commission_zar: number;
  total_commission_eur: number;
  pending_commissions: number;
  approved_commissions: number;
  paid_commissions: number;
}

export class AffiliateManager {
  /**
   * Track affiliate click and store in database
   */
  async trackClick(
    programId: string,
    destinationUrl: string,
    referrerUrl?: string
  ): Promise<string> {
    try {
      const program = getProgramById(programId);
      if (!program || program.status !== 'active') {
        throw new Error('Invalid or inactive affiliate program');
      }

      const clickId = `${programId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data: user } = await supabase.auth.getUser();

      const { error } = await supabase.from('affiliate_clicks').insert({
        click_id: clickId,
        affiliate_program_id: programId,
        destination_url: destinationUrl,
        referrer_url: referrerUrl,
        user_id: user.user?.id || null
      });

      if (error) throw error;

      // Store click_id in sessionStorage for commission tracking
      sessionStorage.setItem('affiliate_click_id', clickId);
      sessionStorage.setItem('affiliate_program_id', programId);

      // Set cookie for longer-term tracking
      const expiryDays = program.cookie_duration_days;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      document.cookie = `aff_click=${clickId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

      return clickId;
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
      throw error;
    }
  }

  /**
   * Generate affiliate tracking link
   */
  generateAffiliateLink(programId: string, productUrl: string): string {
    const program = getProgramById(programId);
    if (!program) return productUrl;

    // This will be enhanced when secrets are added
    // For now, return the base URL with a tracking parameter
    const url = new URL(productUrl);
    url.searchParams.set('aff', programId);
    return url.toString();
  }

  /**
   * Record commission after successful order
   */
  async recordCommission(
    orderId: string,
    orderAmount: number,
    currency: string = 'ZAR'
  ): Promise<void> {
    try {
      const clickId = sessionStorage.getItem('affiliate_click_id');
      const programId = sessionStorage.getItem('affiliate_program_id');

      if (!clickId || !programId) {
        console.log('No affiliate tracking data found');
        return;
      }

      const program = getProgramById(programId);
      if (!program) {
        console.error('Invalid affiliate program');
        return;
      }

      const commissionAmount = (orderAmount * program.commission_rate) / 100;

      const { data: user } = await supabase.auth.getUser();

      const { error } = await supabase.from('affiliate_commissions').insert({
        affiliate_program_id: programId,
        click_id: clickId,
        order_id: orderId,
        user_id: user.user?.id || null,
        order_amount: orderAmount,
        commission_amount: commissionAmount,
        commission_currency: currency,
        commission_rate: program.commission_rate,
        status: 'pending'
      });

      if (error) throw error;

      // Clear tracking data after commission recorded
      sessionStorage.removeItem('affiliate_click_id');
      sessionStorage.removeItem('affiliate_program_id');

      console.log(`Commission recorded: ${commissionAmount} ${currency}`);
    } catch (error) {
      console.error('Failed to record commission:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics for a specific program
   */
  async getPerformanceMetrics(
    programId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<PerformanceMetrics> {
    try {
      let clicksQuery = supabase
        .from('affiliate_clicks')
        .select('*', { count: 'exact' })
        .eq('affiliate_program_id', programId);

      let commissionsQuery = supabase
        .from('affiliate_commissions')
        .select('*')
        .eq('affiliate_program_id', programId);

      if (startDate) {
        clicksQuery = clicksQuery.gte('created_at', startDate.toISOString());
        commissionsQuery = commissionsQuery.gte('created_at', startDate.toISOString());
      }

      if (endDate) {
        clicksQuery = clicksQuery.lte('created_at', endDate.toISOString());
        commissionsQuery = commissionsQuery.lte('created_at', endDate.toISOString());
      }

      const [{ count: totalClicks }, { data: commissions }] = await Promise.all([
        clicksQuery,
        commissionsQuery
      ]);

      const totalConversions = commissions?.length || 0;
      const conversionRate = totalClicks ? (totalConversions / totalClicks) * 100 : 0;

      const totals = commissions?.reduce(
        (acc, comm) => {
          if (comm.commission_currency === 'USD') {
            acc.usd += Number(comm.commission_amount);
          } else if (comm.commission_currency === 'ZAR') {
            acc.zar += Number(comm.commission_amount);
          } else if (comm.commission_currency === 'EUR') {
            acc.eur += Number(comm.commission_amount);
          }

          if (comm.status === 'pending') acc.pending++;
          if (comm.status === 'approved') acc.approved++;
          if (comm.status === 'paid') acc.paid++;

          return acc;
        },
        { usd: 0, zar: 0, eur: 0, pending: 0, approved: 0, paid: 0 }
      ) || { usd: 0, zar: 0, eur: 0, pending: 0, approved: 0, paid: 0 };

      return {
        total_clicks: totalClicks || 0,
        total_conversions: totalConversions,
        conversion_rate: conversionRate,
        total_commission_usd: totals.usd,
        total_commission_zar: totals.zar,
        total_commission_eur: totals.eur,
        pending_commissions: totals.pending,
        approved_commissions: totals.approved,
        paid_commissions: totals.paid
      };
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      throw error;
    }
  }

  /**
   * Get all active programs
   */
  getActivePrograms(): AffiliateProgram[] {
    return Object.values(AFFILIATE_PROGRAMS).filter(p => p.status === 'active');
  }

  /**
   * Validate commission and update status
   */
  async approveCommission(commissionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('affiliate_commissions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', commissionId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to approve commission:', error);
      throw error;
    }
  }

  /**
   * Reject commission
   */
  async rejectCommission(commissionId: string, reason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('affiliate_commissions')
        .update({
          status: 'rejected',
          notes: reason
        })
        .eq('id', commissionId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to reject commission:', error);
      throw error;
    }
  }
}

export const affiliateManager = new AffiliateManager();
