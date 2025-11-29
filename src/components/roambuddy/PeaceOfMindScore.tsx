import { Progress } from "@/components/ui/progress";

interface PeaceOfMindScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PeaceOfMindScore = ({ 
  score, 
  size = 'md',
  showLabel = true 
}: PeaceOfMindScoreProps) => {
  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {showLabel && (
          <span className={`font-medium ${sizeClasses[size]}`}>
            Peace of Mind Score
          </span>
        )}
        <span className={`font-bold ${getScoreColor()} ${sizeClasses[size]}`}>
          {score}/100 {showLabel && `(${getScoreLabel()})`}
        </span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
};
