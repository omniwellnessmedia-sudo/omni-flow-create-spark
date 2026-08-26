import ServiceDetailShell from "@/components/services/ServiceDetailShell";
import { CLAY } from "@/components/services/spectrum";
import { IMAGES } from "@/lib/images";

/**
 * Social media strategy, on the shared Spectrum detail shell. Offers and
 * prices render from the rate card's retainer band; tier rates stay
 * unpublished by rule and are confirmed on enquiry.
 */
const SocialMediaStrategy = () => (
  <ServiceDetailShell
    bandId="retainer"
    eyebrow="Social media strategy"
    title={
      <>
        Communities that <em style={{ color: CLAY }}>stay.</em>
      </>
    }
    lede="Content strategy, calendars and campaign management that grow engaged audiences for wellness and impact brands, without empty vanity metrics. Monthly support is built on source content adapted across platforms, so quality survives the cadence."
    image={{
      src: IMAGES.services.community1,
      alt: "An Omni community wellness project in session",
    }}
    highlights={[
      {
        heading: "Strategy before posting",
        detail: "Every retainer starts from positioning and a calendar, so each post has a job to do.",
      },
      {
        heading: "Community managed",
        detail: "Replies, conversations and moderation are part of the work, because an audience is people.",
      },
      {
        heading: "Reported honestly",
        detail: "Monthly insights on what moved and what did not, with recommendations rather than excuses.",
      },
    ]}
    closing="Ready for a feed that works as hard as you do? Start with the audit."
  />
);

export default SocialMediaStrategy;
