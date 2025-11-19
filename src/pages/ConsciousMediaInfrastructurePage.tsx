import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { ExternalLink } from "lucide-react";
import { WhyCameraStuffSection } from "@/components/conscious-media/WhyCameraStuffSection";
import { TestimonialsSection } from "@/components/conscious-media/TestimonialsSection";
import { CreativeExamplesSection } from "@/components/conscious-media/CreativeExamplesSection";
import SiteHeader from "@/components/SiteHeader";

interface Product {
  id: number;
  name: string;
  description: string;
  whyWeChoseThis: string;
  imageUrl: string;
  productUrl: string;
  channel: string;
  imagePosition: 'left' | 'right';
}

const products: Product[] = [
  {
    id: 1,
    name: "Backdrop Stand Kit",
    description: "Professional backdrop support system. Lightweight aluminum frame with integrated clamps and sandbag stability. Easy setup and takedown for mobile documentation.",
    whyWeChoseThis: "Creates intentional settings for authentic documentary capture without digital manipulation. Respects the natural environment while supporting professional documentation practice.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-2-6x3m-lightweight-backdrop-stand-kit-clamps-sandbags-camerastuff-online-shop-133.webp?v=1752090264&width=1540",
    productUrl: "https://camerastuff.co.za/products/neewer-26x3m-lightweight-backdrop-stand-kit-with-clamps-sandbags",
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 2,
    name: "Neewer 660 Pro II RGB WW 50W Panel (2-light kit)",
    description: "Professional RGB variable-color LED panel system with 2 units, 50W each. Adjustable color temperature (3200K-5600K), CRI 95+, wireless remote control. Includes light stands and softboxes.",
    whyWeChoseThis: "Enables natural-feeling lighting that respects wellness spaces. Variable color control allows documenters to match retreat environments rather than imposing artificial aesthetics. Generates minimal heat for long meditation sessions.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-rgb660-pro-ii-660-rgb-ww-50w-led-constant-light-panel-kit-two-lights-camerastuff-481.webp",
    productUrl: "https://camerastuff.co.za/products/neewer-660-pro-ii-rgb-ww-50w-led-constant-light-panel-kit-two-lights",
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 3,
    name: "Neewer SNL660 45W Bi-Colour 2-Pack",
    description: "Compact bi-color LED panels (3200K-5600K) with 45W output. Lightweight, portable design with wireless remote and light stand compatibility. Ideal for intimate documentation spaces.",
    whyWeChoseThis: "Professional quality lighting without excessive heat. Perfect for long wellness sessions where practitioner comfort is essential. Two-pack allows flexible positioning in smaller retreat spaces.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-2-x-pack-snl660-45w-bi-colour-led-constant-light-panel-kit-camerastuff-online-shop-809.jpg?v=1738762359&width=840",
    productUrl: "https://camerastuff.co.za/products/neewer-2-x-pack-snl660-45w-bi-colour-led-constant-light-panel-kit",
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 4,
    name: "Neewer 660 Pro 50W RGB WW Single Panel",
    description: "Individual 50W RGB variable-color LED panel. Full spectrum control (3200K-5600K), CRI 95+, wireless remote, light stand included. Flexible single-unit deployment.",
    whyWeChoseThis: "Ideal for one-on-one practitioner documentation and intimate retreat settings. Offers full professional control while remaining minimally intrusive in sacred spaces.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-660-pro-50w-rgb-ww-led-video-light-panel-camerastuff-online-shop-south-africa-1-975.webp?v=1752076268&width=640",
    productUrl: "https://camerastuff.co.za/products/neewer-660-pro-50w-rgb-ww-led-video-light-panel",
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 5,
    name: "Backdrop Support Kit (280x300cm)",
    description: "Heavy-duty backdrop system for large-scale documentation. 280x300cm coverage creates immersive, distraction-free settings. Durable construction, quick assembly, multiple backdrop compatibility.",
    whyWeChoseThis: "Creates immersive visual settings that minimize distractions and frame the authentic retreat experience. Professional backdrop systems communicate respect for the practitioner and the documentation process.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/camerastuff-bgs-2-8x3a-backdrop-stand-support-kit-280x300cm-online-shop-south-africa-2-358.png",
    productUrl: "https://camerastuff.co.za/products/camerastuff-bgs-28x3a-backdrop-stand-support-kit-280x300cm",
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 6,
    name: "Neewer CM5 2-Pack Lavalier Mics",
    description: "Professional wired lavalier/lapel microphones (2-pack). Omnidirectional condenser pickup, 3.5mm connector, cable length 2.5m. Compact, unobtrusive design for interview and practitioner documentation.",
    whyWeChoseThis: "Captures practitioner voices authentically without obtrusive boom equipment. Lavalier design respects physical space while ensuring clear audio—essential for consent-forward documentation.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-cm5-2-pack-wired-lavalier-lapel-omnidirectional-condenser-microphone-camerastuff-877.webp",
    productUrl: "https://camerastuff.co.za/products/neewer-cm5-2-pack-wired-lavalier-lapel-omnidirectional-condenser-microphone",
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 7,
    name: "Neewer NW-XJB02S Camera Sling Backpack",
    description: "Professional camera sling backpack with ergonomic single-shoulder design. Multiple compartments, weatherproof material, compatible with DSLR/mirrorless and accessories. Enables hands-free mobility.",
    whyWeChoseThis: "Portable design allows documenters to move freely and respectfully through retreat spaces. Professional carrying solution ensures equipment protection while maintaining retreat environment flow and participant trust.",
    imageUrl: "https://camerastuff.co.za/cdn/shop/files/neewer-nw-xjb02s-sling-camera-backpack-bag-purple-camerastuff-online-shop-south-africa-2-576.webp",
    productUrl: "https://camerastuff.co.za/products/neewer-nw-xjb02s-camera-sling-backpack-purple",
    channel: "retreat-documentation",
    imagePosition: 'left'
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();

  const handleClick = async () => {
    const affiliateUrl = generateAffiliateLink({
      productSlug: product.productUrl.split('/products/')[1],
      channel: product.channel,
    });

    await trackAffiliateClick(
      product.name,
      product.channel,
      affiliateUrl,
      "conscious media infrastructure",
      "media equipment"
    );

    window.open(affiliateUrl, '_blank');
  };

  const containerClass = product.imagePosition === 'right' 
    ? "flex flex-col lg:flex-row-reverse gap-10 lg:gap-10 items-center"
    : "flex flex-col lg:flex-row gap-10 lg:gap-10 items-center";

  return (
    <div className="py-12 lg:py-15 border-b border-border last:border-b-0">
      <div className={containerClass}>
        {/* Image */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-start">
          <img
            src={product.imageUrl}
            alt={`${product.name} - Professional media equipment`}
            className="w-full max-w-[500px] h-[700px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-[55%] space-y-4">
          <h3 className="text-3xl lg:text-4xl font-bold text-foreground">
            {product.name}
          </h3>
          
          <p className="text-base text-foreground/80 leading-relaxed">
            {product.description}
          </p>
          
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            {product.whyWeChoseThis}
          </p>
          
          <Button
            onClick={handleClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-6"
            size="lg"
          >
            View on CameraStuff
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ConsciousMediaInfrastructurePage = () => {
  const { generateAffiliateLink, trackAffiliateClick } = useConsciousAffiliate();

  const handleMainCTAClick = async () => {
    const affiliateUrl = "https://www.camerastuff.co.za/?a_aid=omniwellnessmedia";
    
    await trackAffiliateClick(
      "CameraStuff Main Store",
      "general-browse",
      affiliateUrl,
      "conscious media infrastructure footer",
      "media equipment"
    );

    window.open(affiliateUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <SiteHeader />
      
      {/* Hero Section */}
      <div className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://dtjmhieeywdvhjxqyxad.supabase.co/storage/v1/object/public/provider-images/Business%20Consulting/DSC00124.jpg"
            alt="Conscious Media Documentation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground drop-shadow-lg">
            Conscious Media Infrastructure
          </h1>
          <p className="text-lg lg:text-xl text-foreground/90 max-w-2xl mx-auto drop-shadow-md">
            Handpicked equipment for authentic storytelling
          </p>
          <p className="text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto">
            Professional tools that respect sacred spaces, honor participants, and support documenters who create with intention
          </p>
        </div>
      </div>

      {/* Why CameraStuff Section */}
      <WhyCameraStuffSection />

      {/* Products Section */}
      <Section size="large">
        <div className="max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Creative Examples Section */}
      <CreativeExamplesSection />

      {/* Enhanced Footer CTA Section */}
      <Section className="bg-muted py-12 lg:py-15 mt-0">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready to Build Your Conscious Media Infrastructure?
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            All equipment handpicked to support respectful, authentic, professional 
            storytelling. Partnered with CameraStuff—proudly South African since 2006—
            supporting local creative infrastructure and accessible professional tools.
          </p>
          <Button
            onClick={handleMainCTAClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Explore CameraStuff
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default ConsciousMediaInfrastructurePage;
