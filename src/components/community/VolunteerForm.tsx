import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Heart, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const VolunteerForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    skills: [] as string[],
    availability: "",
    motivation: "",
  });

  const volunteerRoles = [
    "Community Outreach",
    "Event Coordinator",
    "Social Media Ambassador",
    "Workshop Facilitator",
    "Fundraising",
    "Administrative Support",
    "Content Creator",
    "Brand Partnership",
  ];

  const skillOptions = [
    "Social Media Marketing",
    "Event Planning",
    "Graphic Design",
    "Writing & Content",
    "Photography/Videography",
    "Public Speaking",
    "Community Engagement",
    "Fundraising",
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format the message with all volunteer details
      const volunteerMessage = `
VOLUNTEER APPLICATION

Role: ${formData.role}
Skills: ${formData.skills.join(', ') || 'Not specified'}
Availability: ${formData.availability || 'Not specified'}

Motivation:
${formData.motivation}
      `.trim();

      const { error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: formData.name,
          email: formData.email,
          organization: `Volunteer - ${formData.role}`,
          service: 'Volunteer Application',
          message: volunteerMessage,
        }
      });

      if (error) throw error;
      
      toast.success("Thank you! We'll be in touch soon.", {
        description: "Your volunteer application has been submitted successfully.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        skills: [],
        availability: "",
        motivation: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary/20" />
          Volunteer Application
        </CardTitle>
        <CardDescription>
          Join our community initiatives and make a difference
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+27 123 456 789"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Preferred Role *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                required
                disabled={isSubmitting}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {volunteerRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Skills</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skillOptions.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={() => handleSkillToggle(skill)}
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor={skill}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g., Weekends, 2 hours per week"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to volunteer? *</Label>
            <Textarea
              id="motivation"
              required
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="Tell us about your motivation and what you hope to contribute..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
