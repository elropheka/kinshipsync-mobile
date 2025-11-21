import { useState, useCallback, useEffect } from 'react';
import * as userService from '../services/userService';
import * as notificationService from '../services/notificationService'; // Import notificationService
import {
  UserProfile, UpdateUserProfilePayload,
  Notification, MarkNotificationReadPayload, MarkAllNotificationsReadPayload,
  SubscriptionPlan, UserSubscription, ChangeSubscriptionPayload, CancelSubscriptionPayload,
  UserSettings, UpdateUserSettingsPayload
} from '../types/userTypes';
import { useAppAuth } from './useAppAuth';
import { useAuth } from '../context/AuthContext';

// Hook for managing current user's profile, settings, notifications, and subscription
export const useCurrentUser = () => {
  const { user: authUser } = useAppAuth(); // Get the authenticated user (BackendUser)
  const { isAuthenticated } = useAuth(); // Added
  const userId = authUser?.uid;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Set to true initially for listener
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingInitialNotifications, setIsLoadingInitialNotifications] = useState(false);

  const [error, setError] = useState<Error | null>(null); // General error state

  const fetchProfile = useCallback(async () => {
    if (!userId || !isAuthenticated) {
      setProfile(null);
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    setError(null);
    try {
      const fetchedProfile = await userService.getUserProfile(isAuthenticated, userId);
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else {
        setProfile(null);
        if (authUser?.email && authUser?.displayName) {
          try {
            const newProfile = await userService.createUserProfile(isAuthenticated, userId, authUser.email, authUser.displayName);
            setProfile(newProfile);
          } catch (createError) {
            console.error('[useCurrentUser] Failed to create default profile:', createError);
            setError(createError as Error);
          }
        }
      }
    } catch (e) {
      console.error("[useCurrentUser] Error fetching profile:", e);
      setError(e as Error);
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [userId, isAuthenticated, authUser]);

  useEffect(() => {
    fetchProfile();
    const intervalId = setInterval(fetchProfile, 30000);
    return () => clearInterval(intervalId);
  }, [fetchProfile]);

  const updateProfile = useCallback(async (payload: UpdateUserProfilePayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingProfile(true);
    setError(null);
    try {
      const updatedProfile = await userService.updateUserProfile(isAuthenticated, userId, payload);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
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
        // Silent error to avoid disrupting UI
      }
    }
  }, [userId, isAuthenticated, notifications]);

  // Fetch User Settings
  const fetchSettings = useCallback(async () => {
    if (!userId) return;
    setIsLoadingSettings(true);
    setError(null);
    try {
      const data = await userService.getUserSettings(isAuthenticated, userId); // Modified
      setSettings(data);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch settings:", e);
    } finally {
      setIsLoadingSettings(false);
    }
  }, [userId, isAuthenticated]); // Added isAuthenticated

  // Update User Settings
  const updateSettings = useCallback(async (payload: UpdateUserSettingsPayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingSettings(true);
    setError(null);
    try {
      const updatedSettings = await userService.updateUserSettings(isAuthenticated, userId, payload); // Modified
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (e) {
      setError(e as Error);
      console.error("Failed to update settings:", e);
      throw e;
    } finally {
      setIsLoadingSettings(false);
    }
  }, [userId, isAuthenticated]); // Added isAuthenticated

  const fetchInitialNotifications = useCallback(async () => {
    if (userId && isAuthenticated) {
      setIsLoadingInitialNotifications(true);
      setError(null);
      try {
        const inAppNotifications = await notificationService.getInAppNotifications(userId);
        const mappedNotifications: Notification[] = inAppNotifications.map(inAppNotif => ({
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
        setNotifications(mappedNotifications);
      } catch (e) {
        setError(e as Error);
        console.error("[useCurrentUser] Failed to fetch notifications:", e);
        setNotifications([]);
      } finally {
        setIsLoadingInitialNotifications(false);
      }
    } else {
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
  }, [userId, isAuthenticated]);

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
  }, [userId, notifications, isAuthenticated]);


  // Fetch Available Subscription Plans
  const fetchAvailablePlans = useCallback(async () => {
    setIsLoadingPlans(true);
    setError(null);
    try {
      const data = await userService.getAvailableSubscriptionPlans(isAuthenticated); // Modified
      setAvailablePlans(data);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch available plans:", e);
    } finally {
      setIsLoadingPlans(false);
    }
  }, [isAuthenticated]); // Added isAuthenticated

  // Fetch User's Current Subscription
  const fetchSubscription = useCallback(async () => {
    if (!userId) return;
    setIsLoadingSubscription(true);
    setError(null);
    try {
      const data = await userService.getUserSubscription(isAuthenticated, userId); // Modified
      setSubscription(data);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch user subscription:", e);
    } finally {
      setIsLoadingSubscription(false);
    }
  }, [userId, isAuthenticated]); // Added isAuthenticated

  // Change User Subscription
  const changeSubscription = useCallback(async (payload: ChangeSubscriptionPayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingSubscription(true);
    setError(null);
    try {
      const updatedSub = await userService.changeUserSubscription(isAuthenticated, userId, payload); // Modified
      setSubscription(updatedSub);
      // Also update available plans to reflect current plan status
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
  }, [userId, isAuthenticated]); // Added isAuthenticated

  // Cancel User Subscription
  const cancelSubscription = useCallback(async (payload: CancelSubscriptionPayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingSubscription(true);
    setError(null);
    try {
      const updatedSub = await userService.cancelUserSubscription(isAuthenticated, userId, payload); // Modified
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
  }, [userId, isAuthenticated]); // Added isAuthenticated


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

  // Effect for periodic notification refetch
  useEffect(() => {
    if (userId && isAuthenticated) {
      const intervalId = setInterval(() => {
        refetchNotifications();
      }, 20000); // 20 seconds

      return () => clearInterval(intervalId); // Cleanup on unmount or if userId/isAuthenticated changes
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
