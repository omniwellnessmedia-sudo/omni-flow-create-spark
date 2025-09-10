import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

interface MobileOptimizedButtonProps {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: ReactNode;
}

const MobileOptimizedButton: React.FC<MobileOptimizedButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  icon
}) => {
  const isMobile = useIsMobile();

  // Mobile-optimized sizes - minimum 44px touch targets
  const mobileSize = isMobile ? (size === 'sm' ? 'default' : size) : size;
  
  const gradientClass = variant === 'gradient' 
    ? 'bg-gradient-rainbow hover:opacity-90 text-white font-semibold border-0' 
    : '';

  const actualVariant = variant === 'gradient' ? 'default' : variant;

  return (
    <Button
      type={type}
      variant={actualVariant}
      size={mobileSize}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'transition-all duration-200 font-medium',
        isMobile && 'min-h-[44px] min-w-[44px] text-base', // Minimum touch target
        fullWidth && 'w-full',
        gradientClass,
        isMobile && 'active:scale-95', // Touch feedback
        className
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
};

export default MobileOptimizedButton;