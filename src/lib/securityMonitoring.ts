import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'failed_login' | 'unauthorized_access' | 'suspicious_activity' | 'privilege_escalation_attempt';
  userId?: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityMonitor {
  private static async logEvent(event: SecurityEvent) {
    try {
      // Log to Supabase security_events table
      // @ts-ignore - Table will be created by migration
      const { error } = await supabase.from('security_events').insert({
        event_type: event.type,
        user_id: event.userId || null,
        details: event.details,
        severity: event.severity,
        timestamp: new Date().toISOString(),
      });

      if (error) {
        console.error('Failed to insert security event:', error);
      }

      // For critical events, trigger alerts
      if (event.severity === 'critical') {
        await this.triggerAlert(event);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private static async triggerAlert(event: SecurityEvent) {
    // Call edge function to send alert (email, Slack, etc.)
    // This function can be implemented when alert infrastructure is ready
    try {
      await supabase.functions.invoke('send-security-alert', {
        body: event,
      });
    } catch (error) {
      console.error('Failed to trigger security alert:', error);
    }
  }

  static async logFailedAdminAccess(userId: string, attemptedRoute: string) {
    await this.logEvent({
      type: 'unauthorized_access',
      userId,
      details: {
        route: attemptedRoute,
        timestamp: new Date().toISOString(),
        message: 'User attempted to access admin route without proper privileges',
      },
      severity: 'high',
    });
  }

  static async logPrivilegeEscalationAttempt(userId: string, details: any) {
    await this.logEvent({
      type: 'privilege_escalation_attempt',
      userId,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
      },
      severity: 'critical',
    });
  }

  static async logSuspiciousActivity(userId: string, activity: string, details: any = {}) {
    await this.logEvent({
      type: 'suspicious_activity',
      userId,
      details: {
        activity,
        ...details,
        timestamp: new Date().toISOString(),
      },
      severity: 'medium',
    });
  }

  static async logFailedLogin(email: string, reason: string) {
    await this.logEvent({
      type: 'failed_login',
      details: {
        email,
        reason,
        timestamp: new Date().toISOString(),
      },
      severity: 'low',
    });
  }
}
