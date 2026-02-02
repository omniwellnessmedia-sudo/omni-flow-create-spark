// Phase 5: PayPal LIVE Configuration

export const PAYPAL_CONFIG = {
  clientId: "AcyKBVLisAtpIw3mMZinatuLI59JixI8_z9HqbsaU2h3mcnHnyAGDV1IE1nQm4dDyB6yKkD6oltJQcTJ",
  currency: "USD", // Changed to USD to match RoamBuddy product pricing
  intent: "capture",
  environment: "production", // LIVE MODE
};

export const PAYPAL_OPTIONS = {
  clientId: PAYPAL_CONFIG.clientId,
  currency: PAYPAL_CONFIG.currency,
  intent: PAYPAL_CONFIG.intent,
  // Locale removed to allow PayPal auto-detection for international users
  components: "buttons,card-fields",
};

// Separate options for ZAR transactions (main store)
export const PAYPAL_OPTIONS_ZAR = {
  clientId: PAYPAL_CONFIG.clientId,
  currency: "ZAR",
  intent: PAYPAL_CONFIG.intent,
  locale: "en_ZA",
};
