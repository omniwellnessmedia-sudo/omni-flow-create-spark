import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFirstCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onClick?: () => void;
}

const MobileFirstCard: React.FC<MobileFirstCardProps> = ({
  title,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = 'default',
  padding = 'md',
  clickable = false,
  onClick
}) => {
  const isMobile = useIsMobile();

  const variantClasses = {
    default: 'border border-border bg-card',
    elevated: 'border border-border bg-card shadow-lg hover:shadow-xl',
    outlined: 'border-2 border-primary/20 bg-card/50 backdrop-blur-sm'
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-6'
  };

  const mobileTouchClasses = isMobile && clickable 
    ? 'active:scale-98 transition-transform duration-100' 
    : '';

  return (
    <Card
      className={cn(
        'rounded-xl transition-all duration-200',
        variantClasses[variant],
        clickable && 'cursor-pointer hover:shadow-md',
        mobileTouchClasses,
        isMobile && 'min-h-[44px]', // Minimum touch target size
        className
      )}
      onClick={onClick}
    >
      {title && (
        <CardHeader className={cn(paddingClasses[padding], headerClassName)}>
          <CardTitle className={cn(
            'text-lg font-semibold text-foreground',
            isMobile && 'text-base'
          )}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(
        title ? 'pt-0' : '',
        paddingClasses[padding],
        contentClassName
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MobileFirstCard;