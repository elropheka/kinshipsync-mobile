import {
  UserProfile, UpdateUserProfilePayload,
  SubscriptionPlan, UserSubscription, ChangeSubscriptionPayload, CancelSubscriptionPayload,
  UserSettings, UpdateUserSettingsPayload,
  Notification as UserNotification
} from '../types/userTypes';
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
  console.log(`Service: Fetching user profile by email: ${email}`);
  if (!email || !email.trim()) {
    console.warn("getUserProfileByEmail: Email was not provided or is empty.");
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

export const createUserProfile = async (isAuthenticated: boolean, userId: string, email: string, displayName: string, avatarUrl?: string): Promise<UserProfile> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Creating Firestore profile for new user ${userId}`);
  if (!userId) throw new Error("User ID is required to create profile.");
  
  const userDocRef = doc(firestore, 'users', userId);
  const newUserProfileData = {
    userId,
    email,
    displayName,
    avatarUrl: avatarUrl || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    firstName: '',
    lastName: '',
    bio: '',
  };

  try {
    await setDoc(userDocRef, newUserProfileData);
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

export const getAvailableSubscriptionPlans = async (isAuthenticated: boolean): Promise<SubscriptionPlan[]> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log('Service: Fetching available subscription plans from Firestore...');
  try {
    const plansColRef = collection(firestore, 'subscriptionPlans');
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

export const getUserSubscription = async (isAuthenticated: boolean, userId: string): Promise<UserSubscription | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching subscription for user ${userId} from Firestore...`);
  if (!userId) return null;
  try {
    const subDocRef = doc(firestore, 'users', userId, 'subscription', 'current');
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
    return null;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    throw error;
  }
};

export const changeUserSubscription = async (isAuthenticated: boolean, userId: string, payload: ChangeSubscriptionPayload): Promise<UserSubscription | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Changing subscription for user ${userId} to plan ${payload.newPlanId} in Firestore...`);
  if (!userId || !payload.newPlanId) throw new Error("User ID and New Plan ID are required.");

  try {
    const plans = await getAvailableSubscriptionPlans(isAuthenticated);
    const newPlan = plans.find(p => p.id === payload.newPlanId);
    if (!newPlan) throw new Error(`Plan with ID ${payload.newPlanId} not found.`);

    const subDocRef = doc(firestore, 'users', userId, 'subscription', 'current');

    const startDate = serverTimestamp();
    let trialEndDateFirestore: FieldValue | undefined = undefined;
    if (newPlan.trialDays && newPlan.trialDays > 0) {
      trialEndDateFirestore = serverTimestamp();
    }
    

    const subscriptionDataForFirestore: any = {
      planId: newPlan.id,
      status: newPlan.trialDays ? 'trialing' : 'active',
      startDate: startDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (trialEndDateFirestore) {
      if (newPlan.trialDays && newPlan.trialDays > 0) {
        subscriptionDataForFirestore.trialEndDate = Timestamp.fromDate(new Date(new Date().getTime() + newPlan.trialDays * 24 * 60 * 60 * 1000));
      }
    }
    const currentMoment = new Date();
    if (newPlan.interval === 'month') {
        subscriptionDataForFirestore.nextBillingDate = Timestamp.fromDate(new Date(currentMoment.setMonth(currentMoment.getMonth() + 1)));
    } else if (newPlan.interval === 'year') {
        subscriptionDataForFirestore.nextBillingDate = Timestamp.fromDate(new Date(currentMoment.setFullYear(currentMoment.getFullYear() + 1)));
    }


    await setDoc(subDocRef, subscriptionDataForFirestore);

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
    
    const currentSubData = subSnap.data() as UserSubscription;

    let endDateValue: FieldValue | Timestamp;
    if (payload.cancelAtPeriodEnd && currentSubData.nextBillingDate) {
      endDateValue = Timestamp.fromDate(new Date(currentSubData.nextBillingDate));
    } else {
      endDateValue = serverTimestamp();
    }

    const dataToUpdate = {
      status: 'canceled' as 'canceled',
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
        userId,
        ...data,
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as UserSettings;
    } else {
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
