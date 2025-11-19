import UnifiedNavigation from "@/components/navigation/UnifiedNavigation";
import { HeroHeader } from "@/components/conscious-media/HeroHeader";
import { WhyCameraStuffSection } from "@/components/conscious-media/WhyCameraStuffSection";
import { FeaturedProductCard } from "@/components/conscious-media/FeaturedProductCard";
import { TestimonialsSection } from "@/components/conscious-media/TestimonialsSection";
import { FooterCTA } from "@/components/conscious-media/FooterCTA";

const ConsciousMediaInfrastructurePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavigation />
      
      <HeroHeader />
      
      <WhyCameraStuffSection />

      {/* Product 1: Godox Professional Lighting System */}
      <FeaturedProductCard
        audienceBadge="For Retreat Centers & Institutions"
        productName="Godox Professional Lighting System"
        priceRange="R35,000 - R65,000 (depending on configuration)"
        whatItIncludes="Professional Godox strobes (AD300 or AD400 Pro), large parabolic umbrellas, diffusion covers, heavy-duty light stands, and protective carrying cases. Complete studio-grade system for documenting transformative moments with broadcast-quality clarity."
        whyWeChose="Your participants are sharing sacred practices. Your documentation must honor that trust with professional quality that captures authentic emotion without intrusion. This system creates cinema-grade lighting that feels natural—participants forget the equipment exists, yet every frame radiates intentional beauty. When you're documenting healing journeys, quality isn't vanity—it's respect."
        whoShouldGet={[
          "✓ Retreat centers documenting 10+ programs annually",
          "✓ Educational institutions teaching transformative practices",
          "✓ Research teams capturing longitudinal wellness studies",
          "✓ Professional documentary crews telling conscious stories"
        ]}
        ctaText="Explore Professional Bundles on CameraStuff →"
        ctaLink="https://camerastuff.co.za/collections/all?a_aid=omniwellnessmedia"
        imageUrl="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop"
        imageAlt="Godox professional lighting system with strobes and modifiers"
        imageOnRight={false}
      />

      {/* Product 2: Studio Backdrop System */}
      <FeaturedProductCard
        audienceBadge="For Retreat Operators & Content Studios"
        productName="Studio Backdrop System with Reeling"
        priceRange="R25,000 - R45,000 (includes ceiling mount system)"
        whatItIncludes="Professional 2.75m seamless paper backdrop system with ceiling/wall mounting rails, multiple color options, and motorized or manual reeling. Transforms any space into an intentional setting that honors your work without overwhelming your participants."
        whyWeChose="Sacred practices deserve intentional settings. A professional backdrop communicates 'we value this work' while creating visual consistency that participants remember. Your footage becomes timeless—no distracting backgrounds, no visual chaos, just focus on the practice itself. When someone watches your content years later, they see the teaching, not the clutter."
        whoShouldGet={[
          "✓ Yoga studios creating signature teaching content",
          "✓ Retreat centers building their visual brand identity",
          "✓ Wellness educators packaging online courses",
          "✓ Practitioners documenting certification programs"
        ]}
        ctaText="Browse Backdrop Systems on CameraStuff →"
        ctaLink="https://camerastuff.co.za/collections/backdrops?a_aid=omniwellnessmedia"
        imageUrl="https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800&h=800&fit=crop"
        imageAlt="Professional backdrop system with ceiling mount and canvas rolls"
        imageOnRight={true}
      />

      {/* Product 3: Godox LED Lighting Kit */}
      <FeaturedProductCard
        audienceBadge="For Documenters & Educators"
        productName="Godox Professional LED Lighting Kit"
        priceRange="R18,000 - R28,000"
        whatItIncludes="Godox Litemon or SL-series professional LED panels (190W-230W), flicker-free constant lighting, professional light stands, large diffusion umbrellas, and road-ready carrying cases. Silent operation, zero heat generation, perfect for capturing long meditation sessions or multi-hour workshops without participant discomfort."
        whyWeChose="Conscious documentation requires invisible support. No flash. No heat. No noise. Just steady, natural-feeling light that allows practitioners to stay present while you capture their authentic practice. LED technology means you can document 4-hour plant medicine ceremonies or full-day retreats without interrupting the sacred container. Quality light = quality respect."
        whoShouldGet={[
          "✓ Wellness videographers building documentary portfolios",
          "✓ Meditation retreat documenters capturing silent practice",
          "✓ Educational videographers filming immersive programs",
          "✓ Practitioners creating teaching content while maintaining sacred space"
        ]}
        ctaText="Shop LED Lighting Kits on CameraStuff →"
        ctaLink="https://camerastuff.co.za/collections/lighting?a_aid=omniwellnessmedia"
        imageUrl="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop"
        imageAlt="Godox LED continuous lighting panel with stand and diffuser"
        imageOnRight={false}
      />

      {/* Product 4: Professional Wireless Audio Kit */}
      <FeaturedProductCard
        audienceBadge="For All Conscious Documenters"
        productName="Professional Wireless Audio Kit"
        priceRange="R3,500 - R8,000"
        whatItIncludes="Neewer wireless lavalier microphone system with transmitter, receiver, charging case, and all adapters. Crystal-clear audio up to 50m range with reliable transmission. Captures wisdom without visible boom mics or tangled cables interrupting the visual frame."
        whyWeChose="Great wisdom deserves to be heard clearly. When a teacher shares a breakthrough insight during a ceremony, or a participant describes their healing journey—muddy audio is disrespectful to their story. Professional audio captures every word with clarity, allowing your audience to truly receive the teaching. Invisible equipment, visible impact. Your content becomes shareable, quotable, transformative—because people can actually hear it."
        whoShouldGet={[
          "✓ Everyone conducting video interviews or testimonials",
          "✓ Practitioners recording teaching content or guided meditations",
          "✓ Documentary teams capturing ceremony wisdom",
          "✓ Anyone whose content includes spoken wisdom worth preserving"
        ]}
        ctaText="Browse Audio Solutions on CameraStuff →"
        ctaLink="https://camerastuff.co.za/collections/microphones?a_aid=omniwellnessmedia"
        imageUrl="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=800&fit=crop"
        imageAlt="Neewer wireless lavalier microphone system with transmitter and receiver"
        imageOnRight={true}
      />

      {/* Product 5: Professional Camera Backpack */}
      <FeaturedProductCard
        audienceBadge="For Mobile Conscious Documenters"
        productName="Professional Gear Backpack & Accessories"
        priceRange="R2,000 - R5,500"
        whatItIncludes="Professional camera sling or backpack with weatherproof construction, customizable padded compartments, quick-access design, adjustable shoulder/chest straps, rain cover, and organizational accessories. Protects thousands of rands of equipment while keeping you mobile and respectful in retreat spaces."
        whyWeChose="Documentary work is movement. You're following ceremonies through forests, capturing sunrise practices, documenting multi-location workshops. Your gear needs protection, but your hands need freedom to honor the space. A professional backpack becomes invisible—it just works. You move with respect, your equipment stays safe, and participants never see you fumbling with bags. Professional organization = professional presence."
        whoShouldGet={[
          "✓ Documentary crews working in nature or multi-location retreats",
          "✓ Traveling practitioners capturing content across venues",
          "✓ Educators documenting field programs and outdoor workshops",
          "✓ Anyone carrying camera equipment through sacred or sensitive spaces"
        ]}
        ctaText="Explore Gear & Accessories on CameraStuff →"
        ctaLink="https://camerastuff.co.za/collections/bags-cases?a_aid=omniwellnessmedia"
        imageUrl="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop"
        imageAlt="Professional camera backpack with weatherproof construction and compartments"
        imageOnRight={false}
      />

      <TestimonialsSection />
      
      <FooterCTA />
    </div>
  );
};

export default ConsciousMediaInfrastructurePage;
