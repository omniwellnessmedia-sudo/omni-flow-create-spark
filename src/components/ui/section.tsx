import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  size?: 'breathable' | 'large' | 'medium';
  background?: 'light' | 'white' | 'gradient';
}

export const Section = ({ 
  children, 
  className, 
  size = 'large', 
  background = 'white' 
}: SectionProps) => {
  const sizeClasses = {
    breathable: 'section-breathable',
    large: 'section-large', 
    medium: 'section-medium'
  };

  const backgroundClasses = {
    light: 'bg-wellhub-light-gradient',
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-wellhub-light to-white'
  };

  return (
    <div className={cn(
      "w-full",
      sizeClasses[size],
      backgroundClasses[background],
      className
    )}>
      <div className="container-width">
        {children}
      </div>
    </div>
  );
};