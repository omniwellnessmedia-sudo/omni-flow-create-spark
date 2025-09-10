import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'default' | 'subtle' | 'gradient';
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  maxWidth = '7xl',
  padding = 'md',
  background = 'default'
}) => {
  const isMobile = useIsMobile();
  
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-3 py-2',
    md: 'px-4 py-3 sm:px-6 sm:py-4',
    lg: 'px-6 py-4 sm:px-8 sm:py-6'
  };

  const backgroundClasses = {
    default: 'bg-background',
    subtle: 'bg-gradient-subtle',
    gradient: 'bg-gradient-hero'
  };

  return (
    <div className={cn(
      'w-full mx-auto',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      backgroundClasses[background],
      isMobile && 'min-h-screen',
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;