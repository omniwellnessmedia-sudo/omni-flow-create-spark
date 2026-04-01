import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ToggleLeft, ToggleRight, Clock } from "lucide-react";

interface ServiceCardProps {
  service: any;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

const ServiceCard = memo(({ service, onToggle, onDelete }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`border-border/50 transition-all ${!service.active ? "opacity-60" : "hover:shadow-md"}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="font-medium text-sm truncate">{service.title}</h4>
              <Badge variant={service.active ? "default" : "secondary"} className="text-[10px] shrink-0">
                {service.active ? "Live" : "Draft"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{service.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {service.price_zar != null && (
                <span className="font-medium text-foreground">R{service.price_zar}</span>
              )}
              {service.price_wellcoins != null && (
                <span className="text-primary">{service.price_wellcoins} WC</span>
              )}
              {service.duration_minutes && (
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{service.duration_minutes}min</span>
              )}
              {service.category && <Badge variant="outline" className="text-[10px]">{service.category}</Badge>}
              {service.is_online && <Badge variant="outline" className="text-[10px]">Online</Badge>}
            </div>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onToggle(service.id, service.active)} title={service.active ? "Deactivate" : "Activate"}>
              {service.active ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigate(`/wellness-exchange/edit-service/${service.id}`)} title="Edit">
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onDelete(service.id)} title="Delete">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ServiceCard.displayName = "ServiceCard";

export default ServiceCard;
