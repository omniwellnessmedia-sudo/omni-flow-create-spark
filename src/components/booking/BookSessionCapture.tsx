import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Send, CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookSessionCaptureProps {
  serviceName: string;
  buttonText?: string;
  buttonClassName?: string;
  emailSubject?: string;
}

const BookSessionCapture = ({
  serviceName,
  buttonText = "Email to Book Session",
  buttonClassName = "",
  emailSubject,
}: BookSessionCaptureProps) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const subject = emailSubject || `${serviceName} Session Request`;

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) return;

    setLoading(true);
    try {
      // Save as lead in contact_submissions
      await supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        message: form.message || `Booking request for ${serviceName}`,
        organization: null,
        service: serviceName,
        status: "pending",
      });

      // Also try the edge function for email notification
      supabase.functions.invoke("submit-contact", {
        body: {
          name: form.name,
          email: form.email,
          message: form.message || `Booking request for ${serviceName}`,
          service: serviceName,
        },
      }).catch(() => {});

      setSubmitted(true);

      // After a brief moment, open email client as fallback
      setTimeout(() => {
        const body = `Hi,\n\nI'd like to book a ${serviceName} session.\n\nName: ${form.name}\nEmail: ${form.email}${form.phone ? `\nPhone: ${form.phone}` : ""}\n\n${form.message || ""}\n\nThank you!`;
        window.location.href = `mailto:admin@omniwellnessmedia.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }, 1500);
    } catch (error) {
      console.error("Error saving lead:", error);
      // Still open email even if DB save fails
      window.location.href = `mailto:admin@omniwellnessmedia.co.za?subject=${encodeURIComponent(subject)}`;
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : resetAndClose())}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={`bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-lg ${buttonClassName}`}
        >
          <Calendar className="mr-2 w-5 h-5" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-heading text-lg mb-2">Request Sent!</h3>
            <p className="text-sm text-muted-foreground">
              Your {serviceName.toLowerCase()} session request has been captured. We'll be in touch shortly.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Opening your email client...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book a {serviceName} Session</DialogTitle>
              <DialogDescription>
                Fill in your details and we'll get back to you to confirm your session.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone (optional)</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+27..."
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Message (optional)</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about what you're looking for..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading || !form.name.trim() || !form.email.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                Send Request
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookSessionCapture;
