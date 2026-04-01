import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Home, LogOut } from "lucide-react";
import { IMAGES } from "@/lib/images";

interface ProviderHeaderProps {
  hasProfile: boolean;
  onLogout: () => void;
}

const ProviderHeader = ({ hasProfile, onLogout }: ProviderHeaderProps) => (
  <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
    <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/" className="shrink-0">
          <img src={IMAGES.logos.omniHorizontal} alt="Omni" className="h-7 md:h-8 w-auto object-contain" />
        </Link>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-border">/</span>
          <span className="text-sm font-medium">Provider</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {hasProfile && (
          <Button variant="ghost" size="sm" asChild className="h-8 px-2.5 text-primary">
            <Link to="/provider/sandy-mitchell" target="_blank">
              <Eye className="h-3.5 w-3.5 md:mr-1.5" />
              <span className="hidden md:inline text-xs">Preview Profile</span>
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="sm" asChild className="h-8 px-2.5">
          <Link to="/">
            <Home className="h-3.5 w-3.5 md:mr-1.5" />
            <span className="hidden md:inline text-xs">Site</span>
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={onLogout} className="h-8 px-2.5 text-muted-foreground">
          <LogOut className="h-3.5 w-3.5 md:mr-1.5" />
          <span className="hidden sm:inline text-xs">Logout</span>
        </Button>
      </div>
    </div>
  </div>
);

export default ProviderHeader;
