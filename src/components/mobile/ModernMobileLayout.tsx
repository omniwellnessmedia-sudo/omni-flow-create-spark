import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, TrendingUp, Users, Calendar, Star } from 'lucide-react';

interface MobileOptimizedCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'yellow';
  onClick?: () => void;
}

// 2025 Mobile-First Card Component
export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue',
  onClick
}) => {
  const colorClasses = {
    blue: 'from-omni-blue/10 to-omni-blue/20 border-omni-blue/30 text-omni-blue',
    green: 'from-green-500/10 to-green-600/20 border-green-500/30 text-green-600',
    orange: 'from-omni-orange/10 to-omni-orange/20 border-omni-orange/30 text-omni-orange',
    purple: 'from-omni-purple/10 to-omni-purple/20 border-omni-purple/30 text-omni-purple',
    yellow: 'from-yellow-500/10 to-yellow-600/20 border-yellow-500/30 text-yellow-600'
  };

  return (
    <Card 
      className={`
        bg-gradient-to-br ${colorClasses[color]} 
        hover:shadow-lg active:scale-[0.98] 
        transition-all duration-200 
        cursor-pointer touch-manipulation
        min-h-[120px] sm:min-h-[140px]
        border-2
      `}
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses[color].replace('/10', '/20').replace('/20', '/30')}`}>
            {icon}
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs font-medium">
              {trend}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {onClick && (
          <div className="flex justify-end mt-3">
            <ChevronRight className="h-4 w-4 opacity-60" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MobileGridLayoutProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

// 2025 Mobile-First Grid Layout
export const MobileGridLayout: React.FC<MobileGridLayoutProps> = ({ 
  children, 
  columns = 2, 
  gap = 'md' 
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]} auto-rows-fr`}>
      {children}
    </div>
  );
};

interface MobileActionButtonProps {
  label: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

// 2025 Mobile-Optimized Action Button
export const MobileActionButton: React.FC<MobileActionButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false
}) => {
  const sizeClasses = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-omni-blue to-omni-purple hover:opacity-90 text-white shadow-lg',
    secondary: 'bg-gradient-to-r from-omni-orange to-omni-yellow hover:opacity-90 text-white shadow-lg',
    outline: 'border-2 border-omni-blue text-omni-blue hover:bg-omni-blue/10'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-semibold
        active:scale-[0.98] transition-all duration-200
        touch-manipulation
        min-w-[44px]
        flex items-center justify-center gap-2
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </Button>
  );
};

interface MobileSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 2025 Mobile Section Header
export const MobileSectionHeader: React.FC<MobileSectionHeaderProps> = ({
  title,
  subtitle,
  action
}) => {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      
      {action && (
        <MobileActionButton
          label={action.label}
          variant="outline"
          size="sm"
          onClick={action.onClick}
        />
      )}
    </div>
  );
};

// Demo data for mobile showcase
export const getMobileDemoData = () => {
  return {
    stats: [
      {
        title: "WellCoin Balance",
        value: "2,847",
        subtitle: "Available to spend",
        trend: "+5.2%",
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'orange' as const
      },
      {
        title: "Monthly Bookings", 
        value: "47",
        subtitle: "This month",
        trend: "+12%",
        icon: <Calendar className="h-5 w-5" />,
        color: 'blue' as const
      },
      {
        title: "New Clients",
        value: "12", 
        subtitle: "This month",
        trend: "+8%",
        icon: <Users className="h-5 w-5" />,
        color: 'green' as const
      },
      {
        title: "Rating",
        value: "4.8",
        subtitle: "Average rating", 
        trend: "Excellent",
        icon: <Star className="h-5 w-5" />,
        color: 'yellow' as const
      }
    ]
  };
};