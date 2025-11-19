import { Button } from "@/components/ui/button";
import { useConsciousAffiliate } from "@/hooks/useConsciousAffiliate";

export const FooterCTA = () => {
  const { trackAffiliateClick } = useConsciousAffiliate();

  const handleMainCTA = async () => {
    const url = "https://www.camerastuff.co.za/?a_aid=omniwellnessmedia";
    await trackAffiliateClick(
      "CameraStuff Main Store",
      "conscious_media_infrastructure_footer",
      url,
      "explore_camerastuff"
    );
    window.open(url, "_blank");
  };

  return (
    <section className="bg-gradient-to-r from-primary to-primary/90 py-20 px-10 lg:px-20 text-center">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-bold text-3xl lg:text-4xl text-white mb-4">
          Ready to Build Your Conscious Media Infrastructure?
        </h2>
        
        <p className="text-[17px] text-white/90 leading-relaxed max-w-[700px] mx-auto mb-8">
          All equipment handpicked to support respectful, authentic, professional 
          storytelling. Partnered with CameraStuff—South Africa's trusted creative 
          partner since 2006, supporting local infrastructure and accessible professional tools.
        </p>

        <Button
          onClick={handleMainCTA}
          className="bg-white text-primary hover:bg-white/95 px-8 py-3 text-base font-bold rounded-md transition-colors mb-5"
        >
          Explore CameraStuff Today →
        </Button>

        <div className="mt-5">
          <a
            href="/conscious-media-partnership"
            className="text-[15px] text-white/80 underline hover:text-white transition-colors"
          >
            Learn about our conscious media framework
          </a>
        </div>
      </div>
    </section>
  );
};
