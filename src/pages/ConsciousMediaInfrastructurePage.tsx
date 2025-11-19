import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";
import { ExternalLink } from "lucide-react";

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
    imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=375&fit=crop",
    productUrl: "https://camerastuff.co.za/products/neewer-26x3m-lightweight-backdrop-stand-kit-with-clamps-sandbags",
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 2,
    name: "Neewer 660 Pro II RGB WW 50W Panel (2-light kit)",
    description: "Professional RGB variable-color LED panel system with 2 units, 50W each. Adjustable color temperature (3200K-5600K), CRI 95+, wireless remote control. Includes light stands and softboxes.",
    whyWeChoseThis: "Enables natural-feeling lighting that respects wellness spaces. Variable color control allows documenters to match retreat environments rather than imposing artificial aesthetics. Generates minimal heat for long meditation sessions.",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=375&fit=crop",
    productUrl: "https://camerastuff.co.za/products/neewer-660-pro-ii-rgb-ww-50w-led-constant-light-panel-kit-two-lights",
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 3,
    name: "Neewer SNL660 45W Bi-Colour 2-Pack",
    description: "Compact bi-color LED panels (3200K-5600K) with 45W output. Lightweight, portable design with wireless remote and light stand compatibility. Ideal for intimate documentation spaces.",
    whyWeChoseThis: "Professional quality lighting without excessive heat. Perfect for long wellness sessions where practitioner comfort is essential. Two-pack allows flexible positioning in smaller retreat spaces.",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&h=375&fit=crop",
    productUrl: "https://camerastuff.co.za/products/neewer-2-x-pack-snl660-45w-bi-colour-led-constant-light-panel-kit",
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 4,
    name: "Neewer 660 Pro 50W RGB WW Single Panel",
    description: "Individual 50W RGB variable-color LED panel. Full spectrum control (3200K-5600K), CRI 95+, wireless remote, light stand included. Flexible single-unit deployment.",
    whyWeChoseThis: "Ideal for one-on-one practitioner documentation and intimate retreat settings. Offers full professional control while remaining minimally intrusive in sacred spaces.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=375&fit=crop",
    productUrl: "https://camerastuff.co.za/products/neewer-660-pro-50w-rgb-ww-led-video-light-panel",
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 5,
    name: "Backdrop Support Kit (280x300cm)",
    description: "Heavy-duty backdrop system for large-scale documentation. 280x300cm coverage creates immersive, distraction-free settings. Durable construction, quick assembly, multiple backdrop compatibility.",
    whyWeChoseThis: "Creates immersive visual settings that minimize distractions and frame the authentic retreat experience. Professional backdrop systems communicate respect for the practitioner and the documentation process.",
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=375&fit=crop",
    productUrl: "https://camerastuff.co.za/products/camerastuff-bgs-28x3a-backdrop-stand-support-kit-280x300cm",
    channel: "retreat-documentation",
    imagePosition: 'left'
  },
  {
    id: 6,
    name: "Neewer CM5 2-Pack Lavalier Mics",
    description: "Professional wired lavalier/lapel microphones (2-pack). Omnidirectional condenser pickup, 3.5mm connector, cable length 2.5m. Compact, unobtrusive design for interview and practitioner documentation.",
    whyWeChoseThis: "Captures practitioner voices authentically without obtrusive boom equipment. Lavalier design respects physical space while ensuring clear audio—essential for consent-forward documentation.",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&h=375&fit=crop",
    productUrl: "https://camerastuff.co.za/products/neewer-cm5-2-pack-wired-lavalier-lapel-omnidirectional-condenser-microphone",
    channel: "practitioner-equipment",
    imagePosition: 'right'
  },
  {
    id: 7,
    name: "Neewer NW-XJB02S Camera Sling Backpack",
    description: "Professional camera sling backpack with ergonomic single-shoulder design. Multiple compartments, weatherproof material, compatible with DSLR/mirrorless and accessories. Enables hands-free mobility.",
    whyWeChoseThis: "Portable design allows documenters to move freely and respectfully through retreat spaces. Professional carrying solution ensures equipment protection while maintaining retreat environment flow and participant trust.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=375&fit=crop",
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
        <div className="w-full lg:w-[45%]">
          <img
            src={product.imageUrl}
            alt={`${product.name} - Professional media equipment`}
            className="w-full aspect-[4/3] object-cover rounded-lg shadow-lg"
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
      {/* Hero Section */}
      <Section className="py-12 lg:py-15">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Conscious Media Infrastructure
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked equipment for authentic storytelling
          </p>
        </div>
      </Section>

      {/* Products Section */}
      <Section size="large">
        <div className="max-w-6xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      {/* Footer CTA Section */}
      <Section className="bg-muted py-12 lg:py-15 mt-12 lg:mt-15">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready to Document Your Wellness Journey?
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            All equipment handpicked to support conscious, respectful, authentic storytelling. 
            CameraStuff is proudly South African since 2006, supporting local creative infrastructure.
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
