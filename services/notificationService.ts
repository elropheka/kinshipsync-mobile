import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, writeBatch, Timestamp } from '@firebase/firestore';
import { firestore, app } from './firebaseConfig'; // Import 'app' for functions
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import for callable functions
import { UserProfile } from '../types/userTypes';
import { InAppNotification, NewNotificationPayload, NotificationType } from '../types/notificationTypes';
import { isValidE164Format } from '../utils/phoneUtils';

// --- Permission Handling ---
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      // Optionally, inform the user that they will not receive notifications.
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
};

// --- FCM Token Management ---
export const getPushToken = async (): Promise<string | null> => {
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    // For Firebase, you might need the Firebase specific token if not using Expo's push service directly
    // However, Expo's token can be used with FCM via Expo's servers or by mapping it.
    // For simplicity, we'll use the Expo token for now.
    // If direct FCM token is needed: await getFcmToken(); (from @react-native-firebase/messaging)
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

export const saveFcmTokenToProfile = async (isAuthenticated: boolean, userId: string, token: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!userId || !token) return;
  try {
    const userDocRef = doc(firestore, 'users', userId);
    // Ensure token is not already present before adding
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserProfile;
      if (userData.fcmTokens && userData.fcmTokens.includes(token)) {
        console.log("Token already exists for user:", userId);
        return;
      }
    }
    await updateDoc(userDocRef, {
      fcmTokens: arrayUnion(token),
    });
    console.log('FCM token saved for user:', userId);
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

export const removeFcmTokenFromProfile = async (isAuthenticated: boolean, userId: string, token: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!userId || !token) return;
  try {
    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, {
      fcmTokens: arrayRemove(token),
    });
    console.log('FCM token removed for user:', userId);
  } catch (error) {
    console.error('Error removing FCM token:', error);
  }
};

// --- Message Handling (Placeholders for now) ---
// To be called in App.tsx or a root component
export const initializeNotificationHandlers = () => {
  // Handles notifications that are received while the app is foregrounded
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false, // Or true, depending on your app's logic
      shouldShowBanner: true, // Added default
      shouldShowList: true,   // Added default
    }),
  });

  // Handles notifications that are tapped on by the user
  const subscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
    console.log('Notification tapped:', response.notification.request.content);
    const data = response.notification.request.content.data;
    // Navigate based on notification data if needed
    // e.g., if (data.screen) router.push(data.screen);
  });

  return () => {
    subscription.remove();
  };
};

// --- In-App Notification Service Logic ---
const IN_APP_NOTIFICATIONS_COLLECTION = 'inAppNotifications';

/**
 * Sends an in-app notification and stores it in Firestore.
 * Also automatically sends a push notification after successfully creating the in-app notification.
 */
export const sendInAppNotificationInternal = async (notificationPayload: NewNotificationPayload): Promise<string | null> => {
  try {
    const notificationDocRef = await addDoc(collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION), {
      ...notificationPayload,
      isRead: false,
      createdAt: serverTimestamp(), // Use server timestamp for consistency
    });
    console.log('In-app notification sent and saved with ID:', notificationDocRef.id);

    // Automatically send push notification after in-app notification is created
    const { recipientId, title, body, data } = notificationPayload;
    sendPushNotificationInternal(recipientId, title, body, data)
      .then(success => {
        if (success) {
          console.log(`Push notification also sent for in-app notification ${notificationDocRef.id}`);
        } else {
          console.warn(`Failed to send push notification for in-app notification ${notificationDocRef.id}`);
        }
      })
      .catch(error => {
        console.error(`Error sending push notification for in-app notification ${notificationDocRef.id}:`, error);
      });

    return notificationDocRef.id;
  } catch (error) {
    console.error('Error sending in-app notification:', error);
    return null;
  }
};

/**
 * Fetches in-app notifications for a given user.
 */
export const getInAppNotifications = async (userId: string): Promise<InAppNotification[]> => {
  if (!userId) {
    console.log('User ID is required to fetch notifications.');
    return [];
  }
  try {
    const q = query(
      collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION),
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const notifications = querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      return {
        id: docSnapshot.id,
        ...data,
        // Ensure createdAt is a number (milliseconds since epoch)
        createdAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
        updatedAt: (data.createdAt as Timestamp)?.toMillis() || Date.now(),
      } as InAppNotification;
    });
    return notifications;
  } catch (error) {
    console.error('Error fetching in-app notifications:', error);
    return [];
  }
};

