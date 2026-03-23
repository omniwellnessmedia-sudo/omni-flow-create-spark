import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface StickyBookingBarProps {
  price: string;
  tourName: string;
  email?: string;
}

const StickyBookingBar = ({ price, tourName, email = "traveltourscapetown@gmail.com" }: StickyBookingBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-black/[0.06] dark:border-white/[0.06] py-3 px-4 sm:px-6 md:hidden">
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="font-heading text-xl text-foreground">{price}<span className="text-sm font-sans text-muted-foreground ml-1">pp</span></p>
        </div>
        <Button
          asChild
          className="rounded-full px-6 py-5 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <a href={`mailto:${email}?subject=Enquiry: ${tourName}&body=Hi,%0A%0AI'd like to enquire about the ${tourName}.%0A%0AGroup size:%0APreferred date:%0A%0AThank you`}>
            <Mail className="w-4 h-4 mr-2" />
            Enquire Now
          </a>
        </Button>
      </div>
    </div>
  );
};

export default StickyBookingBar;
