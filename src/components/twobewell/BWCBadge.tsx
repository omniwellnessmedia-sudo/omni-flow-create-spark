import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const BWCBadge = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300 cursor-help"
          >
            <Award className="w-3 h-3 mr-1" />
            BWC Endorsed
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-semibold mb-1">Beauty Without Cruelty Certified</p>
          <p className="text-sm">
            This product meets BWC's strict standards for cruelty-free, vegan, and ethical production. 
            No animal testing, no animal ingredients, just pure plant-based goodness.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
