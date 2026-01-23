import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CameraStuffProductCard } from "@/components/conscious-media/CameraStuffProductCard";
import { ConsciousnessFrameworkModal } from "@/components/conscious-media/ConsciousnessFrameworkModal";
import { PartnerValuesSection } from "@/components/conscious-media/PartnerValuesSection";
import { ArrowRight, Camera } from "lucide-react";

const ConsciousMediaPartnershipPage = () => {
  const products = [
    {
      productName: "Godox ML100Bi 120W Portable LED Kit",
      productSlug: "godox-ml100bi-kit-1-120w-bi-colour-portable-led-video-light-15-36-lens-power-bank-holder-kit",
      productImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
      headline: "Transform Moments Into Narratives",
      subheading: "Professional retreat documentation through conscious practice",
      description:
        "Your guests experience profound transformation. The Godox ML100Bi ensures that journey is documented authentically—capturing personal evolution with professional quality. Portable enough for any retreat setting, powerful enough for broadcast-quality documentation. Bi-colour temperature (2800K-6500K) • High CRI for true-to-life color • 30m wireless app control • Compact, travel-ready design.",
      consciousnessNarrative:
        "Retreat documentation becomes part of the transformation narrative itself—visual evidence of inner evolution.",
      useCases: ["Retreat Documentation", "Transformation Capture", "Personal Evolution"],
      channel: "retreat-documentation-camerastuff",
      ctaText: "Explore Retreat Documentation",
      wellnessCategory: "retreats",
      consciousnessIntent: "authentic-transformation-documentation",
    },
    {
      productName: "Godox Litemons LP400R 36W RGB Panel",
      productSlug: "godox-litemons-lp400r-36w-rgb-ww-led-video-light-panel",
      productImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      headline: "Empower Practitioner Voices",
      subheading: "Give conscious instructors tools to share their craft",
      description:
        "Yoga teachers, meditation facilitators, somatic practitioners—they deserve equipment that honors their work. The Godox Litemons LP400R is compact, reliable, and designed for authentic content creation. 36W RGB-WW LED panel • 1800K-10,000K color range • 14 creative effects • Lightweight, portable • App control.",
      consciousnessNarrative:
        "Conscious practitioners build authentic followings by sharing their genuine practice—not extracted content. This gear enables their voice.",
      useCases: ["Yoga Instruction", "Meditation Content", "Practitioner Content"],
      channel: "practitioner-equipment-conscious",
      ctaText: "Enable Practitioner Content",
      wellnessCategory: "yoga-meditation",
      consciousnessIntent: "practitioner-empowerment",
    },
    {
      productName: "Godox Litemons LA150Bi 190W LED",
      productSlug: "godox-la150bi-190w-litemons-bi-color-led-constant-light",
      productImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",
      headline: "Broadcast-Quality Wellness Content",
      subheading: "Infrastructure for guided meditations, teaching, interviews",
      description:
        "The most transformative wellness moments are often voice-centric—guided meditations, teaching narratives, practitioner interviews. The Godox Litemons LA150Bi delivers professional illumination for authentic, high-quality wellness content. 190W bi-colour constant light • Bowens S-type mount • Adjustable 0-100% output • Special effects mode • Portable design.",
      consciousnessNarrative:
        "Educational tourism, meditation guidance, and wellness interviews deserve broadcast-quality production infrastructure that supports South African creators.",
      useCases: ["Educational Content", "Guided Meditations", "Wellness Interviews"],
      channel: "conscious-content-creation-power",
      ctaText: "Build Professional Content",
      wellnessCategory: "education",
      consciousnessIntent: "broadcast-quality-infrastructure",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Enhanced with Omni brand colors */}
      <section className="relative py-32 overflow-hidden">
        {/* Background image with higher opacity */}
        <div className="absolute inset-0 bg-[url('https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/General%20Images/Omni_Wellness_Media_Banner.jpg')] bg-cover bg-center" />
        
        {/* Omni brand gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#339999]/80 via-[#B366CC]/60 to-[#F5923A]/70" />
        
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30">
              <Camera className="w-4 h-4 mr-2 inline" />
              Conscious Media Infrastructure
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-white drop-shadow-lg">
              Conscious Media Infrastructure
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Document your wellness journey authentically. Empower conscious practitioners.
              Support South African capacity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <ConsciousnessFrameworkModal />
              <Button 
                size="lg" 
                className="gap-2 bg-white text-primary hover:bg-white/90"
                onClick={() => document.getElementById('partnership-cta')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Partnership
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Values Section */}
      <PartnerValuesSection />

      {/* Products Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Featured Equipment
            </Badge>
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
              Professional Tools for Conscious Practice
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each piece of equipment is selected for its ability to enable authentic
              storytelling while supporting South African creative infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <CameraStuffProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="partnership-cta" className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Ready to Build Your Conscious Media Infrastructure?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Partner with us to create visual documentation that honors transformation,
            empowers practitioners, and supports South African creative communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ConsciousnessFrameworkModal />
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://www.camerastuff.co.za/?a_aid=omniwellnessmedia"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                Visit CameraStuff
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConsciousMediaPartnershipPage;
