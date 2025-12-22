import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, writeBatch, Timestamp } from '@firebase/firestore';
import { firestore } from './firebaseConfig';
import { UserProfile } from '../types/userTypes';
import { InAppNotification, NewNotificationPayload, } from '../types/notificationTypes';
import { isValidE164Format } from '../utils/phoneUtils';
import { sendPush, sendText, sendEmail } from './messagingService';
import { getUserProfileByEmail } from './userService';
import { getGenericNotificationEmail, getEventInvitationEmail, getRsvpReminderEmail } from './emailTemplates';

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
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
};

export const getPushToken = async (): Promise<string | null> => {
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'ad4bb59d-fd0d-4396-af25-8c32f9c8bb42',
    });
    const token = tokenData.data;
    console.log('✅ Expo Push Token obtained:', token);
    console.log('Token type: Expo Push Token');
    return token;
  } catch (error) {
    console.error('❌ Error getting push token:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return null;
  }
};

export const saveFcmTokenToProfile = async (isAuthenticated: boolean, userId: string, token: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!userId || !token) {
    console.warn('⚠️ Cannot save token: missing userId or token', { userId, hasToken: !!token });
    return;
  }
  try {
    console.log(`💾 Saving push token for user ${userId}...`);
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserProfile;
      if (userData.fcmTokens && userData.fcmTokens.includes(token)) {
        console.log("✅ Token already exists for user:", userId);
        return;
      }
      console.log(`📝 User currently has ${userData.fcmTokens?.length || 0} token(s)`);
    } else {
      console.warn(`⚠️ User document ${userId} does not exist yet`);
    }
    await updateDoc(userDocRef, {
      fcmTokens: arrayUnion(token),
    });
    console.log('✅ Push token saved successfully for user:', userId);
    console.log('Token preview:', token.substring(0, 30) + '...');
  } catch (error) {
    console.error('❌ Error saving push token:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
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

export const initializeNotificationHandlers = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const subscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
    console.log('Notification tapped:', response.notification.request.content);
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
      createdAt: serverTimestamp(),
    });
    console.log('In-app notification sent and saved with ID:', notificationDocRef.id);

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

export const deleteInAppNotification = async (notificationId: string): Promise<boolean> => {
  if (!notificationId) return false;
  try {
    const notificationDocRef = doc(firestore, IN_APP_NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationDocRef, { isDeleted: true, updatedAt: serverTimestamp() });
    console.log('Notification marked as deleted:', notificationId);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

export const sendPushNotificationInternal = async (
  recipientId: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> => {
  console.log(`📤 Attempting to send PUSH notification to ${recipientId}`);
  console.log(`   Title: "${title}"`);
  console.log(`   Body: "${body}"`);
  if (data) {
    console.log(`   Data:`, data);
  }
  
  if (!recipientId || !title || !body) {
    console.error('❌ Missing required parameters for push notification:', { 
      hasRecipientId: !!recipientId, 
      hasTitle: !!title, 
      hasBody: !!body 
    });
    return false;
  }

  try {
    // Get user's push token from Firestore
    const userDocRef = doc(firestore, 'users', recipientId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error(`User with ID ${recipientId} not found. Cannot send push notification.`);
      return false;
    }

    const userData = userDocSnap.data() as UserProfile;
    const pushToken = userData.fcmTokens?.[0]; // Use the first token, or implement logic to select the right one

    if (!pushToken) {
      console.error(`User ${recipientId} has no push token. Cannot send push notification.`);
      return false;
    }

    // Convert data to the format expected by messaging API (all values as strings)
    const notificationData: Record<string, unknown> = {};
    if (data) {
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value !== undefined && value !== null) {
          notificationData[key] = value;
        }
      });
    }

    console.log('📞 Calling messaging API to send push notification...');
    const result = await sendPush({
      to: pushToken,
      title,
      body,
      data: Object.keys(notificationData).length > 0 ? notificationData : undefined,
    });
    
    if (result.success) {
      console.log(`✅ Push notification successfully sent for recipient: ${recipientId}`);
      return true;
    } else {
      console.warn(`⚠️ Failed to send push notification for recipient ${recipientId}:`, result.message || result.error);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Error sending push notification via messaging API:', error);
    console.error('   Error details:', error.message || JSON.stringify(error, null, 2));
    return false;
  }
};

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
    let toPhoneNumber : string | undefined | null = phoneNumber;
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

    if (!isValidE164Format(toPhoneNumber)) {
      console.error(`Invalid phone number format: ${toPhoneNumber}. Must be in E.164 format (e.g., +1234567890).`);
      return false;
    }

    console.log('📞 Calling messaging API to send SMS...');
    const result = await sendText({
      to: toPhoneNumber,
      message,
      from: fromPhoneNumber, // Optional: uses configured Twilio number if not provided
    });
    
    if (result.success) {
      console.log(`SMS notification successfully sent for recipient: ${recipientId}`, 
        result.data?.messageId ? `Message ID: ${result.data.messageId}` : ''
      );
      return true;
    } else {
      console.warn(`Failed to send SMS notification for recipient ${recipientId}:`, result.message || result.error);
      return false;
    }
  } catch (error: any) {
    console.error('Error sending SMS notification via messaging API:', error);
    console.error('   Error details:', error.message || JSON.stringify(error, null, 2));
    return false;
  }
};

