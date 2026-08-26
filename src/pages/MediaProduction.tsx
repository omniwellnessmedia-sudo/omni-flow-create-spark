import ServiceDetailShell from "@/components/services/ServiceDetailShell";
import { CLAY } from "@/components/services/spectrum";
import { IMAGES } from "@/lib/images";

/**
 * Media production, on the shared Spectrum detail shell. Offers and prices
 * render from the rate card's content band; production itself is quoted on
 * scope, which the band and catalogue state plainly.
 */
const MediaProduction = () => (
  <ServiceDetailShell
    bandId="content"
    eyebrow="Media production"
    title={
      <>
        Stories with <em style={{ color: CLAY }}>craft and conscience.</em>
      </>
    }
    lede="Purpose driven video, photography and campaign content produced in Cape Town, from concept and scripting through shoot, edit and delivery. Content packs carry fixed prices below; full production is quoted on scope once we understand the brief."
    image={{
      src: IMAGES.services.artscape,
      alt: "On stage at the Artscape Theatre during an Omni production",
      caption: "On production at the Artscape Theatre, Cape Town.",
    }}
    highlights={[
      {
        heading: "Documentary roots",
        detail: "Our screening nights and campaign films come from the same hands that will hold your story.",
      },
      {
        heading: "Consent and rights, in writing",
        detail: "Participant consent, licensing, raw files and portfolio use are recorded before a camera rolls.",
      },
      {
        heading: "Built to be used",
        detail: "Everything is delivered in the formats your channels actually need, with the campaign copy to match.",
      },
    ]}
    closing="Tell us the story you need told, and we will scope the honest way to tell it."
  />
);

export default MediaProduction;
