import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { affiliateManager } from "@/services/AffiliateManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Commission {
  id: string;
  affiliate_program_id: string;
  order_id: string;
  order_amount: number;
  commission_amount: number;
  commission_currency: string;
  status: string;
  created_at: string;
  product_name: string | null;
}

const AffiliatePayouts = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    fetchPendingCommissions();
  }, []);

  const fetchPendingCommissions = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_commissions')
        .select('*')
        .in('status', ['pending', 'approved'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommissions(data || []);
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (commissionId: string) => {
    try {
      await affiliateManager.approveCommission(commissionId);
      toast.success('Commission approved successfully');
      fetchPendingCommissions();
    } catch (error) {
      toast.error('Failed to approve commission');
    }
  };

  const handleReject = async () => {
    if (!selectedCommission || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await affiliateManager.rejectCommission(selectedCommission.id, rejectReason);
      toast.success('Commission rejected');
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedCommission(null);
      fetchPendingCommissions();
    } catch (error) {
      toast.error('Failed to reject commission');
    }
  };

  const openRejectDialog = (commission: Commission) => {
    setSelectedCommission(commission);
    setShowRejectDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "Pending", icon: AlertCircle },
      approved: { variant: "default" as const, label: "Approved", icon: CheckCircle },
      paid: { variant: "default" as const, label: "Paid", icon: DollarSign },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: XCircle }
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const totalPending = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + Number(c.commission_amount), 0);

  const totalApproved = commissions
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + Number(c.commission_amount), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Affiliate Payouts</h1>
          <p className="text-muted-foreground">
            Review and manage affiliate commission payments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {commissions.filter(c => c.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total: R{totalPending.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {commissions.filter(c => c.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total: R{totalApproved.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full" disabled>
                Generate Payout Batch
              </Button>
              <Button size="sm" variant="outline" className="w-full" disabled>
                Export Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Commissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Queue</CardTitle>
            <CardDescription>
              Review and approve pending affiliate commissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading commissions...</p>
              </div>
            ) : commissions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No commissions to review</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Order Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        {format(new Date(commission.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {commission.affiliate_program_id}
                      </TableCell>
                      <TableCell>
                        {commission.order_amount}
                      </TableCell>
                      <TableCell className="font-bold">
                        {Number(commission.commission_amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {commission.commission_currency}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(commission.status)}
                      </TableCell>
                      <TableCell>
                        {commission.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApprove(commission.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openRejectDialog(commission)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Commission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this commission
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Commission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliatePayouts;
