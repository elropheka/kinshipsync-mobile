import {
  UserProfile, UpdateUserProfilePayload,
  SubscriptionPlan, UserSubscription, ChangeSubscriptionPayload, CancelSubscriptionPayload,
  UserSettings, UpdateUserSettingsPayload,
  Notification as UserNotification // Alias to avoid conflict if Notification is imported from elsewhere
} from '../types/userTypes';
import axiosInstance from './axiosInstance';



// === User Profile Management ===
export const getUserProfile = async (isAuthenticated: boolean, userId: string): Promise<UserProfile | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching profile for user ${userId} from backend...`);
  if (!userId) return null;
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    if (response.data.success && response.data.data) {
      return {
        userId: response.data.data.id || userId,
        ...response.data.data,
      } as UserProfile;
    }
    console.log(`User profile for ${userId} not found.`);
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Function to get users for a picker (e.g., for starting a new chat)
// Now includes a limit and orders by displayName.
export const getAllUsersForPicker = async (isAuthenticated: boolean, limitNum: number = 20): Promise<UserProfile[]> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching up to ${limitNum} users for picker from backend...`);
  try {
    const response = await axiosInstance.get(`/users?limit=${limitNum}&orderBy=displayName`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((user: any) => ({
        userId: user.id || user.userId,
        ...user,
      })) as UserProfile[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching all users for picker:", error);
    throw error;
  }
};

// Search users by display name prefix
export const searchUsersByName = async (isAuthenticated: boolean, nameQuery: string, limitNum: number = 10): Promise<UserProfile[]> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Searching users by name prefix: "${nameQuery}" from backend...`);
  if (!nameQuery.trim()) return [];
  try {
    const response = await axiosInstance.get(`/users/search?q=${encodeURIComponent(nameQuery)}&limit=${limitNum}`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((user: any) => ({
        userId: user.id || user.userId,
        ...user,
      })) as UserProfile[];
    }
    return [];
  } catch (error) {
    console.error("Error searching users by name:", error);
    throw error;
  }
};

export const updateUserProfile = async (isAuthenticated: boolean, userId: string, payload: UpdateUserProfilePayload): Promise<UserProfile | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Updating profile for user ${userId} in backend:`, payload);
  if (!userId) throw new Error("User ID is required to update profile.");
  try {
    const response = await axiosInstance.put(`/users/${userId}`, payload);
    if (response.data.success && response.data.data) {
      return {
        userId: response.data.data.id || userId,
        ...response.data.data,
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  // This function can be called by other services; authentication should be handled by the calling service if necessary.
  console.log(`Service: Fetching user profile by email: ${email} from backend...`);
  if (!email || !email.trim()) {
    console.warn("getUserProfileByEmail: Email was not provided or is empty.");
    return null;
  }
  try {
    const response = await axiosInstance.get(`/users/email/${encodeURIComponent(email.toLowerCase())}`);
    if (response.data.success && response.data.data) {
      return {
        userId: response.data.data.id || response.data.data.userId,
        ...response.data.data,
      } as UserProfile;
    }
    console.log(`User profile with email ${email} not found.`);
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching user profile by email ${email}:`, error);
    throw error;
  }
};

export const findUserByEmail = async (isAuthenticated: boolean, email: string): Promise<UserProfile | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Searching for user by email: ${email} from backend...`);
  if (!email || !email.trim()) {
    return null;
  }
  try {
    const response = await axiosInstance.get(`/users/email/${encodeURIComponent(email.toLowerCase())}`);
    if (response.data.success && response.data.data) {
      return {
        userId: response.data.data.id || response.data.data.userId,
        ...response.data.data,
      } as UserProfile;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// Called internally, e.g. after registration or if profile doesn't exist on first fetch
// This function is often called when auth state is known (e.g., after signup),
// but adding the check for consistency if it could be called elsewhere.
export const createUserProfile = async (isAuthenticated: boolean, userId: string, email: string, displayName: string, avatarUrl?: string): Promise<UserProfile> => {
  if (!isAuthenticated) {
    // This might be an exception if called immediately after a Firebase auth action that guarantees a user.
    // However, for strictness, we add the check.
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Creating backend profile for new user ${userId}`);
  if (!userId) throw new Error("User ID is required to create profile.");
  
  const newUserProfileData = {
    email,
    displayName,
    avatarUrl: avatarUrl || null,
    firstName: '',
    lastName: '',
    bio: '',
  };

  try {
    const response = await axiosInstance.post('/users', newUserProfileData);
    if (response.data.success && response.data.data) {
      return {
        userId: response.data.data.id || userId,
        ...response.data.data,
      } as UserProfile;
    }
    throw new Error("Failed to create user profile.");
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfileById = async (userId: string): Promise<UserProfile | null> => {
  // This function is intended to be called by other services that have already handled authentication.
  // If it were to be called directly from UI components that don't guarantee prior auth checks,
  // an `isAuthenticated` flag and check would be advisable.
  console.log(`Service: Fetching profile for user ${userId} by ID from backend...`);
  if (!userId) {
    console.warn("getUserProfileById: userId was not provided.");
    return null;
  }
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    if (response.data.success && response.data.data) {
      return {
        userId: response.data.data.id || userId,
        ...response.data.data,
      } as UserProfile;
    }
    console.log(`User profile for ${userId} not found.`);
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching user profile by ID ${userId}:`, error);
    throw error;
  }
};


// === Notification Management ===

// Listen to user notifications (polling-based since REST API doesn't support real-time)
export const listenToUserNotifications = (
  isAuthenticated: boolean,
  userId: string,
  callback: (notifications: UserNotification[]) => void,
  limitCount: number = 20,
  unreadOnly: boolean = false
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to notifications.");
    return () => { console.warn("Attempted to listen to notifications while unauthenticated."); };
  }
  if (!userId) {
    console.error("listenToUserNotifications: User ID is required.");
    return () => {}; // Return an empty unsubscribe function
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollNotifications = async () => {
    try {
      const notifications = await fetchUserNotificationsOnce(isAuthenticated, userId, limitCount, unreadOnly);
      callback(notifications);
    } catch (error) {
      console.error("Error polling notifications:", error);
    }
  };

  // Initial fetch
  pollNotifications();
  
  // Poll every 30 seconds
  pollingInterval = setInterval(pollNotifications, 30000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const markNotificationAsRead = async (isAuthenticated: boolean, userId: string, notificationId: string): Promise<boolean> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!userId || !notificationId) {
    console.error("User ID and Notification ID are required to mark as read.");
    return false;
  }
  console.log(`Service: Marking notification ${notificationId} as read for user ${userId}...`);
  try {
    await axiosInstance.patch(`/users/${userId}/notifications/${notificationId}`, { isRead: true });
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (isAuthenticated: boolean, userId: string): Promise<boolean> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!userId) {
    console.error("User ID is required to mark all notifications as read.");
    return false;
  }
  console.log(`Service: Marking all notifications for user ${userId} as read...`);
  try {
    await axiosInstance.patch(`/users/${userId}/notifications/mark-all-read`);
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};

// Fetches user notifications once
export const fetchUserNotificationsOnce = async (
  isAuthenticated: boolean,
  userId: string,
  limitCount: number = 20,
  unreadOnly: boolean = false
): Promise<UserNotification[]> => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot fetch notifications.");
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!userId) {
    console.error("fetchUserNotificationsOnce: User ID is required.");
    throw new Error("User ID is required to fetch notifications.");
  }
  console.log(`Service: Fetching notifications once for user ${userId}, limit: ${limitCount}, unreadOnly: ${unreadOnly} from backend...`);
  try {
    const params = new URLSearchParams({
      limit: limitCount.toString(),
      ...(unreadOnly && { unreadOnly: 'true' }),
    });
    const response = await axiosInstance.get(`/users/${userId}/notifications?${params.toString()}`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((notification: any) => ({
        id: notification.id,
        userId,
        ...notification,
      })) as UserNotification[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching user notifications once:", error);
    throw error;
  }
};
// _addMockNotification is no longer needed as notifications will be created by backend functions.


// === Subscription Plan Management ===
// Fetches all available subscription plans (e.g., from a 'subscriptionPlans' collection)
export const getAvailableSubscriptionPlans = async (isAuthenticated: boolean): Promise<SubscriptionPlan[]> => {
  // Subscription plans might be public. If so, this check can be removed.
  // Assuming auth required for consistency.
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log('Service: Fetching available subscription plans from backend...');
  try {
    const response = await axiosInstance.get('/subscription-plans');
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((plan: any) => ({
        id: plan.id,
        ...plan,
      })) as SubscriptionPlan[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching available subscription plans:", error);
    throw error;
  }
};

// Fetches the current user's active/trialing subscription
export const getUserSubscription = async (isAuthenticated: boolean, userId: string): Promise<UserSubscription | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching subscription for user ${userId} from backend...`);
  if (!userId) return null;
  try {
    const response = await axiosInstance.get(`/users/${userId}/subscription`);
    if (response.data.success && response.data.data) {
      return {
        userId,
        ...response.data.data,
      } as UserSubscription;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching user subscription:", error);
    throw error;
  }
};

// Creates/Updates a user's subscription.
// This would typically involve backend logic for payment processing.
// For client-side simulation, we'll just update Firestore.
export const changeUserSubscription = async (isAuthenticated: boolean, userId: string, payload: ChangeSubscriptionPayload): Promise<UserSubscription | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Changing subscription for user ${userId} to plan ${payload.newPlanId} in backend...`);
  if (!userId || !payload.newPlanId) throw new Error("User ID and New Plan ID are required.");

  try {
    const response = await axiosInstance.post(`/users/${userId}/subscription`, {
      planId: payload.newPlanId,
    });
    if (response.data.success && response.data.data) {
      return {
        userId,
        ...response.data.data,
      } as UserSubscription;
    }
    return null;
  } catch (error) {
    console.error("Error changing user subscription:", error);
    throw error;
  }
};

export const cancelUserSubscription = async (isAuthenticated: boolean, userId: string, payload: CancelSubscriptionPayload): Promise<UserSubscription | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Canceling subscription for user ${userId} in backend...`);
  if (!userId) throw new Error("User ID is required.");
  
  try {
    const response = await axiosInstance.delete(`/users/${userId}/subscription`, {
      data: { cancelAtPeriodEnd: payload.cancelAtPeriodEnd },
    });
    if (response.data.success && response.data.data) {
      return {
        userId,
        ...response.data.data,
      } as UserSubscription;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error canceling user subscription:", error);
    throw error;
  }
};


// === User Settings Management ===
export const getUserSettings = async (isAuthenticated: boolean, userId: string): Promise<UserSettings | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching settings for user ${userId} from backend...`);
  if (!userId) return null;
  try {
    const response = await axiosInstance.get(`/users/${userId}/settings`);
    if (response.data.success && response.data.data) {
      return {
        userId,
        ...response.data.data,
      } as UserSettings;
    }
    // If settings don't exist, return default settings (backend should create them)
    const defaultSettings: Omit<UserSettings, 'userId' | 'updatedAt'> = {
      theme: 'system',
      language: 'en',
      emailNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, newsletter: false },
      pushNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, taskAlerts: true },
      eventVisibility: { showAllPublicEvents: false },
    };
    return { 
      userId, 
      ...defaultSettings, 
      updatedAt: new Date().toISOString() 
    } as UserSettings;
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Return default settings if not found
      const defaultSettings: Omit<UserSettings, 'userId' | 'updatedAt'> = {
        theme: 'system',
        language: 'en',
        emailNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, newsletter: false },
        pushNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, taskAlerts: true },
        eventVisibility: { showAllPublicEvents: false },
      };
      return { 
        userId, 
        ...defaultSettings, 
        updatedAt: new Date().toISOString() 
      } as UserSettings;
    }
    console.error("Error fetching user settings:", error);
    throw error;
  }
};

export const updateUserSettings = async (isAuthenticated: boolean, userId: string, payload: UpdateUserSettingsPayload): Promise<UserSettings | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Updating settings for user ${userId} in backend:`, payload);
  if (!userId) throw new Error("User ID is required to update settings.");
  try {
    const response = await axiosInstance.put(`/users/${userId}/settings`, payload);
    if (response.data.success && response.data.data) {
      return {
        userId,
        ...response.data.data,
      } as UserSettings;
    }
    return null;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};
