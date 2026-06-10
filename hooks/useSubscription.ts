import { useState, useCallback, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { useAppAuth } from './useAppAuth';
import { useAuth } from '../context/AuthContext';
import { firestore } from '../services/firebaseConfig';
import * as subscriptionService from '../services/subscriptionService';
import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import {
  SubscriptionPlan,
  UserSubscription,
  AppFeature,
} from '../types/userTypes';
import * as userService from '../services/userService';
import * as WebBrowser from 'expo-web-browser';

export const useSubscription = () => {
  const { user: authUser } = useAppAuth();
  const { isAuthenticated } = useAuth();
  const userId = authUser?.uid;

  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [appFeatures, setAppFeatures] = useState<AppFeature[]>([]);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !isAuthenticated) {
      setSubscription(null);
      return;
    }

    const subDocRef = doc(firestore, 'users', userId, 'subscription', 'current');
    const unsubscribe = onSnapshot(
      subDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubscription({
            userId,
            planId: data.planId,
            status: data.status,
            startDate: data.startDate?.toDate?.()?.toISOString?.() || data.startDate,
            endDate: data.endDate?.toDate?.()?.toISOString?.() || data.endDate,
            trialEndDate: data.trialEndDate?.toDate?.()?.toISOString?.() || data.trialEndDate,
            nextBillingDate: data.nextBillingDate?.toDate?.()?.toISOString?.() || data.nextBillingDate,
            stripeCustomerId: data.stripeCustomerId,
            stripeSubscriptionId: data.stripeSubscriptionId,
            paystackCustomerCode: data.paystackCustomerCode,
            paystackSubscriptionCode: data.paystackSubscriptionCode,
            canceledAt: data.canceledAt?.toDate?.()?.toISOString?.() || data.canceledAt,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt,
            updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt,
          } as UserSubscription);
        } else {
          setSubscription(null);
        }
      },
      (err) => {
        console.error('Subscription listener error:', err);
        setError(err);
      },
    );

    fetchPlans();
    fetchFeatures();

    return () => unsubscribe();
  }, [userId, isAuthenticated]);

  const fetchPlans = useCallback(async () => {
    setIsLoadingPlans(true);
    try {
      const plans = await userService.getAvailableSubscriptionPlans(isAuthenticated);
      setAvailablePlans(plans);
    } catch (e) {
      console.error('Failed to fetch plans:', e);
    } finally {
      setIsLoadingPlans(false);
    }
  }, [isAuthenticated]);

  const fetchFeatures = useCallback(async () => {
    try {
      const featuresRef = collection(firestore, 'appFeatures');
      const q = query(featuresRef, where('isActive', '==', true));
      const featuresSnap = await getDocs(q);
      const features: AppFeature[] = [];
      featuresSnap.forEach((doc) => {
        features.push({ id: doc.id, ...doc.data() } as AppFeature);
      });
      setAppFeatures(features);
    } catch (e) {
      console.error('Failed to fetch features:', e);
    }
  }, []);

  const startCheckout = useCallback(async (
    planId: string,
    interval: 'month' | 'year',
    couponCode?: string,
  ): Promise<boolean> => {
    if (!userId) {
      setError(new Error('User not authenticated'));
      return false;
    }

    try {
      setIsLoadingSubscription(true);

      const appScheme = 'kinshipsync://';
      const successUrl = `${appScheme}subscription/success`;
      const cancelUrl = `${appScheme}subscription/cancel`;

      const result = await subscriptionService.createCheckoutSession({
        userId,
        planId,
        interval,
        couponCode,
        successUrl,
        cancelUrl,
      });

      if (!result.success || !result.data?.url) {
        throw new Error(result.message || 'Failed to create checkout session');
      }

      const resultWeb = await WebBrowser.openAuthSessionAsync(result.data.url, successUrl);

      if (resultWeb.type === 'success') {
        return true;
      }
      return false;
    } catch (e) {
      console.error('Checkout failed:', e);
      setError(e as Error);
      return false;
    } finally {
      setIsLoadingSubscription(false);
    }
  }, [userId]);

  const cancelUserSubscription = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    try {
      setIsLoadingSubscription(true);
      const result = await subscriptionService.cancelSubscription({ userId });
      return result.success;
    } catch (e) {
      console.error('Cancel subscription failed:', e);
      setError(e as Error);
      return false;
    } finally {
      setIsLoadingSubscription(false);
    }
  }, [userId]);

  return {
    subscription,
    availablePlans,
    appFeatures,
    isLoading: isLoadingSubscription || isLoadingPlans,
    isLoadingSubscription,
    error,
    startCheckout,
    cancelUserSubscription,
    refreshPlans: fetchPlans,
  };
};