/**
 * Marks a specific in-app notification as read.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  if (!notificationId) return false;
  try {
    const notificationDocRef = doc(firestore, IN_APP_NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationDocRef, {
      isRead: true,
      updatedAt: serverTimestamp(),
    });
    console.log('Notification marked as read:', notificationId);
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Marks all unread in-app notifications for a user as read.
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  try {
    const q = query(
      collection(firestore, IN_APP_NOTIFICATIONS_COLLECTION),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No unread notifications to mark as read for user:', userId);
      return true;
    }

    const batch = writeBatch(firestore);
    querySnapshot.docs.forEach(docSnapshot => {
      batch.update(docSnapshot.ref, { isRead: true, updatedAt: serverTimestamp() });
    });
    await batch.commit();
    console.log(`Marked ${querySnapshot.size} notifications as read for user:`, userId);
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Deletes a specific in-app notification.
 */
export const deleteInAppNotification = async (notificationId: string): Promise<boolean> => {
  if (!notificationId) return false;
  try {
    const notificationDocRef = doc(firestore, IN_APP_NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationDocRef, { isDeleted: true, updatedAt: serverTimestamp() }); // Soft delete
    // Or hard delete: await deleteDoc(notificationDocRef);
    console.log('Notification marked as deleted:', notificationId);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};


// --- Push Notification Service Logic ---
/**
 * Sends a push notification via Cloud Function.
 * Calls the 'sendPushNotification' callable Cloud Function which handles FCM token retrieval and sending.
 */
export const sendPushNotificationInternal = async (
  recipientId: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> => {
  console.log(`Attempting to send PUSH notification to ${recipientId}: Title: "${title}", Body: "${body}"`, data);
  
  if (!recipientId || !title || !body) {
    console.error('Missing required parameters for push notification:', { recipientId, title, body });
    return false;
  }

  try {
    const functionsInstance = getFunctions(app);
    const callableSendPush = httpsCallable(functionsInstance, 'sendPushNotification');

    // Convert data object to string key-value pairs for FCM (FCM data must be strings)
    const notificationData: { [key: string]: string } = {};
    if (data) {
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value !== undefined && value !== null) {
          notificationData[key] = String(value);
        }
      });
    }

    const result = await callableSendPush({
      recipientId,
      title,
      body,
      notificationData: Object.keys(notificationData).length > 0 ? notificationData : undefined,
    });

    const responseData = result.data as { success: boolean; message: string };
    
    if (responseData.success) {
      console.log(`Push notification successfully sent for recipient: ${recipientId}`);
      return true;
    } else {
      console.warn(`Failed to send push notification for recipient ${recipientId}:`, responseData.message);
      return false;
    }
  } catch (error: any) {
    console.error('Error sending push notification via Cloud Function:', error);
    // Handle specific Firebase errors
    if (error.code === 'functions/not-found') {
      console.error('Cloud Function "sendPushNotification" not found. Make sure it is deployed.');
    } else if (error.code === 'functions/permission-denied') {
      console.error('Permission denied when calling sendPushNotification. Check authentication.');
    }
    return false;
  }
};

// --- SMS Notification Service Logic ---
/**
 * Sends an SMS notification via Cloud Function using Twilio.
 * Calls the 'sendSMS' callable Cloud Function which handles SMS sending.
 */
export const sendSMSNotificationInternal = async (
  recipientId: string,
  message: string,
  phoneNumber?: string,
  fromPhoneNumber?: string
): Promise<boolean> => {
  console.log(`Attempting to send SMS notification to ${recipientId}: Message: "${message}"`);
  
  if (!recipientId || !message) {
    console.error('Missing required parameters for SMS notification:', { recipientId, message });
    return false;
  }

  try {
    // Fetch recipient's phone number from their user profile if not provided
    let toPhoneNumber = phoneNumber;
    if (!toPhoneNumber) {
      const userDocRef = doc(firestore, 'users', recipientId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error(`User with ID ${recipientId} not found. Cannot send SMS.`);
        return false;
      }

      const userData = userDocSnap.data() as UserProfile;
      toPhoneNumber = userData.phoneNumber;
    }

    if (!toPhoneNumber) {
      console.error(`User ${recipientId} has no phone number. Cannot send SMS.`);
      return false;
    }

    // Validate phone number format (E.164 format check)
    if (!isValidE164Format(toPhoneNumber)) {
      console.error(`Invalid phone number format: ${toPhoneNumber}. Must be in E.164 format (e.g., +1234567890).`);
      return false;
    }

    const functionsInstance = getFunctions(app);
    const callableSendSMS = httpsCallable(functionsInstance, 'sendSMS');

    const result = await callableSendSMS({
      toPhoneNumber,
      message,
      fromPhoneNumber, // Optional: uses configured Twilio number if not provided
    });

    const responseData = result.data as { success: boolean; message: string; messageId?: string; status?: string };
    
    if (responseData.success) {
      console.log(`SMS notification successfully sent for recipient: ${recipientId}`, 
        responseData.messageId ? `Message SID: ${responseData.messageId}` : '',
        responseData.status ? `Status: ${responseData.status}` : ''
      );
      return true;
    } else {
      console.warn(`Failed to send SMS notification for recipient ${recipientId}:`, responseData.message);
      return false;
    }
  } catch (error: any) {
    console.error('Error sending SMS notification via Cloud Function:', error);
    // Handle specific Firebase errors
    if (error.code === 'functions/not-found') {
      console.error('Cloud Function "sendSMS" not found. Make sure it is deployed.');
    } else if (error.code === 'functions/permission-denied') {
      console.error('Permission denied when calling sendSMS. Check authentication.');
    }
    return false;
  }
};

