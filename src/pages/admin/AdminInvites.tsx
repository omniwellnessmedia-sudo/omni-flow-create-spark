import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Loader2, UserPlus, CheckCircle, AlertCircle, Send } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

interface InviteStatus {
  email: string;
  status: 'pending' | 'sent' | 'error';
  message?: string;
}

const teamMembers = [
  { name: "Chad Cupido", email: "chad@omniwellnessmedia.com", role: "Founder & Head of Media" },
  { name: "Zenith", email: "zenith@omniwellnessmedia.com", role: "Administration & Coordination" },
  { name: "Feroza", email: "feroza@omniwellnessmedia.com", role: "Content & Operations" },
];

const AdminInvites = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteHistory, setInviteHistory] = useState<InviteStatus[]>([]);

  const handleSendInvite = async (inviteEmail: string, inviteName: string) => {
    try {
      emailSchema.parse(inviteEmail);
    } catch {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      // Send password reset email (works as invite for new users too)
      const { error } = await supabase.auth.resetPasswordForEmail(inviteEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setInviteHistory(prev => [
        { email: inviteEmail, status: 'sent', message: `Invite sent to ${inviteName || inviteEmail}` },
        ...prev
      ]);

      toast.success(`Invite sent to ${inviteName || inviteEmail}!`);
      setEmail("");
      setName("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send invite";
      
      setInviteHistory(prev => [
        { email: inviteEmail, status: 'error', message: errorMessage },
        ...prev
      ]);
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickInvite = (member: typeof teamMembers[0]) => {
    handleSendInvite(member.email, member.name);
  };

  return (
    <div className="space-y-6">
      {/* Quick Invite Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Quick Invite Team Members
          </CardTitle>
          <CardDescription>
            Send password setup emails to your team. They'll receive a secure link to set their password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.email}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
              >
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {member.role}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickInvite(member)}
                  disabled={loading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Send Custom Invite
          </CardTitle>
          <CardDescription>
            Invite anyone by entering their email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendInvite(email, name);
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Team member's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="team@example.com"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading || !email}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invite
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Invite History */}
      {inviteHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inviteHistory.map((invite, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    invite.status === 'sent' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  } border`}
                >
                  {invite.status === 'sent' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-sm text-muted-foreground">{invite.message}</p>
                  </div>
                  <Badge variant={invite.status === 'sent' ? 'default' : 'destructive'}>
                    {invite.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-800">How Invites Work</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 space-y-2">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>You send an invite to a team member's email address</li>
            <li>They receive a secure link to set their password</li>
            <li>After setting their password, they can log in at <code className="bg-blue-100 px-1 rounded">/auth</code></li>
            <li>Once logged in, you can grant them admin access from the Admin Tools page</li>
          </ol>
          <p className="text-sm mt-4">
            <strong>Note:</strong> Make sure to update the team member emails above with their actual email addresses before sending invites.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvites;
