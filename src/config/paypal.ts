// Phase 5: PayPal LIVE Configuration

export const PAYPAL_CONFIG = {
  clientId: "AcyKBVLisAtpIw3mMZinatuLI59JixI8_z9HqbsaU2h3mcnHnyAGDV1IE1nQm4dDyB6yKkD6oltJQcTJ",
  currency: "ZAR",
  intent: "capture",
  environment: "production", // LIVE MODE
};

export const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CONFIG.clientId,
  currency: PAYPAL_CONFIG.currency,
  intent: PAYPAL_CONFIG.intent,
  locale: "en_ZA",
};