// --- Email Notification Service Logic ---
/**
 * Sends an email notification via Cloud Function.
 */
export const sendEmailNotificationInternal = async (
  recipientId: string,
  subject: string,
  htmlContent: string, // Changed to htmlContent to match Cloud Function
  fromEmail?: string, // Optional sender email
  fromName?: string // Optional sender name
): Promise<boolean> => {
  console.log(`Attempting to send EMAIL notification to ${recipientId}: Subject: "${subject}"`);

  try {
    // Fetch recipient's email address from their user profile
    const userDocRef = doc(firestore, 'users', recipientId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error(`User with ID ${recipientId} not found. Cannot send email.`);
      return false;
    }

    const userData = userDocSnap.data() as UserProfile;
    const toEmail = userData.email;
    const toName = userData.displayName;

    if (!toEmail) {
      console.error(`User ${recipientId} has no email address. Cannot send email.`);
      return false;
    }

    const functionsInstance = getFunctions(app);
    const callableSendEmail = httpsCallable(functionsInstance, 'sendEmail');

    const result = await callableSendEmail({
      toEmail,
      toName,
      subject,
      htmlContent,
      fromEmail,
      fromName,
    });

    const responseData = result.data as { success: boolean; message: string };
    if (responseData.success) {
      console.log(`Email notification successfully sent for recipient: ${recipientId}`);
      return true;
    } else {
      console.error(`Failed to send email notification for recipient ${recipientId}:`, responseData.message);
      return false;
    }
  } catch (error) {
    console.error('Error sending email notification via Cloud Function:', error);
    return false;
  }
};

// --- Unified Notification Sending Function ---
/**
 * Orchestrates sending notifications through different channels.
 * Sends In-App notification first (which now automatically sends push), then Email notifications independently.
 * Note: Push notifications are automatically sent by sendInAppNotificationInternal, so we don't call it separately here.
 */
export const sendNotification = async (payload: NewNotificationPayload): Promise<void> => {
  const { recipientId, title, body, data } = payload;

  // 1. Send In-App Notification (which now automatically sends push notification)
  // This is the primary notification channel and will trigger push notification automatically
  try {
    const inAppNotificationId = await sendInAppNotificationInternal(payload);
    if (inAppNotificationId) {
      console.log(`In-app notification (with push) successfully sent for recipient: ${recipientId}`);
    } else {
      console.error(`Failed to send in-app notification for recipient: ${recipientId}`);
      // Decide if you want to proceed if in-app fails. For now, we will.
    }
  } catch (error) {
    console.error(`Error in sendInAppNotificationInternal for ${recipientId}:`, error);
  }

  // 3. Send Email Notification (independently)
  // This should not block or depend on other notification results.
  // You might want to fetch user preferences here to see if they want email notifications.
  // For simplicity, we assume they do.
  const emailSubject = title; // Or a more specific subject
  const emailHtmlContent = `<p>${body}</p><p>View details in the app.</p>`; // Customize as needed, using HTML

  sendEmailNotificationInternal(recipientId, emailSubject, emailHtmlContent)
    .then(success => {
      if (success) {
        console.log(`Email notification process initiated for recipient: ${recipientId}`);
      } else {
        console.warn(`Email notification process failed for recipient: ${recipientId}`);
      }
    })
    .catch(error => {
      console.error(`Error in sendEmailNotificationInternal for ${recipientId}:`, error);
    });

  console.log(`All notification processes initiated for recipient: ${recipientId}`);
};

