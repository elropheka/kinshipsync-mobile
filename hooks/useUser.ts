import { useState, useCallback, useEffect } from 'react';
import * as userService from '../services/userService';
import * as notificationService from '../services/notificationService'; // Import notificationService
import {
  UserProfile, UpdateUserProfilePayload,
  Notification, MarkNotificationReadPayload, MarkAllNotificationsReadPayload,
  SubscriptionPlan, UserSubscription, ChangeSubscriptionPayload, CancelSubscriptionPayload,
  UserSettings, UpdateUserSettingsPayload
} from '../types/userTypes';
import { useAppAuth } from './useAppAuth'; // To get current user ID
import { useAuth } from '../context/AuthContext'; // Added
import { doc, onSnapshot } from 'firebase/firestore'; // Import doc and onSnapshot
import { firestore } from '../services/firebaseConfig'; // Import firestore instance

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

  // --- Real-time User Profile Listener ---
  useEffect(() => {
    let unsubscribe: () => void = () => {}; // Initialize with a no-op function

    if (userId && isAuthenticated) {
      console.log(`[useCurrentUser] Setting up profile listener for user: ${userId}`);
      setIsLoadingProfile(true);
      setError(null);
      const userDocRef = doc(firestore, 'users', userId); // Assuming profiles are in 'users' collection

      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedProfile: UserProfile = {
            userId: docSnap.id,
            ...data,
            createdAt: (data.createdAt as any)?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: (data.updatedAt as any)?.toDate().toISOString() || new Date().toISOString(),
          } as UserProfile; // Type assertion
          console.log('[useCurrentUser] Profile data received:', fetchedProfile);
          setProfile(fetchedProfile);
          setIsLoadingProfile(false);
        } else {
          console.log(`[useCurrentUser] Profile document for user ${userId} does not exist.`);
          setProfile(null);
          setIsLoadingProfile(false);
          // If profile is null and authUser exists, consider creating one
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
      // Clean up if user logs out or is not authenticated
      setProfile(null);
      setIsLoadingProfile(false);
    }

    // Cleanup listener on unmount or when dependencies change
    return () => {
      console.log(`[useCurrentUser] Cleaning up profile listener for user: ${userId}`);
      unsubscribe();
    };
  }, [userId, isAuthenticated, authUser]); // Added authUser as dependency for profile creation logic

  // Update User Profile (still needed for manual updates)
  const updateProfile = useCallback(async (payload: UpdateUserProfilePayload) => {
    if (!userId) { setError(new Error("User not authenticated")); return null; }
    setIsLoadingProfile(true); // Indicate saving state
    setError(null);
    try {
      // The listener will update the state after the Firestore write
      await userService.updateUserProfile(isAuthenticated, userId, payload);
      console.log('[useCurrentUser] Profile update initiated. Listener will handle state update.');
      // No need to setProfile here, the onSnapshot listener will do it
      // return the payload or a success indicator if needed by the caller
      return true; // Indicate success
    } catch (e) {
      setError(e as Error);
      console.error("Failed to update profile:", e);
      setIsLoadingProfile(false); // Stop loading on error
      throw e;
    }
  }, [userId, isAuthenticated]);

  // --- Notification Refetching Logic ---
  const refetchNotifications = useCallback(async () => {
    if (userId && isAuthenticated) {
      // console.log(`[useCurrentUser] Refetching notifications for userId: ${userId}`);
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

        // Compare with current notifications
        // Using JSON.stringify for a simple deep comparison.
        // This assumes notification order from the backend is consistent or order doesn't matter for equality.
        // A more robust comparison might involve checking lengths and then individual item properties.
        if (JSON.stringify(mappedNewNotifications) !== JSON.stringify(notifications)) {
          // console.log('[useCurrentUser] Notifications have changed, updating state.');
          setNotifications(mappedNewNotifications);
        } else if (mappedNewNotifications.length === 0 && notifications.length > 0) {
          // console.log('[useCurrentUser] New notifications are empty, clearing state.');
          setNotifications([]);
        }
        // else {
        //   console.log('[useCurrentUser] No changes in notifications.');
        // }
      } catch (e) {
        // console.error("[useCurrentUser] Failed to refetch notifications:", e);
        // Optionally set an error state specific to refetching if needed
        // For now, errors during refetch are silent to avoid disrupting the UI
      }
    }
  }, [userId, isAuthenticated, notifications]); // Add notifications to dependency array for comparison

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

  // --- Notification Management (One-Time Fetch) ---
  const fetchInitialNotifications = useCallback(async () => {
    console.log('[useCurrentUser] Attempting to fetch initial notifications...');
    if (userId && isAuthenticated) {
      console.log(`[useCurrentUser] Fetching for userId: ${userId}, isAuthenticated: ${isAuthenticated}`);
      setIsLoadingInitialNotifications(true);
      setError(null);
      try {
        // Call notificationService.getInAppNotifications instead
        const inAppNotifications = await notificationService.getInAppNotifications(userId);
        console.log('[useCurrentUser] Fetched inAppNotifications from notificationService:', inAppNotifications);

        // Map InAppNotification[] to Notification[]
        const mappedNotifications: Notification[] = inAppNotifications.map(inAppNotif => {
          // Basic type assertion for 'type' field
          const notificationType = inAppNotif.type as Notification['type'];

          return {
            id: inAppNotif.id,
            userId: inAppNotif.recipientId, // Map recipientId to userId
            type: notificationType,
            title: inAppNotif.title,
            message: inAppNotif.body, // Map body to message
            referenceId: inAppNotif.data?.itemId, // Map data.itemId to referenceId
            isRead: inAppNotif.isRead,
            createdAt: new Date(inAppNotif.createdAt).toISOString(), // Convert timestamp to ISO string
            link: inAppNotif.data?.screen, // Map data.screen to link
          };
        });
        console.log('[useCurrentUser] Mapped notifications for UI:', mappedNotifications);
        setNotifications(mappedNotifications);
      } catch (e) {
        setError(e as Error);
        console.error("[useCurrentUser] Failed to fetch and map initial notifications:", e);
        setNotifications([]); // Clear notifications on error
      } finally {
        setIsLoadingInitialNotifications(false);
        console.log('[useCurrentUser] Finished fetching initial notifications.');
      }
    } else {
      console.log(`[useCurrentUser] Skipped fetching notifications. userId: ${userId}, isAuthenticated: ${isAuthenticated}`);
      setNotifications([]); // Clear if no user or not authenticated
      setIsLoadingInitialNotifications(false);
    }
  }, [userId, isAuthenticated]);

  const markRead = useCallback(async (notificationId: string) => {
    if (!userId) { 
      setError(new Error("User not authenticated for markRead")); 
      return false; 
    }
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    try {
      // Use notificationService for marking as read
      const success = await notificationService.markNotificationAsRead(notificationId);
      if (!success) { // Revert if service call failed
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n));
      }
      return success;
    } catch (e) {
      setError(e as Error);
      console.error("[useCurrentUser] Failed to mark notification as read:", e);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n)); // Revert on error
      throw e;
    }
  }, [userId, isAuthenticated]); // userId and isAuthenticated might still be relevant for auth checks or optimistic updates

  const markAllRead = useCallback(async () => {
    if (!userId) {
      setError(new Error("User not authenticated for markAllRead"));
      return false;
    }
    const previousNotifications = [...notifications]; // Store for potential revert
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))); // Optimistic update
    try {
      // Use notificationService for marking all as read
      const success = await notificationService.markAllNotificationsAsRead(userId);
      if (!success) { // Revert if service call failed
         setNotifications(previousNotifications);
      }
      return success;
    } catch (e) {
      setError(e as Error);
      console.error("[useCurrentUser] Failed to mark all notifications as read:", e);
      setNotifications(previousNotifications); // Revert on error
      throw e;
    }
  }, [userId, notifications, isAuthenticated]); // userId and isAuthenticated might still be relevant


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


  // Initial data fetch when userId becomes available
  useEffect(() => {
    if (userId && isAuthenticated) { // Ensure isAuthenticated is also true
      // fetchProfile(); // Replaced by listener
      fetchSettings();
      fetchInitialNotifications(); // Fetch notifications once
      fetchSubscription();
      fetchAvailablePlans();
    } else {
      setProfile(null);
      setSettings(null);
      setNotifications([]);
      setSubscription(null);
      // Reset loading states if necessary, though they should handle their own lifecycle
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
    isLoadingNotifications: isLoadingInitialNotifications, // Use the new loading state for one-time fetch
    isLoadingSubscription,
    isLoadingPlans,
    error,
    // fetchProfile, // Removed as it's now a listener
    updateProfile,
    fetchSettings,
    updateSettings,
    fetchInitialNotifications, // Expose the new fetch function if needed externally, or remove if only internal
    markRead,
    markAllRead,
    fetchSubscription,
    changeSubscription,
    cancelSubscription,
    fetchAvailablePlans,
  };
};
