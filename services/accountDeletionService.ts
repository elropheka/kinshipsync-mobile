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

export interface AccountDeletionResult {
  success: boolean;
  deletedCollections: string[];
  error?: string;
}

const deleteUserDataFromFirestore = async (userId: string): Promise<string[]> => {
  const batch = writeBatch(firestore);
  const deletedCollections: string[] = [];

  try {
    const userProfileRef = doc(firestore, 'users', userId);
    batch.delete(userProfileRef);
    deletedCollections.push('users');

    const profileRef = doc(firestore, 'profiles', userId);
    batch.delete(profileRef);
    deletedCollections.push('profiles');

    const eventsRef = collection(firestore, 'events');
    const eventsQuery = query(eventsRef, where('organizerId', '==', userId));
    const eventsSnapshot = await getDocs(eventsQuery);
    
    eventsSnapshot.forEach((eventDoc) => {
      const eventId = eventDoc.id;
      
      const tasksRef = collection(firestore, 'events', eventId, 'tasks');
      batch.delete(doc(tasksRef, 'placeholder'));
      
      const budgetRef = collection(firestore, 'events', eventId, 'budget');
      batch.delete(doc(budgetRef, 'placeholder'));
      
      const guestsRef = collection(firestore, 'events', eventId, 'guests');
      batch.delete(doc(guestsRef, 'placeholder'));
      
      const ideasRef = collection(firestore, 'events', eventId, 'ideas');
      batch.delete(doc(ideasRef, 'placeholder'));
      
      const scheduleRef = collection(firestore, 'events', eventId, 'scheduleItems');
      batch.delete(doc(scheduleRef, 'placeholder'));
      
      const teamsRef = collection(firestore, 'events', eventId, 'teams');
      batch.delete(doc(teamsRef, 'placeholder'));
      
      const messagesRef = collection(firestore, 'events', eventId, 'messages');
      batch.delete(doc(messagesRef, 'placeholder'));
      
      const websiteRef = collection(firestore, 'events', eventId, 'website');
      batch.delete(doc(websiteRef, 'placeholder'));
      
      batch.delete(eventDoc.ref);
    });
    
    if (!eventsSnapshot.empty) {
      deletedCollections.push('events');
    }

    const tasksRef = collection(firestore, 'tasks');
    const userTasksQuery = query(tasksRef, where('assignedTo', '==', userId));
    const userTasksSnapshot = await getDocs(userTasksQuery);
    
    userTasksSnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });
    
    if (!userTasksSnapshot.empty) {
      deletedCollections.push('tasks');
    }

    const notificationsRef = collection(firestore, 'notifications');
    const userNotificationsQuery = query(notificationsRef, where('recipientId', '==', userId));
    const userNotificationsSnapshot = await getDocs(userNotificationsQuery);
    
    userNotificationsSnapshot.forEach((notificationDoc) => {
      batch.delete(notificationDoc.ref);
    });
    
    if (!userNotificationsSnapshot.empty) {
      deletedCollections.push('notifications');
    }

    const inAppNotificationsRef = collection(firestore, 'inAppNotifications');
    const userInAppNotificationsQuery = query(inAppNotificationsRef, where('recipientId', '==', userId));
    const userInAppNotificationsSnapshot = await getDocs(userInAppNotificationsQuery);
    
    userInAppNotificationsSnapshot.forEach((notificationDoc) => {
      batch.delete(notificationDoc.ref);
    });
    
    if (!userInAppNotificationsSnapshot.empty) {
      deletedCollections.push('inAppNotifications');
    }

    const conversationsRef = collection(firestore, 'conversations');
    const userConversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', userId));
    const userConversationsSnapshot = await getDocs(userConversationsQuery);
    
    userConversationsSnapshot.forEach((conversationDoc) => {
      const conversationId = conversationDoc.id;
      
      const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
      batch.delete(doc(messagesRef, 'placeholder'));
      
      batch.delete(conversationDoc.ref);
    });
    
    if (!userConversationsSnapshot.empty) {
      deletedCollections.push('conversations');
    }

    const userVendorListsRef = doc(firestore, 'user_vendor_lists', userId);
    batch.delete(userVendorListsRef);
    deletedCollections.push('user_vendor_lists');

    const userSubscriptionRef = doc(firestore, 'users', userId, 'subscription', 'current');
    batch.delete(userSubscriptionRef);
    deletedCollections.push('user_subscription');

    const userSettingsRef = doc(firestore, 'users', userId, 'settings', 'current');
    batch.delete(userSettingsRef);
    deletedCollections.push('user_settings');

    await batch.commit();
    
    return deletedCollections;
  } catch (error) {
    console.error('Error deleting user data from Firestore:', error);
    throw error;
  }
};

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

export const deleteUserAccount = async (userId: string): Promise<AccountDeletionResult> => {
  try {
    console.log(`Starting account deletion for user: ${userId}`);
    
    const deletedCollections = await deleteUserDataFromFirestore(userId);
    console.log(`Deleted Firestore collections: ${deletedCollections.join(', ')}`);
    
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

export const checkUserDataExists = async (userId: string): Promise<{
  hasEvents: boolean;
  hasTasks: boolean;
  hasConversations: boolean;
  hasNotifications: boolean;
}> => {
  try {
    const eventsRef = collection(firestore, 'events');
    const eventsQuery = query(eventsRef, where('organizerId', '==', userId), limit(1));
    const eventsSnapshot = await getDocs(eventsQuery);
    
    const tasksRef = collection(firestore, 'tasks');
    const tasksQuery = query(tasksRef, where('assignedTo', '==', userId), limit(1));
    const tasksSnapshot = await getDocs(tasksQuery);
    
    const conversationsRef = collection(firestore, 'conversations');
    const conversationsQuery = query(conversationsRef, where('participantIds', 'array-contains', userId), limit(1));
    const conversationsSnapshot = await getDocs(conversationsQuery);
    
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
