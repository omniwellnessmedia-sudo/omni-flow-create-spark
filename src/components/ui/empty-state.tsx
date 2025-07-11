import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'marketplace' | 'partners' | 'default';
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  variant = 'default'
}: EmptyStateProps) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'marketplace':
        return <Search className="w-16 h-16 text-gray-400" />;
      case 'partners':
        return <Users className="w-16 h-16 text-gray-400" />;
      default:
        return <Plus className="w-16 h-16 text-gray-400" />;
    }
  };

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          {icon || getDefaultIcon()}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant="premium"
            className="card-button-standard"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};