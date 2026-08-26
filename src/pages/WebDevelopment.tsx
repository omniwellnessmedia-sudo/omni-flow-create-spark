import ServiceDetailShell from "@/components/services/ServiceDetailShell";
import { CLAY } from "@/components/services/spectrum";

/**
 * Web development, on the shared Spectrum detail shell. Offers and prices
 * render from the rate card's build band; this file carries only voice.
 */
const WebDevelopment = () => (
  <ServiceDetailShell
    bandId="build"
    eyebrow="Web development"
    title={
      <>
        Build pages that <em style={{ color: CLAY }}>convert,</em> not just exist.
      </>
    }
    lede="Fast, search friendly websites and landing pages for wellness brands and campaigns, built mobile first and measured from day one. Fixed scopes with fixed prices, so you know what you are buying before we begin."
    highlights={[
      {
        heading: "One page, one job",
        detail: "Each build is organised around a single offer and a single route to enquiry, booking or payment.",
      },
      {
        heading: "Measured, always",
        detail: "Analytics and conversion tracking are part of the build, not an afterthought, so you see what the page earns.",
      },
      {
        heading: "Honest scope",
        detail: "What is included and excluded is written down up front, with one consolidated revision round on entry packages.",
      },
    ]}
    closing="Have the offer? We can have it earning on a page of its own within a sprint."
  />
);

export default WebDevelopment;
