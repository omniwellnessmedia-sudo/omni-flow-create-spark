import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Heart, 
  GraduationCap,
  Megaphone,
  Building2,
  Search
} from "lucide-react";

interface Program {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  badge: string;
  color: string;
}

const programs: Program[] = [
  {
    id: "influencer",
    title: "Influencer Partnership Program",
    description: "Partner with us to promote wellness and conscious living. Earn commissions while making a positive impact in your community.",
    icon: Megaphone,
    category: "Content Creators",
    badge: "Open",
    color: "text-pink-600 bg-pink-50 border-pink-200"
  },
  {
    id: "brand",
    title: "Brand Collaboration",
    description: "Align your brand with wellness initiatives. Co-create campaigns that resonate with conscious consumers and drive meaningful change.",
    icon: Building2,
    category: "Brands & Businesses",
    badge: "Partnership",
    color: "text-blue-600 bg-blue-50 border-blue-200"
  },
  {
    id: "csr",
    title: "CSR & Community Impact",
    description: "Integrate your corporate social responsibility with grassroots wellness projects. Create lasting change in communities.",
    icon: Heart,
    category: "Corporate",
    badge: "CSR",
    color: "text-green-600 bg-green-50 border-green-200"
  },
  {
    id: "researcher",
    title: "Wellness Research Initiative",
    description: "Collaborate on research projects exploring holistic wellness, traditional healing, and community health outcomes.",
    icon: Search,
    category: "Researchers",
    badge: "Academic",
    color: "text-purple-600 bg-purple-50 border-purple-200"
  },
  {
    id: "changemaker",
    title: "Changemaker Network",
    description: "Join a community of activists, social entrepreneurs, and change agents working towards wellness equity and access.",
    icon: TrendingUp,
    category: "Activists",
    badge: "Impact",
    color: "text-orange-600 bg-orange-50 border-orange-200"
  },
  {
    id: "educator",
    title: "Education & Training",
    description: "Develop and deliver wellness education programs. Share your expertise through workshops, courses, and community sessions.",
    icon: GraduationCap,
    category: "Educators",
    badge: "Teaching",
    color: "text-indigo-600 bg-indigo-50 border-indigo-200"
  },
];

export const ProgramsList = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Join Our Programs</h2>
        <p className="text-muted-foreground">
          Whether you're an influencer, brand, company, researcher, or changemaker - there's a place for you in our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => {
          const Icon = program.icon;
          return (
            <Card key={program.id} className={`border-2 hover:shadow-lg transition-all duration-200 ${program.color}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${program.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {program.badge}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{program.title}</CardTitle>
                <CardDescription className="text-xs font-medium">
                  {program.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {program.description}
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
