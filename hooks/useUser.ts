import { useState, useCallback, useEffect } from 'react';
import * as userService from '../services/userService';
import * as notificationService from '../services/notificationService';
import {
  UserProfile, UpdateUserProfilePayload,
  Notification,
  SubscriptionPlan, UserSubscription, ChangeSubscriptionPayload, CancelSubscriptionPayload,
  UserSettings, UpdateUserSettingsPayload
} from '../types/userTypes';
import { useAppAuth } from './useAppAuth';
import { useAuth } from '../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';

export const useCurrentUser = () => {
  const { user: authUser } = useAppAuth();
  const { isAuthenticated } = useAuth();
  const userId = authUser?.uid;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingInitialNotifications, setIsLoadingInitialNotifications] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (userId && isAuthenticated) {
      console.log(`[useCurrentUser] Setting up profile listener for user: ${userId}`);
      setIsLoadingProfile(true);
      setError(null);
      const userDocRef = doc(firestore, 'users', userId);

      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedProfile: UserProfile = {
            userId: docSnap.id,
            ...data,
            createdAt: (data.createdAt as any)?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: (data.updatedAt as any)?.toDate().toISOString() || new Date().toISOString(),
          } as UserProfile;
          console.log('[useCurrentUser] Profile data received:', fetchedProfile);
          setProfile(fetchedProfile);
          setIsLoadingProfile(false);
        } else {
          console.log(`[useCurrentUser] Profile document for user ${userId} does not exist.`);
          setProfile(null);
          setIsLoadingProfile(false);
          if (authUser?.email && authUser?.displayName) {
             console.log('[useCurrentUser] Profile not found, attempting to create default profile.');
             userService.createUserProfile(isAuthenticated, userId, authUser.email, authUser.displayName)
               .then(newProfile => {
                 console.log('[useCurrentUser] Default profile created:', newProfile);
                 setProfile(newProfile);
               })
               .catch(createError => {
                 console.error('[useCurrentUser] Failed to create default profile:', createError);
                 setError(createError);
               });
          }
        }
      }, (e) => {
        console.error("[useCurrentUser] Error listening to profile:", e);
        setError(e);
        setIsLoadingProfile(false);
      });
    } else {
      setProfile(null);
      setIsLoadingProfile(false);
    }

    return () => {
      console.log(`[useCurrentUser] Cleaning up profile listener for user: ${userId}`);
      unsubscribe();
    };
  }, [userId, isAuthenticated, authUser]);

  const updateProfile = useCallback(async (payload: UpdateUserProfilePayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingProfile(true);
    setError(null);
    try {
      await userService.updateUserProfile(isAuthenticated, userId, payload);
      console.log('[useCurrentUser] Profile update initiated. Listener will handle state update.');
      return true;
    } catch (e) {
      setError(e as Error);
      console.error("Failed to update profile:", e);
      setIsLoadingProfile(false);
      throw e;
    }
  }, [userId, isAuthenticated]);

  const refetchNotifications = useCallback(async () => {
    if (userId && isAuthenticated) {
      try {
        const inAppNotifications = await notificationService.getInAppNotifications(userId);
        const mappedNewNotifications: Notification[] = inAppNotifications.map(inAppNotif => ({
          id: inAppNotif.id,
          userId: inAppNotif.recipientId,
          type: inAppNotif.type as Notification['type'],
          title: inAppNotif.title,
          message: inAppNotif.body,
          referenceId: inAppNotif.data?.itemId,
          isRead: inAppNotif.isRead,
          createdAt: new Date(inAppNotif.createdAt).toISOString(),
          link: inAppNotif.data?.screen,
        }));

        if (JSON.stringify(mappedNewNotifications) !== JSON.stringify(notifications)) {
          setNotifications(mappedNewNotifications);
        } else if (mappedNewNotifications.length === 0 && notifications.length > 0) {
          setNotifications([]);
        }
      } catch (e) {
         console.log(e)
      }
    }
  }, [userId, isAuthenticated, notifications]);

  const fetchSettings = useCallback(async () => {
    if (!userId) return;
    setIsLoadingSettings(true);
    setError(null);
    try {
      const data = await userService.getUserSettings(isAuthenticated, userId);
      setSettings(data);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch settings:", e);
    } finally {
      setIsLoadingSettings(false);
    }
  }, [userId, isAuthenticated]);

  const updateSettings = useCallback(async (payload: UpdateUserSettingsPayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingSettings(true);
    setError(null);
    try {
      const updatedSettings = await userService.updateUserSettings(isAuthenticated, userId, payload);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (e) {
      setError(e as Error);
      console.error("Failed to update settings:", e);
      throw e;
    } finally {
      setIsLoadingSettings(false);
    }
  }, [userId, isAuthenticated]);

  const fetchInitialNotifications = useCallback(async () => {
    console.log('[useCurrentUser] Attempting to fetch initial notifications...');
    if (userId && isAuthenticated) {
      console.log(`[useCurrentUser] Fetching for userId: ${userId}, isAuthenticated: ${isAuthenticated}`);
      setIsLoadingInitialNotifications(true);
      setError(null);
      try {
        const inAppNotifications = await notificationService.getInAppNotifications(userId);
        console.log('[useCurrentUser] Fetched inAppNotifications from notificationService:', inAppNotifications);

        const mappedNotifications: Notification[] = inAppNotifications.map(inAppNotif => {
          const notificationType = inAppNotif.type as Notification['type'];

          return {
            id: inAppNotif.id,
            userId: inAppNotif.recipientId,
            type: notificationType,
            title: inAppNotif.title,
            message: inAppNotif.body,
            referenceId: inAppNotif.data?.itemId,
            isRead: inAppNotif.isRead,
            createdAt: new Date(inAppNotif.createdAt).toISOString(),
            link: inAppNotif.data?.screen,
          };
        });
        console.log('[useCurrentUser] Mapped notifications for UI:', mappedNotifications);
        setNotifications(mappedNotifications);
      } catch (e) {
        setError(e as Error);
        console.error("[useCurrentUser] Failed to fetch and map initial notifications:", e);
        setNotifications([]);
      } finally {
        setIsLoadingInitialNotifications(false);
        console.log('[useCurrentUser] Finished fetching initial notifications.');
      }
    } else {
      console.log(`[useCurrentUser] Skipped fetching notifications. userId: ${userId}, isAuthenticated: ${isAuthenticated}`);
      setNotifications([]);
      setIsLoadingInitialNotifications(false);
    }
  }, [userId, isAuthenticated]);

  const markRead = useCallback(async (notificationId: string) => {
    if (!userId) { 
      setError(new Error("User not authenticated for markRead")); 
      return false; 
    }
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    try {
      const success = await notificationService.markNotificationAsRead(notificationId);
      if (!success) {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n));
      }
      return success;
    } catch (e) {
      setError(e as Error);
      console.error("[useCurrentUser] Failed to mark notification as read:", e);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n));
      throw e;
    }
  }, [userId]);

  const markAllRead = useCallback(async () => {
    if (!userId) {
      setError(new Error("User not authenticated for markAllRead"));
      return false;
    }
    const previousNotifications = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      const success = await notificationService.markAllNotificationsAsRead(userId);
      if (!success) {
         setNotifications(previousNotifications);
      }
      return success;
    } catch (e) {
      setError(e as Error);
      console.error("[useCurrentUser] Failed to mark all notifications as read:", e);
      setNotifications(previousNotifications);
      throw e;
    }
  }, [userId, notifications]);

  const fetchAvailablePlans = useCallback(async () => {
    setIsLoadingPlans(true);
    setError(null);
    try {
      const data = await userService.getAvailableSubscriptionPlans(isAuthenticated);
      setAvailablePlans(data);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch available plans:", e);
    } finally {
      setIsLoadingPlans(false);
    }
  }, [isAuthenticated]);

  const fetchSubscription = useCallback(async () => {
    if (!userId) return;
    setIsLoadingSubscription(true);
    setError(null);
    try {
      const data = await userService.getUserSubscription(isAuthenticated, userId);
      setSubscription(data);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch user subscription:", e);
    } finally {
      setIsLoadingSubscription(false);
    }
  }, [userId, isAuthenticated]);

  const changeSubscription = useCallback(async (payload: ChangeSubscriptionPayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingSubscription(true);
    setError(null);
    try {
      const updatedSub = await userService.changeUserSubscription(isAuthenticated, userId, payload);
      setSubscription(updatedSub);
      if (updatedSub) {
        setAvailablePlans(prev => prev.map(p => ({...p, isCurrentPlan: p.id === updatedSub.planId })));
      }
      return updatedSub;
    } catch (e) {
      setError(e as Error);
      console.error("Failed to change subscription:", e);
      throw e;
    } finally {
      setIsLoadingSubscription(false);
    }
  }, [userId, isAuthenticated]);

  const cancelSubscription = useCallback(async (payload: CancelSubscriptionPayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingSubscription(true);
    setError(null);
    try {
      const updatedSub = await userService.cancelUserSubscription(isAuthenticated, userId, payload);
      setSubscription(updatedSub);
      if (updatedSub?.status === 'canceled') {
         setAvailablePlans(prev => prev.map(p => ({...p, isCurrentPlan: false })));
      }
      return updatedSub;
    } catch (e) {
      setError(e as Error);
      console.error("Failed to cancel subscription:", e);
      throw e;
    } finally {
      setIsLoadingSubscription(false);
    }
  }, [userId, isAuthenticated]);

  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchSettings();
      fetchInitialNotifications();
      fetchSubscription();
      fetchAvailablePlans();
    } else {
      setProfile(null);
      setSettings(null);
      setNotifications([]);
      setSubscription(null);
      setIsLoadingInitialNotifications(false);
    }
  }, [userId, isAuthenticated, fetchSettings, fetchInitialNotifications, fetchSubscription, fetchAvailablePlans]);

  useEffect(() => {
    if (userId && isAuthenticated) {
      const intervalId = setInterval(() => {
        refetchNotifications();
      }, 20000);

      return () => clearInterval(intervalId);
    }
  }, [userId, isAuthenticated, refetchNotifications]);

  return {
    profile,
    settings,
    notifications,
    subscription,
    availablePlans,
    isLoading: isLoadingProfile || isLoadingSettings || isLoadingInitialNotifications || isLoadingSubscription || isLoadingPlans,
    isLoadingProfile,
    isLoadingSettings,
    isLoadingNotifications: isLoadingInitialNotifications,
    isLoadingSubscription,
    isLoadingPlans,
    error,
    updateProfile,
    fetchSettings,
    updateSettings,
    fetchInitialNotifications,
    markRead,
    markAllRead,
    fetchSubscription,
    changeSubscription,
    cancelSubscription,
    fetchAvailablePlans,
  };
};
