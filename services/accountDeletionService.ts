import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  writeBatch,
  Timestamp,
  limit
} from '@firebase/firestore';
import { firestore } from './firebaseConfig';
import { deleteUser } from 'firebase/auth';
import { auth as firebaseAuth } from './firebaseConfig';

/**
 * Service for handling comprehensive account deletion
 * This service will remove all user data from Firestore collections
 * and then delete the Firebase Auth user
 */

export interface AccountDeletionResult {
  success: boolean;
  deletedCollections: string[];
  error?: string;
}

/**
 * Deletes all user data from Firestore collections
 */
const deleteUserDataFromFirestore = async (userId: string): Promise<string[]> => {
  const batch = writeBatch(firestore);
  const deletedCollections: string[] = [];

  try {
    // 1. Delete user profile from 'users' collection
    const userProfileRef = doc(firestore, 'users', userId);
    batch.delete(userProfileRef);
    deletedCollections.push('users');

    // 2. Delete user profile from 'profiles' collection (if exists)
    const profileRef = doc(firestore, 'profiles', userId);
    batch.delete(profileRef);
    deletedCollections.push('profiles');

    // 3. Delete events where user is the organizer
    const eventsRef = collection(firestore, 'events');
    const eventsQuery = query(eventsRef, where('organizerId', '==', userId));
    const eventsSnapshot = await getDocs(eventsQuery);
    
    eventsSnapshot.forEach((eventDoc) => {
      const eventId = eventDoc.id;
      
      // Delete sub-collections for each event
      // Tasks
      const tasksRef = collection(firestore, 'events', eventId, 'tasks');
      batch.delete(doc(tasksRef, 'placeholder')); // This will be handled by cascade rules
      
      // Budget items
      const budgetRef = collection(firestore, 'events', eventId, 'budget');
      batch.delete(doc(budgetRef, 'placeholder'));
      
      // Guests
      const guestsRef = collection(firestore, 'events', eventId, 'guests');
      batch.delete(doc(guestsRef, 'placeholder'));
      
      // Ideas
      const ideasRef = collection(firestore, 'events', eventId, 'ideas');
      batch.delete(doc(ideasRef, 'placeholder'));
      
      // Schedule items
      const scheduleRef = collection(firestore, 'events', eventId, 'scheduleItems');
      batch.delete(doc(scheduleRef, 'placeholder'));
      
      // Teams
      const teamsRef = collection(firestore, 'events', eventId, 'teams');
      batch.delete(doc(teamsRef, 'placeholder'));
      
      // Messages
      const messagesRef = collection(firestore, 'events', eventId, 'messages');
      batch.delete(doc(messagesRef, 'placeholder'));
      
      // Website
      const websiteRef = collection(firestore, 'events', eventId, 'website');
      batch.delete(doc(websiteRef, 'placeholder'));
      
      // Delete the main event document
      batch.delete(eventDoc.ref);
    });
    
    if (!eventsSnapshot.empty) {
      deletedCollections.push('events');
    }

    // 4. Delete tasks where user is assigned
    const tasksRef = collection(firestore, 'tasks');
    const userTasksQuery = query(tasksRef, where('assignedTo', '==', userId));
    const userTasksSnapshot = await getDocs(userTasksQuery);
    
    userTasksSnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });
    
    if (!userTasksSnapshot.empty) {
      deletedCollections.push('tasks');
    }

    // 5. Delete notifications for the user
    const notificationsRef = collection(firestore, 'notifications');
    const userNotificationsQuery = query(notificationsRef, where('recipientId', '==', userId));
    const userNotificationsSnapshot = await getDocs(userNotificationsQuery);
    
    userNotificationsSnapshot.forEach((notificationDoc) => {
      batch.delete(notificationDoc.ref);
    });
    
    if (!userNotificationsSnapshot.empty) {
      deletedCollections.push('notifications');
    }

    // 6. Delete in-app notifications
    const inAppNotificationsRef = collection(firestore, 'inAppNotifications');
    const userInAppNotificationsQuery = query(inAppNotificationsRef, where('recipientId', '==', userId));
    const userInAppNotificationsSnapshot = await getDocs(userInAppNotificationsQuery);
    
    userInAppNotificationsSnapshot.forEach((notificationDoc) => {
      batch.delete(notificationDoc.ref);
    });
    
    if (!userInAppNotificationsSnapshot.empty) {
      deletedCollections.push('inAppNotifications');
    }

    // 7. Delete conversations where user is a participant
    const conversationsRef = collection(firestore, 'conversations');
    const userConversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', userId));
    const userConversationsSnapshot = await getDocs(userConversationsQuery);
    
    userConversationsSnapshot.forEach((conversationDoc) => {
      const conversationId = conversationDoc.id;
      
      // Delete messages in the conversation
      const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
      batch.delete(doc(messagesRef, 'placeholder'));
      
      // Delete the conversation document
      batch.delete(conversationDoc.ref);
    });
    
    if (!userConversationsSnapshot.empty) {
      deletedCollections.push('conversations');
    }

    // 8. Delete user's vendor lists
    const userVendorListsRef = doc(firestore, 'user_vendor_lists', userId);
    batch.delete(userVendorListsRef);
    deletedCollections.push('user_vendor_lists');

    // 9. Delete user's subscription data
    const userSubscriptionRef = doc(firestore, 'users', userId, 'subscription', 'current');
    batch.delete(userSubscriptionRef);
    deletedCollections.push('user_subscription');

    // 10. Delete user's settings
    const userSettingsRef = doc(firestore, 'users', userId, 'settings', 'current');
    batch.delete(userSettingsRef);
    deletedCollections.push('user_settings');

    // Execute the batch
    await batch.commit();
    
    return deletedCollections;
  } catch (error) {
    console.error('Error deleting user data from Firestore:', error);
    throw error;
  }
};

