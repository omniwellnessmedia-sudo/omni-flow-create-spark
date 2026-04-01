import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

const PROFILE_FIELDS = [
  { key: "business_name", label: "Name" },
  { key: "description", label: "Bio" },
  { key: "location", label: "Location" },
  { key: "phone", label: "Phone" },
  { key: "specialties", label: "Specialties", check: (v: any) => v?.length > 0 },
  { key: "certifications", label: "Certifications", check: (v: any) => v?.length > 0 },
  { key: "profile_image_url", label: "Photo" },
] as const;

interface ProfileCompletionBarProps {
  profileCompletion: number;
  providerProfile: any;
}

const ProfileCompletionBar = memo(({ profileCompletion, providerProfile }: ProfileCompletionBarProps) => {
  if (profileCompletion >= 100) return null;

  return (
    <Card className="mb-6 border-primary/10 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Complete your profile to increase bookings by up to 60%</span>
          </div>
          <span className="text-sm font-heading text-primary">{profileCompletion}%</span>
        </div>
        <Progress value={profileCompletion} className="h-2" />
        <div className="flex gap-2 flex-wrap mt-3">
          {PROFILE_FIELDS.map((field) => {
            const filled = field.check
              ? field.check(providerProfile?.[field.key])
              : !!providerProfile?.[field.key];
            return (
              <Badge key={field.key} variant={filled ? "default" : "secondary"} className="text-[10px]">
                {filled ? "✓" : "○"} {field.label}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

ProfileCompletionBar.displayName = "ProfileCompletionBar";

export default ProfileCompletionBar;
