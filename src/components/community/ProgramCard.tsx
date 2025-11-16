import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ProgramCardProps {
  program: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    benefits: string[];
    eligibility?: string[];
    badge?: string;
  };
  onApply: (programId: string) => void;
}

export const ProgramCard = ({ program, onApply }: ProgramCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4">
            {program.icon}
          </div>
          {program.badge && (
            <Badge variant="secondary" className="bg-accent">
              {program.badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
        <CardDescription className="text-base">{program.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            Program Benefits
          </h4>
          <ul className="space-y-2">
            {program.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {program.eligibility && program.eligibility.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
              Eligibility
            </h4>
            <ul className="space-y-1">
              {program.eligibility.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          onClick={() => onApply(program.id)} 
          className="w-full"
          variant="default"
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};