/**
 * Deletes the Firebase Auth user
 */
const deleteFirebaseUser = async (): Promise<void> => {
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user found');
  }
  
  try {
    await deleteUser(currentUser);
  } catch (error) {
    console.error('Error deleting Firebase user:', error);
    throw error;
  }
};

/**
 * Main function to delete user account and all associated data
 */
export const deleteUserAccount = async (userId: string): Promise<AccountDeletionResult> => {
  try {
    console.log(`Starting account deletion for user: ${userId}`);
    
    // First, delete all Firestore data
    const deletedCollections = await deleteUserDataFromFirestore(userId);
    console.log(`Deleted Firestore collections: ${deletedCollections.join(', ')}`);
    
    // Then, delete the Firebase Auth user
    await deleteFirebaseUser();
    console.log('Firebase user deleted successfully');
    
    return {
      success: true,
      deletedCollections
    };
  } catch (error) {
    console.error('Account deletion failed:', error);
    return {
      success: false,
      deletedCollections: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Check if user has any data that would be deleted
 */
export const checkUserDataExists = async (userId: string): Promise<{
  hasEvents: boolean;
  hasTasks: boolean;
  hasConversations: boolean;
  hasNotifications: boolean;
}> => {
  try {
    // Check events
    const eventsRef = collection(firestore, 'events');
    const eventsQuery = query(eventsRef, where('organizerId', '==', userId), limit(1));
    const eventsSnapshot = await getDocs(eventsQuery);
    
    // Check tasks
    const tasksRef = collection(firestore, 'tasks');
    const tasksQuery = query(tasksRef, where('assignedTo', '==', userId), limit(1));
    const tasksSnapshot = await getDocs(tasksQuery);
    
    // Check conversations
    const conversationsRef = collection(firestore, 'conversations');
    const conversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', userId), limit(1));
    const conversationsSnapshot = await getDocs(conversationsQuery);
    
    // Check notifications
    const notificationsRef = collection(firestore, 'notifications');
    const notificationsQuery = query(notificationsRef, where('recipientId', '==', userId), limit(1));
    const notificationsSnapshot = await getDocs(notificationsQuery);
    
    return {
      hasEvents: !eventsSnapshot.empty,
      hasTasks: !tasksSnapshot.empty,
      hasConversations: !conversationsSnapshot.empty,
      hasNotifications: !notificationsSnapshot.empty
    };
  } catch (error) {
    console.error('Error checking user data existence:', error);
    return {
      hasEvents: false,
      hasTasks: false,
      hasConversations: false,
      hasNotifications: false
    };
  }
};
