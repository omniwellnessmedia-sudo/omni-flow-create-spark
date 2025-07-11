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
    light: 'bg-gradient-to-br from-gray-50 to-purple-50',
    white: 'bg-white',
    gradient: 'bg-gradient-to-br from-violet-50 via-white to-cyan-50'
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