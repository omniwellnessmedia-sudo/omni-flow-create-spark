import ServiceDetailShell from "@/components/services/ServiceDetailShell";
import { CLAY } from "@/components/services/spectrum";

/**
 * Business consulting, on the shared Spectrum detail shell. Offers and
 * prices render from the rate card's clarity band; this file carries only
 * this page's voice.
 */
const BusinessConsulting = () => (
  <ServiceDetailShell
    bandId="clarity"
    eyebrow="Business consulting"
    title={
      <>
        Scale your conscious business, <em style={{ color: CLAY }}>on evidence.</em>
      </>
    }
    lede="Strategic business development for wellness and impact ventures: positioning, offers, partnerships and revenue plans that hold up in the market. We start small on purpose, with a session or an audit, so bigger decisions rest on something real."
    image={{
      // Was a Cape Town landscape from a location shoot. A good photograph
      // and the wrong one over a page whose promise is "on evidence": a
      // landscape shows nothing being decided. Two people going through
      // printed figures does.
      src: "/services/consulting-hero.webp",
      alt: "Two people going through printed charts and figures across a table",
    }}
    highlights={[
      {
        heading: "Decisions, not decks",
        detail: "Every engagement ends in a written action map or scored priorities you can act on the same week.",
      },
      {
        heading: "Wellness is our market",
        detail: "We work daily with practitioners, studios, NGOs and conscious brands in South Africa, so advice lands in your reality.",
      },
      {
        heading: "AI where it earns its keep",
        detail: "Practical tool and workflow recommendations that save hours, never technology for its own sake.",
      },
    ]}
    closing="Bring the decision you are wrestling with. One session is usually enough to see the path."
  />
);

export default BusinessConsulting;
