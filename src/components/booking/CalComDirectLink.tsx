import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalComDirectLinkProps {
  eventTypeSlug?: string;
  calUsername?: string;
  buttonText?: string;
  buttonClassName?: string;
}

/**
 * CalComDirectLink - A reliable direct link to Cal.com scheduling
 * Uses native anchor tags for cross-device compatibility (iOS Safari, Android, Desktop)
 */
export const CalComDirectLink = ({
  eventTypeSlug = "discovery-call",
  calUsername = "omni-wellness-media-gqj9mj",
  buttonText = "Book with Cal.com",
  buttonClassName = "",
}: CalComDirectLinkProps) => {
  const calUrl = `https://cal.com/${calUsername}/${eventTypeSlug}`;

  return (
    <Button
      asChild
      className={`min-h-[44px] bg-gradient-rainbow hover:opacity-90 ${buttonClassName}`}
    >
      <a
        href={calUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Calendar className="w-4 h-4 mr-2" />
        {buttonText}
        <ExternalLink className="w-3 h-3 ml-2" />
      </a>
    </Button>
  );
};

export default CalComDirectLink;
