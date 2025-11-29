import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { destinationCategories } from "@/data/roamBuddyProducts";

interface DestinationTabsProps {
  children: (destination: string) => React.ReactNode;
  defaultDestination?: string;
}

export const DestinationTabs = ({ 
  children, 
  defaultDestination = 'south-africa' 
}: DestinationTabsProps) => {
  return (
    <Tabs defaultValue={defaultDestination} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
        {destinationCategories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            className="text-xs md:text-sm"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {destinationCategories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="space-y-6">
          <div className="text-center mb-8">
            <p className="text-muted-foreground">{category.description}</p>
          </div>
          {children(category.id)}
        </TabsContent>
      ))}
    </Tabs>
  );
};
