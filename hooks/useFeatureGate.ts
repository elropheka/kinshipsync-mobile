import { useMemo } from 'react';
import { useSubscription } from './useSubscription';
import { FeatureKey, Features } from '@/config/features';

type FeatureName = keyof typeof Features;

export function useFeatureGate(feature: FeatureName): boolean {
  const { subscription, availablePlans, appFeatures } = useSubscription();
  const featureKey = Features[feature];

  return useMemo(() => {
    if (!subscription || !availablePlans.length || !appFeatures.length) {
      return false;
    }

    const appFeature = appFeatures.find((f) => f.key === featureKey);
    if (!appFeature || !appFeature.isActive) {
      return false;
    }

    if (!appFeature.planIds || appFeature.planIds.length === 0) {
      return true;
    }

    return appFeature.planIds.includes(subscription.planId);
  }, [subscription, availablePlans, appFeatures, featureKey]);
}