export const sendEmailNotificationInternal = async (
  recipientId: string,
  subject: string,
  htmlContent: string, // Changed to htmlContent to match Cloud Function
  fromEmail?: string, // Optional sender email
  fromName?: string // Optional sender name
): Promise<boolean> => {
  console.log(`Attempting to send EMAIL notification to ${recipientId}: Subject: "${subject}"`);

  try {
    const userDocRef = doc(firestore, 'users', recipientId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error(`User with ID ${recipientId} not found. Cannot send email.`);
      return false;
    }

    const userData = userDocSnap.data() as UserProfile;
    const toEmail = userData.email;

    if (!toEmail) {
      console.error(`User ${recipientId} has no email address. Cannot send email.`);
      return false;
    }

    console.log('📞 Calling messaging API to send email...');
    const result = await sendEmail({
      to: toEmail,
      subject,
      body: htmlContent,
      from: fromEmail,
    });

    if (result.success) {
      console.log(`Email notification successfully sent for recipient: ${recipientId}`);
      return true;
    } else {
      console.error(`Failed to send email notification for recipient ${recipientId}:`, result.message || result.error);
      return false;
    }
  } catch (error) {
    console.error('Error sending email notification via messaging API:', error);
    return false;
  }
};

export const sendNotification = async (payload: NewNotificationPayload): Promise<void> => {
  const { recipientId, title, body } = payload;

  try {
    const inAppNotificationId = await sendInAppNotificationInternal(payload);
    if (inAppNotificationId) {
      console.log(`In-app notification (with push) successfully sent for recipient: ${recipientId}`);
    } else {
      console.error(`Failed to send in-app notification for recipient: ${recipientId}`);
    }
  } catch (error) {
    console.error(`Error in sendInAppNotificationInternal for ${recipientId}:`, error);
  }

  const emailTemplate = getGenericNotificationEmail(title, body);

  sendEmailNotificationInternal(recipientId, emailTemplate.subject, emailTemplate.htmlContent)
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

/**
 * Sends event invitation notifications via in-app, email, and SMS
 * @param guestEmail - Guest's email address
 * @param guestName - Guest's name
 * @param guestPhone - Guest's phone number (optional)
 * @param eventName - Name of the event
 * @param eventDate - Event date
 * @param eventTime - Event time (optional)
 * @param eventLocation - Event location (optional)
 * @param organizerName - Name of the event organizer
 * @param eventId - Event ID for navigation
 */
export const createEventInvitationNotification = async (
  guestEmail: string | undefined,
  guestName: string,
  guestPhone: string | undefined,
  eventName: string,
  eventDate: string,
  eventTime: string | undefined,
  eventLocation: string | undefined,
  organizerName: string,
  eventId: string
): Promise<void> => {
  console.log(`Sending event invitation notifications for ${guestName} to event ${eventName}`);

  // 1. Send in-app notification if guest is a registered user
  if (guestEmail) {
    try {
      const guestUser = await getUserProfileByEmail(guestEmail);
      if (guestUser?.userId) {
        const notification: NewNotificationPayload = {
          recipientId: guestUser.userId,
          type: 'event_invite',
          title: 'Event Invitation',
          body: `You've been invited to ${eventName} by ${organizerName}!`,
          data: {
            screen: 'EventDetails',
            itemId: eventId
          }
        };
        await sendInAppNotificationInternal(notification);
        console.log(`In-app notification sent to registered user ${guestUser.userId}`);
      } else {
        console.log(`Guest ${guestEmail} is not a registered user, skipping in-app notification`);
      }
    } catch (error) {
      console.error('Error sending in-app notification for event invitation:', error);
      // Continue with email/SMS even if in-app fails
    }
  }

  // 2. Send email notification
  if (guestEmail) {
    try {
      const emailTemplate = getEventInvitationEmail(
        guestName,
        organizerName,
        eventName,
        eventDate,
        eventTime,
        eventLocation
      );
      
      const result = await sendEmail({
        to: guestEmail,
        subject: emailTemplate.subject,
        body: emailTemplate.htmlContent,
      });
      
      if (result.success) {
        console.log(`Email invitation sent to ${guestEmail}`);
      } else {
        console.warn(`Failed to send email invitation to ${guestEmail}:`, result.message || result.error);
      }
    } catch (error) {
      console.error(`Error sending email invitation to ${guestEmail}:`, error);
    }
  }

  // 3. Send SMS notification
  if (guestPhone && isValidE164Format(guestPhone)) {
    try {
      const smsMessage = `Hi ${guestName}! You're invited to ${eventName} on ${eventDate}${eventTime ? ` at ${eventTime}` : ''}${eventLocation ? ` (${eventLocation})` : ''}. Organized by ${organizerName}. Please check your email or the app to RSVP.`;
      
      const result = await sendText({
        to: guestPhone,
        message: smsMessage,
      });
      
      if (result.success) {
        console.log(`SMS invitation sent to ${guestPhone}`);
      } else {
        console.warn(`Failed to send SMS invitation to ${guestPhone}:`, result.message || result.error);
      }
    } catch (error) {
      console.error(`Error sending SMS invitation to ${guestPhone}:`, error);
    }
  } else if (guestPhone) {
    console.warn(`Invalid phone number format for SMS invitation: ${guestPhone}. Must be in E.164 format (e.g., +1234567890)`);
  }
};

/**
 * Sends RSVP reminder notifications via in-app, email, and SMS
 * @param guestEmail - Guest's email address
 * @param guestName - Guest's name
 * @param guestPhone - Guest's phone number (optional)
 * @param eventName - Name of the event
 * @param eventDate - Event date
 * @param eventTime - Event time (optional)
 * @param eventLocation - Event location (optional)
 * @param organizerName - Name of the event organizer
 * @param eventId - Event ID for navigation
 */
export const createRsvpReminderNotification = async (
  guestEmail: string | undefined,
  guestName: string,
  guestPhone: string | undefined,
  eventName: string,
  eventDate: string,
  eventTime: string | undefined,
  eventLocation: string | undefined,
  organizerName: string,
  eventId: string
): Promise<void> => {
  console.log(`Sending RSVP reminder notifications for ${guestName} for event ${eventName}`);

  // 1. Send in-app notification if guest is a registered user
  if (guestEmail) {
    try {
      const guestUser = await getUserProfileByEmail(guestEmail);
      if (guestUser?.userId) {
        const notification: NewNotificationPayload = {
          recipientId: guestUser.userId,
          type: 'rsvp_reminder',
          title: 'RSVP Reminder',
          body: `Reminder: Please RSVP for ${eventName} by ${organizerName}!`,
          data: {
            screen: 'EventDetails',
            itemId: eventId
          }
        };
        await sendInAppNotificationInternal(notification);
        console.log(`In-app RSVP reminder sent to registered user ${guestUser.userId}`);
      } else {
        console.log(`Guest ${guestEmail} is not a registered user, skipping in-app notification`);
      }
    } catch (error) {
      console.error('Error sending in-app notification for RSVP reminder:', error);
      // Continue with email/SMS even if in-app fails
    }
  }

  // 2. Send email notification
  if (guestEmail) {
    try {
      const emailTemplate = getRsvpReminderEmail(
        guestName,
        organizerName,
        eventName,
        eventDate,
        eventTime,
        eventLocation
      );
      
      const result = await sendEmail({
        to: guestEmail,
        subject: emailTemplate.subject,
        body: emailTemplate.htmlContent,
      });
      
      if (result.success) {
        console.log(`Email RSVP reminder sent to ${guestEmail}`);
      } else {
        console.warn(`Failed to send email RSVP reminder to ${guestEmail}:`, result.message || result.error);
      }
    } catch (error) {
      console.error(`Error sending email RSVP reminder to ${guestEmail}:`, error);
    }
  }

  // 3. Send SMS notification
  if (guestPhone && isValidE164Format(guestPhone)) {
    try {
      const smsMessage = `Hi ${guestName}! Reminder: You're invited to ${eventName} on ${eventDate}${eventTime ? ` at ${eventTime}` : ''}${eventLocation ? ` (${eventLocation})` : ''}. Organized by ${organizerName}. Please check your email or the app to RSVP.`;
      
      const result = await sendText({
        to: guestPhone,
        message: smsMessage,
      });
      
      if (result.success) {
        console.log(`SMS RSVP reminder sent to ${guestPhone}`);
      } else {
        console.warn(`Failed to send SMS RSVP reminder to ${guestPhone}:`, result.message || result.error);
      }
    } catch (error) {
      console.error(`Error sending SMS RSVP reminder to ${guestPhone}:`, error);
    }
  } else if (guestPhone) {
    console.warn(`Invalid phone number format for SMS RSVP reminder: ${guestPhone}. Must be in E.164 format (e.g., +1234567890)`);
  }
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
