import { ReactNode } from "react";
import { useFeatureFlag } from "@/hooks/useFeatureFlags";

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showWhileLoading?: boolean;
}

/**
 * FeatureGate component that conditionally renders children based on feature flag status.
 * 
 * @param feature - The feature_key to check
 * @param children - Content to render when feature is enabled
 * @param fallback - Optional content to render when feature is disabled
 * @param showWhileLoading - Whether to show children while loading (default: false)
 */
export const FeatureGate = ({
  feature,
  children,
  fallback = null,
  showWhileLoading = false,
}: FeatureGateProps) => {
  const { isEnabled, loading } = useFeatureFlag(feature);

  if (loading) {
    return showWhileLoading ? <>{children}</> : null;
  }

  return isEnabled ? <>{children}</> : <>{fallback}</>;
};

export default FeatureGate;