// Add new notification creation functions

// Team-related notifications
export const createTeamMemberAddedNotification = async (
  recipientId: string, 
  teamName: string, 
  memberName: string,
  teamId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'team_member_added',
    title: 'New Team Member',
    body: `${memberName} has joined the ${teamName} team.`,
    data: {
      screen: 'TeamDetails',
      itemId: teamId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createFamilyTreeUpdateNotification = async (
  recipientId: string,
  teamName: string,
  updateDetails: string,
  teamId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'family_tree_update',
    title: 'Family Tree Update',
    body: `The family tree for ${teamName} has been updated: ${updateDetails}.`,
    data: {
      screen: 'FamilyTree',
      itemId: teamId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createTeamTaskUpdateNotification = async (
  recipientId: string,
  teamName: string,
  taskTitle: string,
  status: string,
  taskId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'team_task_update',
    title: 'Team Task Update',
    body: `Task "${taskTitle}" in ${teamName} is now ${status}.`,
    data: {
      screen: 'TeamTasks',
      itemId: taskId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Vendor-related notifications
export const createVendorBookingNotification = async (
  recipientId: string,
  vendorName: string,
  eventName: string,
  vendorId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'vendor_booking',
    title: 'Vendor Booked',
    body: `${vendorName} has been booked for ${eventName}.`,
    data: {
      screen: 'VendorDetails',
      itemId: vendorId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createVendorConfirmationNotification = async (
  recipientId: string,
  vendorName: string,
  eventName: string,
  vendorId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'vendor_confirmation',
    title: 'Vendor Confirmed',
    body: `${vendorName} has confirmed for ${eventName}.`,
    data: {
      screen: 'VendorDetails',
      itemId: vendorId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createVendorQuoteNotification = async (
  recipientId: string,
  vendorName: string,
  eventName: string,
  vendorId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'vendor_quote',
    title: 'New Vendor Quote',
    body: `You have a new quote from ${vendorName} for ${eventName}.`,
    data: {
      screen: 'VendorDetails',
      itemId: vendorId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createVendorReviewNotification = async (
  recipientId: string,
  vendorName: string,
  reviewDetails: string,
  vendorId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'vendor_review',
    title: 'Vendor Review',
    body: `A new review for ${vendorName}: ${reviewDetails}.`,
    data: {
      screen: 'VendorReviews',
      itemId: vendorId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Budget-related notifications
export const createBudgetItemAddedNotification = async (
  recipientId: string,
  itemName: string,
  eventName: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'budget_item_added',
    title: 'New Budget Item',
    body: `"${itemName}" added to budget for ${eventName}.`,
    data: {
      screen: 'EventBudget',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createPaymentMadeNotification = async (
  recipientId: string,
  itemName: string,
  amount: number,
  eventName: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'payment_made',
    title: 'Payment Recorded',
    body: `Payment of $${amount.toFixed(2)} recorded for "${itemName}" in ${eventName}.`,
    data: {
      screen: 'EventBudget',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createBudgetMilestoneNotification = async (
  recipientId: string,
  eventName: string,
  percentage: number,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'budget_milestone',
    title: 'Budget Milestone',
    body: `You've allocated ${percentage}% of your budget for ${eventName}.`,
    data: {
      screen: 'EventBudget',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Guest-related notifications
export const createRsvpReceivedNotification = async (
  recipientId: string,
  guestName: string,
  rsvpStatus: string,
  eventName: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'rsvp_received',
    title: 'New RSVP',
    body: `${guestName} has ${rsvpStatus} for ${eventName}.`,
    data: {
      screen: 'EventGuests',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createGuestMilestoneNotification = async (
  recipientId: string,
  eventName: string,
  count: number,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'guest_milestone',
    title: 'Guest Milestone',
    body: `${count} guests have confirmed for ${eventName}.`,
    data: {
      screen: 'EventGuests',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createDietaryPreferenceNotification = async (
  recipientId: string,
  guestName: string,
  eventName: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'dietary_preference',
    title: 'Dietary Preference Update',
    body: `${guestName} has updated dietary preferences for ${eventName}.`,
    data: {
      screen: 'EventGuests',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Schedule-related notifications
export const createScheduleAddedNotification = async (
  recipientId: string,
  scheduleTitle: string,
  eventName: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'schedule_added',
    title: 'New Schedule Item',
    body: `"${scheduleTitle}" added to schedule for ${eventName}.`,
    data: {
      screen: 'EventSchedule',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createScheduleConflictNotification = async (
  recipientId: string,
  eventName: string,
  item1: string,
  item2: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'schedule_conflict',
    title: 'Schedule Conflict',
    body: `Conflict detected between "${item1}" and "${item2}" in ${eventName}.`,
    data: {
      screen: 'EventSchedule',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createScheduleReminderNotification = async (
  recipientId: string,
  scheduleTitle: string,
  eventName: string,
  time: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'schedule_reminder',
    title: 'Schedule Reminder',
    body: `"${scheduleTitle}" for ${eventName} is coming up at ${time}.`,
    data: {
      screen: 'EventSchedule',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Idea board activities
export const createIdeaSubmittedNotification = async (
  recipientId: string,
  ideaTitle: string,
  eventName: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'idea_submitted',
    title: 'New Idea Submitted',
    body: `A new idea "${ideaTitle}" has been submitted for ${eventName}.`,
    data: {
      screen: 'EventIdeas',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createIdeaPopularNotification = async (
  recipientId: string,
  ideaTitle: string,
  eventName: string,
  voteCount: number,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'idea_popular',
    title: 'Popular Idea',
    body: `Your idea "${ideaTitle}" for ${eventName} has received ${voteCount} votes!`,
    data: {
      screen: 'EventIdeas',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createIdeaCommentNotification = async (
  recipientId: string,
  ideaTitle: string,
  commenterName: string,
  eventName: string,
  ideaId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'idea_comment',
    title: 'New Comment on Idea',
    body: `${commenterName} commented on "${ideaTitle}" for ${eventName}.`,
    data: {
      screen: 'EventIdeaDetails',
      itemId: ideaId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Website activities
export const createWebsitePublishedNotification = async (
  recipientId: string,
  eventName: string,
  websiteUrl: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'website_published',
    title: 'Website Published',
    body: `The website for ${eventName} is now live!`,
    data: {
      screen: 'EventWebsite',
      itemId: eventId,
      url: websiteUrl
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createWebsiteUpdatedNotification = async (
  recipientId: string,
  eventName: string,
  updateDetails: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'website_updated',
    title: 'Website Updated',
    body: `The website for ${eventName} has been updated: ${updateDetails}.`,
    data: {
      screen: 'EventWebsite',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createWebsiteStatsNotification = async (
  recipientId: string,
  eventName: string,
  statsDetails: string,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'website_stats',
    title: 'Website Statistics',
    body: `Website for ${eventName} stats: ${statsDetails}.`,
    data: {
      screen: 'EventWebsiteAnalytics',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Milestone celebrations
export const createEventCountdownNotification = async (
  recipientId: string,
  eventName: string,
  daysLeft: number,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'event_countdown',
    title: 'Event Countdown',
    body: `Only ${daysLeft} days until ${eventName}!`,
    data: {
      screen: 'EventDetails',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createPlanningProgressNotification = async (
  recipientId: string,
  eventName: string,
  percentage: number,
  eventId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'planning_progress',
    title: 'Planning Progress',
    body: `You've completed ${percentage}% of your planning tasks for ${eventName}.`,
    data: {
      screen: 'EventTasks',
      itemId: eventId
    }
  };
  return sendInAppNotificationInternal(notification);
};

// Personalized recommendations
export const createVendorSuggestionNotification = async (
  recipientId: string,
  vendorName: string,
  eventName: string,
  reason: string,
  vendorId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'vendor_suggestion',
    title: 'Vendor Suggestion',
    body: `${vendorName} might be a good fit for ${eventName} (${reason}).`,
    data: {
      screen: 'VendorDetails',
      itemId: vendorId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createThemeRecommendationNotification = async (
  recipientId: string,
  themeName: string,
  reason: string,
  themeId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'theme_recommendation',
    title: 'Theme Recommendation',
    body: `Consider "${themeName}" for your event (${reason}).`,
    data: {
      screen: 'ThemeDetails',
      itemId: themeId
    }
  };
  return sendInAppNotificationInternal(notification);
};

export const createTaskReminderNotification = async (
  recipientId: string,
  taskTitle: string,
  eventName: string,
  dueDate: string,
  taskId: string
) => {
  const notification: NewNotificationPayload = {
    recipientId,
    type: 'task_reminder',
    title: 'Task Reminder',
    body: `Task "${taskTitle}" for ${eventName} is due on ${dueDate}.`,
    data: {
      screen: 'TaskDetails',
      itemId: taskId
    }
  };
  return sendInAppNotificationInternal(notification);
};
