export type SubscriptionTier = "free" | "pro";

export const useProSubscription = (pricingInfo?: Record<string, unknown> | null) => {
  const tier = (pricingInfo?.subscription_tier as SubscriptionTier) ?? "free";
  return { isPro: tier === "pro", tier };
};
