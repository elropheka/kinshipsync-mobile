import {
  UserProfile, UpdateUserProfilePayload,
  SubscriptionPlan, UserSubscription, ChangeSubscriptionPayload, CancelSubscriptionPayload,
  UserSettings, UpdateUserSettingsPayload,
  Notification as UserNotification // Alias to avoid conflict if Notification is imported from elsewhere
} from '../types/userTypes';
// import { BackendUser } from '../types/auth'; // Assuming User type from auth.ts might be relevant for userId context
import {
  collection,
  doc,
  setDoc, // Added setDoc
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  writeBatch,
  Timestamp,
  FieldValue, // Added FieldValue
} from '@firebase/firestore';
import { firestore } from './firebaseConfig';



// === User Profile Management ===
export const getUserProfile = async (isAuthenticated: boolean, userId: string): Promise<UserProfile | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching profile for user ${userId} from Firestore...`);
  if (!userId) return null;
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        userId, // Ensure userId from doc id is used
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserProfile;
    }
    console.log(`User profile for ${userId} not found.`);
    return null;
  } catch (error) {
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
  console.log(`Service: Fetching up to ${limitNum} users for picker, ordered by displayName...`);
  try {
    const usersColRef = collection(firestore, 'users');
    const q = query(usersColRef, orderBy('displayName'), limit(limitNum));
    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      users.push({
        userId: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserProfile);
    });
    return users;
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
  console.log(`Service: Searching users by name prefix: "${nameQuery}"`);
  if (!nameQuery.trim()) return [];
  try {
    const usersColRef = collection(firestore, 'users');
    const q = query(
      usersColRef,
      where('displayName', '>=', nameQuery),
      where('displayName', '<=', nameQuery + '\uf8ff'),
      orderBy('displayName'),
      limit(limitNum)
    );
    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      users.push({
        userId: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserProfile);
    });
    return users;
  } catch (error) {
    console.error("Error searching users by name:", error);
    throw error;
  }
};

export const updateUserProfile = async (isAuthenticated: boolean, userId: string, payload: UpdateUserProfilePayload): Promise<UserProfile | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Updating profile for user ${userId} in Firestore:`, payload);
  if (!userId) throw new Error("User ID is required to update profile.");
  try {
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, {
      ...payload,
      updatedAt: serverTimestamp(),
    });
    // Fetch and return the updated profile
    const updatedDoc = await getDoc(userDocRef);
    if (updatedDoc.exists()) {
      const data = updatedDoc.data();
      return {
        userId,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
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
  console.log(`Service: Fetching user profile by email: ${email}`);
  if (!email || !email.trim()) {
    console.warn("getUserProfileByEmail: Email was not provided or is empty.");
    return null;
  }
  try {
    const usersColRef = collection(firestore, 'users');
    // Ensure email search is case-insensitive if emails are stored in mixed case,
    // or enforce lowercase storage for emails. Assuming emails are stored consistently (e.g., lowercase).
    const q = query(usersColRef, where('email', '==', email.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      return {
        userId: userDoc.id, // Use the document ID as the userId
        ...data,
        // Convert Firestore Timestamps to ISO strings
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserProfile;
    }
    console.log(`User profile with email ${email} not found.`);
    return null;
  } catch (error) {
    console.error(`Error fetching user profile by email ${email}:`, error);
    throw error;
  }
};

export const findUserByEmail = async (isAuthenticated: boolean, email: string): Promise<UserProfile | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Searching for user by email: ${email}`);
  if (!email || !email.trim()) {
    return null;
  }
  try {
    const usersColRef = collection(firestore, 'users');
    const q = query(usersColRef, where('email', '==', email.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      return {
        userId: userDoc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
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
  console.log(`Service: Creating Firestore profile for new user ${userId}`);
  if (!userId) throw new Error("User ID is required to create profile.");
  
  const userDocRef = doc(firestore, 'users', userId);
  const newUserProfileData = {
    userId, // Storing userId also in the document for potential queries
    email,
    displayName,
    avatarUrl: avatarUrl || null, // Store as null if not provided
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // Initialize other fields with defaults if necessary
    firstName: '',
    lastName: '',
    bio: '',
  };

  try {
    await setDoc(userDocRef, newUserProfileData); // Use setDoc to create or overwrite
    // Fetch the created profile to get server timestamps resolved
    const createdDoc = await getDoc(userDocRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created user profile.");
    const data = createdDoc.data();
    return {
      userId,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as UserProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

export const getUserProfileById = async (userId: string): Promise<UserProfile | null> => {
  // This function is intended to be called by other services that have already handled authentication.
  // If it were to be called directly from UI components that don't guarantee prior auth checks,
  // an `isAuthenticated` flag and check would be advisable.
  console.log(`Service: Fetching profile for user ${userId} by ID from Firestore...`);
  if (!userId) {
    console.warn("getUserProfileById: userId was not provided.");
    return null;
  }
  try {
    const userDocRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure all fields from UserProfile type are mapped, especially timestamps
      return {
        userId, // The document ID is the userId
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        email: data.email,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        address: data.address,
        fcmTokens: data.fcmTokens || [], // Default to empty array if not present
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserProfile;
    }
    console.log(`User profile for ${userId} not found.`);
    return null;
  } catch (error) {
    console.error(`Error fetching user profile by ID ${userId}:`, error);
    throw error;
  }
};


// === Notification Management ===

// Listen to user notifications in real-time
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
  const notificationsColRef = collection(firestore, 'users', userId, 'notifications');
  let q;
  if (unreadOnly) {
    q = query(notificationsColRef, where('isRead', '==', false), orderBy('createdAt', 'desc'), limit(limitCount));
  } else {
    q = query(notificationsColRef, orderBy('createdAt', 'desc'), limit(limitCount));
  }

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const notifications: UserNotification[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const createdAt = data.createdAt as Timestamp | null; // Firestore Timestamp
      notifications.push({
        id: docSnap.id,
        userId, // Add userId as it's part of the type but not stored on individual notification docs
        ...data,
        createdAt: createdAt ? createdAt.toDate().toISOString() : new Date().toISOString(),
      } as UserNotification);
    });
    callback(notifications);
  }, (error) => {
    console.error("Error listening to user notifications:", error);
  });

  return unsubscribe;
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
    const notificationDocRef = doc(firestore, 'users', userId, 'notifications', notificationId);
    await updateDoc(notificationDocRef, { isRead: true });
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
    const notificationsColRef = collection(firestore, 'users', userId, 'notifications');
    const q = query(notificationsColRef, where('isRead', '==', false));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return true; // No unread notifications
    }

    const batch = writeBatch(firestore);
    querySnapshot.forEach(docSnap => {
      batch.update(docSnap.ref, { isRead: true });
    });
    await batch.commit();
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
  console.log(`Service: Fetching notifications once for user ${userId}, limit: ${limitCount}, unreadOnly: ${unreadOnly}`);
  try {
    const notificationsColRef = collection(firestore, 'users', userId, 'notifications');
    let q;
    if (unreadOnly) {
      q = query(notificationsColRef, where('isRead', '==', false), orderBy('createdAt', 'desc'), limit(limitCount));
    } else {
      q = query(notificationsColRef, orderBy('createdAt', 'desc'), limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const notifications: UserNotification[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const createdAt = data.createdAt as Timestamp | null; // Firestore Timestamp
      notifications.push({
        id: docSnap.id,
        userId,
        ...data,
        createdAt: createdAt ? createdAt.toDate().toISOString() : new Date().toISOString(),
      } as UserNotification);
    });
    return notifications;
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
  console.log('Service: Fetching available subscription plans from Firestore...');
  try {
    const plansColRef = collection(firestore, 'subscriptionPlans');
    // Optionally order by price or some other attribute
    const q = query(plansColRef, orderBy('price')); 
    const querySnapshot = await getDocs(q);
    const plans: SubscriptionPlan[] = [];
    querySnapshot.forEach((docSnap) => {
      plans.push({ id: docSnap.id, ...docSnap.data() } as SubscriptionPlan);
    });
    return plans;
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
  console.log(`Service: Fetching subscription for user ${userId} from Firestore...`);
  if (!userId) return null;
  try {
    // Assuming user's subscription is stored in a specific document, e.g., users/{userId}/subscription/current
    // Or, if multiple subscriptions possible (history), query a subcollection.
    // For simplicity, let's assume one 'active' or 'trialing' subscription document.
    const subDocRef = doc(firestore, 'users', userId, 'subscription', 'current'); // Fixed ID for current subscription
    const docSnap = await getDoc(subDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.status === 'active' || data.status === 'trialing') {
        return {
          userId, // Not stored in the doc, but part of the type
          ...data,
          startDate: (data.startDate as Timestamp)?.toDate().toISOString(),
          endDate: (data.endDate as Timestamp)?.toDate().toISOString() || undefined,
          trialEndDate: (data.trialEndDate as Timestamp)?.toDate().toISOString() || undefined,
          nextBillingDate: (data.nextBillingDate as Timestamp)?.toDate().toISOString() || undefined,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
        } as UserSubscription;
      }
    }
    return null; // No active/trialing subscription found
  } catch (error) {
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
  console.log(`Service: Changing subscription for user ${userId} to plan ${payload.newPlanId} in Firestore...`);
  if (!userId || !payload.newPlanId) throw new Error("User ID and New Plan ID are required.");

  try {
    // Fetch details of the new plan
    // Assuming getAvailableSubscriptionPlans now requires isAuthenticated
    const plans = await getAvailableSubscriptionPlans(isAuthenticated);
    const newPlan = plans.find(p => p.id === payload.newPlanId);
    if (!newPlan) throw new Error(`Plan with ID ${payload.newPlanId} not found.`);

    const subDocRef = doc(firestore, 'users', userId, 'subscription', 'current');

    const startDate = serverTimestamp();
    let trialEndDateFirestore: FieldValue | undefined = undefined;
    if (newPlan.trialDays && newPlan.trialDays > 0) {
      trialEndDateFirestore = serverTimestamp(); // Will be calculated by backend rule or set to a future fixed date
      // For client-side calculation if needed for display before backend write:
      // trialEndDate = Timestamp.fromDate(new Date(now.getTime() + newPlan.trialDays * 24 * 60 * 60 * 1000));
    }
    

    // Data to be written to Firestore
    const subscriptionDataForFirestore: any = {
      planId: newPlan.id,
      status: newPlan.trialDays ? 'trialing' : 'active',
      startDate: startDate, // This is serverTimestamp()
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (trialEndDateFirestore) {
      subscriptionDataForFirestore.trialEndDate = trialEndDateFirestore; 
      // Note: Actual trial end date might be better calculated and set by a backend function 
      // upon subscription creation to ensure accuracy, rather than relying on client-side calculation for Firestore.
      // For now, we'll use a serverTimestamp placeholder or a client-calculated fixed date if needed.
      // Let's use a client-calculated fixed date for the placeholder if trialDays exist.
      if (newPlan.trialDays && newPlan.trialDays > 0) {
        subscriptionDataForFirestore.trialEndDate = Timestamp.fromDate(new Date(new Date().getTime() + newPlan.trialDays * 24 * 60 * 60 * 1000));
      }
    }
    // Set nextBillingDate based on interval
    const currentMoment = new Date();
    if (newPlan.interval === 'month') {
        subscriptionDataForFirestore.nextBillingDate = Timestamp.fromDate(new Date(currentMoment.setMonth(currentMoment.getMonth() + 1)));
    } else if (newPlan.interval === 'year') {
        subscriptionDataForFirestore.nextBillingDate = Timestamp.fromDate(new Date(currentMoment.setFullYear(currentMoment.getFullYear() + 1)));
    }


    await setDoc(subDocRef, subscriptionDataForFirestore);

    // Fetch and return the new subscription details
    const updatedSubSnap = await getDoc(subDocRef);
    if (updatedSubSnap.exists()) {
      const data = updatedSubSnap.data();
      return {
        userId,
        ...data,
        startDate: (data.startDate as Timestamp)?.toDate().toISOString(),
        endDate: (data.endDate as Timestamp)?.toDate().toISOString() || undefined,
        trialEndDate: (data.trialEndDate as Timestamp)?.toDate().toISOString() || undefined,
        nextBillingDate: (data.nextBillingDate as Timestamp)?.toDate().toISOString() || undefined,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
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
  console.log(`Service: Canceling subscription for user ${userId} in Firestore...`);
  if (!userId) throw new Error("User ID is required.");
  
  const subDocRef = doc(firestore, 'users', userId, 'subscription', 'current');
  try {
    const subSnap = await getDoc(subDocRef);
    if (!subSnap.exists()) {
      console.warn("No active subscription found to cancel.");
      return null;
    }
    
    const currentSubData = subSnap.data() as UserSubscription; // Already converted to UserSubscription type by previous fetches or type expectations

    let endDateValue: FieldValue | Timestamp;
    if (payload.cancelAtPeriodEnd && currentSubData.nextBillingDate) {
      // currentSubData.nextBillingDate is an ISO string, convert to Date then to Firestore Timestamp
      endDateValue = Timestamp.fromDate(new Date(currentSubData.nextBillingDate));
    } else {
      endDateValue = serverTimestamp(); // Cancel immediately
    }

    const dataToUpdate = {
      status: 'canceled' as 'canceled', // Explicitly type
      updatedAt: serverTimestamp(),
      endDate: endDateValue,
    };

    await updateDoc(subDocRef, dataToUpdate);

    const updatedSubSnap = await getDoc(subDocRef);
    if (updatedSubSnap.exists()) {
      const data = updatedSubSnap.data();
       return {
        userId,
        ...data,
        startDate: (data.startDate as Timestamp)?.toDate().toISOString(),
        endDate: (data.endDate as Timestamp)?.toDate().toISOString() || undefined,
        trialEndDate: (data.trialEndDate as Timestamp)?.toDate().toISOString() || undefined,
        nextBillingDate: (data.nextBillingDate as Timestamp)?.toDate().toISOString() || undefined,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
      } as UserSubscription;
    }
    return null;
  } catch (error) {
    console.error("Error canceling user subscription:", error);
    throw error;
  }
};


// === User Settings Management ===
export const getUserSettings = async (isAuthenticated: boolean, userId: string): Promise<UserSettings | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching settings for user ${userId} from Firestore...`);
  if (!userId) return null;
  try {
    const settingsDocRef = doc(firestore, 'users', userId, 'settings', 'appSettings'); // Using a fixed ID for the settings doc
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Migration: Add eventVisibility if it doesn't exist
      if (!data.eventVisibility) {
        console.log(`Migrating settings for user ${userId}: adding missing eventVisibility field`);
        const migrationData = {
          ...data,
          eventVisibility: { showAllPublicEvents: false },
          updatedAt: serverTimestamp(),
        };
        await setDoc(settingsDocRef, migrationData);
        return {
          userId,
          ...migrationData,
          updatedAt: new Date().toISOString(),
        } as UserSettings;
      }
      
      return {
        userId, // userId is not part of the doc but part of the type
        ...data,
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserSettings;
    } else {
      // If settings don't exist, create and return default settings
      console.log(`Settings not found for user ${userId}, creating defaults.`);
      const defaultSettings: Omit<UserSettings, 'userId' | 'updatedAt'> = {
        theme: 'system',
        language: 'en',
        emailNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, newsletter: false },
        pushNotifications: { eventInvites: true, eventUpdates: true, messageAlerts: true, taskAlerts: true },
        eventVisibility: { showAllPublicEvents: false },
      };
      await setDoc(settingsDocRef, { ...defaultSettings, updatedAt: serverTimestamp() });
      return { 
        userId, 
        ...defaultSettings, 
        updatedAt: new Date().toISOString() 
      } as UserSettings;
    }
  } catch (error) {
    console.error("Error fetching user settings:", error);
    throw error;
  }
};

export const updateUserSettings = async (isAuthenticated: boolean, userId: string, payload: UpdateUserSettingsPayload): Promise<UserSettings | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Updating settings for user ${userId} in Firestore:`, payload);
  if (!userId) throw new Error("User ID is required to update settings.");
  try {
    const settingsDocRef = doc(firestore, 'users', userId, 'settings', 'appSettings');
    // Firestore's updateDoc handles nested object updates correctly if you provide dot notation
    // or if you provide the full nested object for the field being updated.
    // For simplicity and to ensure deep merge behavior as intended by original mock,
    // we can fetch, merge, then set, or use update with careful payload construction.
    // Let's use updateDoc with the payload and add serverTimestamp for updatedAt.
    
    const updatePayload = { ...payload, updatedAt: serverTimestamp() };
    await updateDoc(settingsDocRef, updatePayload);

    const updatedDoc = await getDoc(settingsDocRef);
    if (updatedDoc.exists()) {
      const data = updatedDoc.data();
      return {
        userId,
        ...data,
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserSettings;
    }
    return null;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};
