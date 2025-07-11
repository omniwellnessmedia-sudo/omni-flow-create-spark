import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  size?: 'breathable' | 'large' | 'medium';
  background?: 'light' | 'white' | 'gradient';
  id?: string;
}

export const Section = ({ 
  children, 
  className, 
  size = 'large', 
  background = 'white',
  id
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
    <section 
      id={id}
      className={cn(
        "w-full",
        sizeClasses[size],
        backgroundClasses[background],
        className
      )}
    >
      <div className="container-width">
        {children}
      </div>
    </section>
  );
};