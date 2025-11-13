import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// This needs to be done only once per deployment.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

interface PendingInvitationData {
  invitedGuestEmail?: string;
  invitedGuestName: string;
  organizerId: string;
  eventId: string;
  eventName: string;
  timestamp: admin.firestore.Timestamp;
  type?: string; // Added for differentiating invitation vs reminder
  guestId?: string; // Added for reminders
}

// Mirrored from client 'types/notificationTypes.ts' for consistency
interface InAppNotificationData {
  screen?: string;
  itemId?: string;
  url?: string; // Added for deep linking to external URLs or specific app routes
}

interface NewInAppNotificationPayload {
  recipientId: string;
  senderId?: string;
  type: string; // Should match one of the NotificationType string literals
  title: string;
  body: string;
  data?: InAppNotificationData;
  isRead: boolean;
  createdAt: admin.firestore.FieldValue; // For serverTimestamp
}

interface UserProfile {
  userId: string;
  displayName?: string;
  email?: string;
  fcmTokens?: string[];
  // other fields from your UserProfile type
}

interface Event {
  id: string;
  name: string;
  date: string; // ISO 8601 date string
  organizerId: string;
  teamIds?: string[];
  // other event fields
}

interface Team {
  id: string;
  name: string;
  memberIds: string[];
  // other team fields
}

/**
 * Sends an FCM notification.
 * @param {string[]} tokens - Array of FCM registration tokens.
 * @param {string} title - Notification title.
 * @param {string} body - Notification body.
 * @param {object} data - Additional data to send with the notification.
 */
async function sendFcmNotification(
  tokens: string[],
  title: string,
  body: string,
  data?: { [key: string]: string }
): Promise<void> {
  if (tokens.length === 0) {
    functions.logger.warn("No FCM tokens provided for notification.");
    return;
  }

  const message: admin.messaging.MulticastMessage = {
    tokens: tokens,
    notification: {
      title: title,
      body: body,
    },
    data: data || {},
    // Android specific configuration
    android: {
      priority: "high",
      notification: {
        sound: "default",
        // Add other Android specific options if needed
        // e.g. channelId: "kinshipsync_invitations"
      },
    },
    // APNS (iOS) specific configuration
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1, // Example: set badge number
          // Add other APNS specific options if needed
        },
      },
    },
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    functions.logger.info("Successfully sent FCM message(s):", response.successCount);
    if (response.failureCount > 0) {
      response.responses.forEach((resp: admin.messaging.SendResponse, idx: number) => {
        if (!resp.success) {
          functions.logger.error(
            `Failed to send FCM to token ${tokens[idx]}:`,
            resp.error
          );
          // TODO: Consider removing invalid/stale tokens from user's profile
        }
      });
    }
  } catch (error) {
    functions.logger.error("Error sending FCM message:", error);
  }
}

export const processEventInvitationFCM = functions.firestore
  .document("pending_event_invitations_fcm/{invitationId}")
  .onCreate(async (
    snapshot: functions.firestore.QueryDocumentSnapshot,
    // context: functions.EventContext
  ): Promise<null | void> => {
    const invitationData = snapshot.data() as PendingInvitationData;
    const {
      invitedGuestEmail,
      invitedGuestName,
      organizerId,
      eventId,
      eventName,
    } = invitationData;

    functions.logger.info(`Processing FCM invitation for event: ${eventName} (ID: ${eventId})`, invitationData);

    // --- Notify Invited Guest (if they are a registered user) ---
    if (invitedGuestEmail) {
      try {
        const usersRef = db.collection("users");
        const querySnapshot = await usersRef
          .where("email", "==", invitedGuestEmail.toLowerCase())
          .limit(1)
          .get();

        if (!querySnapshot.empty) {
          const invitedUserDoc = querySnapshot.docs[0];
          const invitedUserData = invitedUserDoc.data() as UserProfile;

          if (invitedUserData.fcmTokens && invitedUserData.fcmTokens.length > 0) {
            // Fetch organizer's name for the notification message
            let organizerDisplayName = "The organizer";
            if (organizerId) {
              const organizerDoc = await db.collection("users").doc(organizerId).get();
              if (organizerDoc.exists) {
                const organizerData = organizerDoc.data() as UserProfile;
                organizerDisplayName = organizerData.displayName || organizerDisplayName;
              }
            }

            let title = "You're Invited!";
            let body = `${organizerDisplayName} has invited you to the event: "${eventName}".`;
            let notificationType = "event_invite";

            if (invitationData.type === "reminder") {
              title = `Reminder: ${eventName}`;
              body = `Just a friendly reminder about the event: "${eventName}". We hope to see you there!`;
              notificationType = "event_reminder"; // Use a different type for in-app if needed
            }

            // Optional: Add data for deep linking
            const fcmType = invitationData.type === "reminder" ? "event_reminder" : "event_invitation";
            const fcmData = { eventId: eventId, type: fcmType };
            await sendFcmNotification(invitedUserData.fcmTokens, title, body, fcmData);
            functions.logger.info(
              `Sent FCM ${fcmType} to guest: ${invitedUserData.displayName} (${invitedGuestEmail})`
            );

            // Also create an in-app notification for the invited user
            const inAppNotificationPayload: NewInAppNotificationPayload = {
              recipientId: invitedUserDoc.id, // The invited user's ID
              senderId: organizerId, // The organizer who sent the invite
              type: notificationType,
              title: title,
              body: body,
              data: { screen: "EventDetails", itemId: eventId },
              isRead: false,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("inAppNotifications").add(inAppNotificationPayload);
            functions.logger.info(
              `Created in-app ${fcmType} for guest: ${invitedUserData.displayName}`
            );
          } else {
            functions.logger.warn(
              `Invited guest ${invitedGuestEmail} found, but has no FCM tokens.`
            );
          }
        } else {
          functions.logger.info(
            `Invited guest with email ${invitedGuestEmail} is not a registered user or email not found.`
          );
        }
      } catch (error) {
        functions.logger.error("Error processing notification for invited guest:", error);
      }
    } else {
      functions.logger.info("No email provided for invited guest, cannot send FCM.");
    }

    // --- Notify Event Organizer (Only for initial invitation, not for reminders) ---
    if (invitationData.type !== "reminder" && organizerId) {
      try {
        const organizerDoc = await db.collection("users").doc(organizerId).get();
        if (organizerDoc.exists) {
          const organizerData = organizerDoc.data() as UserProfile;
          if (organizerData.fcmTokens && organizerData.fcmTokens.length > 0) {
            const organizerNotificationTitle = "Guest Invited";
            const organizerNotificationBody =
              `You have successfully invited ${invitedGuestName} to your event: "${eventName}".`;
            const organizerFcmData = {
              eventId: eventId,
              guestName: invitedGuestName,
              type: "guest_invited_confirmation",
            };
            await sendFcmNotification(
              organizerData.fcmTokens,
              organizerNotificationTitle,
              organizerNotificationBody,
              organizerFcmData
            );
            functions.logger.info(
              `Sent FCM confirmation to organizer: ${organizerData.displayName} (ID: ${organizerId})`
            );
          } else {
            functions.logger.warn(
              `Organizer ${organizerId} found, but has no FCM tokens.`
            );
          }
        } else {
          functions.logger.warn(`Organizer with ID ${organizerId} not found.`);
        }
      } catch (error) {
        functions.logger.error("Error processing notification for event organizer:", error);
      }
    } else if (invitationData.type === "reminder") {
      functions.logger.info("Skipping organizer notification for reminder.");
    } else {
      functions.logger.warn("No organizerId provided, cannot send FCM confirmation to organizer.");
    }

    // Optional: Delete the trigger document after processing
    // return snapshot.ref.delete(); // Uncomment if you want to delete the trigger doc
    return null; // Indicate successful processing
  });

// --- Chat Message Notification Function ---
interface ChatMessageData {
  conversationId: string;
  senderId: string;
  senderDisplayName?: string;
  content: string;
  // other fields from your ChatMessage type
}

interface ConversationData {
  participantIds: string[]; // Assuming this structure based on client-side chatService
  participants: Array<{ userId: string; displayName?: string; avatarUrl?: string | null}>; // More robust
  // other fields from your Conversation type
}

export const sendChatMessageNotification = functions.firestore
  .document("conversations/{conversationId}/messages/{messageId}")
  .onCreate(async (
    snapshot: functions.firestore.QueryDocumentSnapshot,
    // context: functions.EventContext
  ): Promise<null | void> => {
    const messageData = snapshot.data() as ChatMessageData;
    const { conversationId, senderId, content } = messageData;
    const senderDisplayName = messageData.senderDisplayName || "Someone";

    functions.logger.info(
      `New message in conversation ${conversationId} from ${senderId}. Sending notifications.`
    );

    if (!conversationId || !senderId) {
      functions.logger.error("Missing conversationId or senderId in message data.", messageData);
      return null;
    }

    try {
      // 1. Get the conversation to find other participants
      const conversationRef = db.collection("conversations").doc(conversationId);
      const conversationSnap = await conversationRef.get();

      if (!conversationSnap.exists) {
        functions.logger.error(`Conversation ${conversationId} not found.`);
        return null;
      }
      const conversationData = conversationSnap.data() as ConversationData;
      let recipientUserIds: string[] = [];
      if (conversationData.participants && Array.isArray(conversationData.participants)) {
        recipientUserIds = conversationData.participants
          .map((p) => p.userId)
          .filter((uid) => uid !== senderId);
      } else if (conversationData.participantIds && Array.isArray(conversationData.participantIds)) {
        recipientUserIds = conversationData.participantIds.filter((uid) => uid !== senderId);
        functions.logger.warn(
          `Conversation ${conversationId} using 'participantIds' field. Consider migrating.`
        );
      }
      if (recipientUserIds.length === 0) {
        functions.logger.info("No other participants to notify in conversation:", conversationId);
        return null;
      }

      functions.logger.info(`Notifying participants: ${recipientUserIds.join(", ")} for new message.`);

      // 2. For each recipient, get their FCM tokens and send notification
      const userPromises = recipientUserIds.map(async (userId) => {
        const userDocRef = db.collection("users").doc(userId);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
          const userData = userDocSnap.data() as UserProfile;
          if (userData.fcmTokens && userData.fcmTokens.length > 0) {
            const title = `New message from ${senderDisplayName}`;
            const body = content.substring(0, 100); // Message snippet
            const notificationData = {
              conversationId: conversationId,
              messageId: snapshot.id, // ID of the new message document
              type: "new_message",
              navigateTo: `/(chat)/chatArea?conversationId=${conversationId}`, // Example deep link
            };
            await sendFcmNotification(userData.fcmTokens, title, body, notificationData);
            functions.logger.info(`Sent chat push notification to user ${userId}.`);
          } else {
            functions.logger.warn(`User ${userId} has no FCM tokens.`);
          }
        } else {
          functions.logger.warn(`User ${userId} not found.`);
        }
      });

      await Promise.all(userPromises);
      return null;
    } catch (error) {
      functions.logger.error(
        "Error sending chat message notifications for conversation " + conversationId + ":",
        error
      );
      return null;
    }
  });

// --- Scheduled Function for Upcoming Event Reminders ---
export const sendUpcomingEventReminders = functions.pubsub
  .schedule("every day 09:00") // Example: Run daily at 9 AM. Adjust timezone in Cloud Scheduler if needed.
  .timeZone("UTC") // Specify timezone, e.g., "America/New_York" or "UTC"
  .onRun(async (_context: functions.EventContext): Promise<null | void> => {
    functions.logger.info("Running scheduled job: sendUpcomingEventReminders");

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Format tomorrow's date as YYYY-MM-DD (assuming event.date is stored this way)
    // Adjust this formatting if your event dates are stored differently (e.g., ISO string, Timestamp)
    const tomorrowDateString = tomorrow.toISOString().split("T")[0];
    functions.logger.info(`Checking for events on: ${tomorrowDateString}`);

    try {
      const upcomingEventsQuery = db.collection("events").where("date", "==", tomorrowDateString);
      const upcomingEventsSnap = await upcomingEventsQuery.get();

      if (upcomingEventsSnap.empty) {
        functions.logger.info("No upcoming events for tomorrow.");
        return null;
      }

      functions.logger.info(`Found ${upcomingEventsSnap.size} events for tomorrow.`);

      const reminderPromises = upcomingEventsSnap.docs.map(async (eventDoc) => {
        const event = eventDoc.data();
        const eventId = eventDoc.id;
        const eventName = event.name || "Unnamed Event";

        functions.logger.info(`Processing reminders for event: ${eventName} (ID: ${eventId})`);

        // Fetch guests for this event
        // Assuming guests are in a subcollection: events/{eventId}/guests
        const guestsSnap = await db.collection("events").doc(eventId).collection("guests").get();
        if (guestsSnap.empty) {
          functions.logger.info(`No guests found for event ${eventName}.`);
          return;
        }

        for (const guestDoc of guestsSnap.docs) {
          const guest = guestDoc.data();
          if (!guest.email) { // Assuming guest documents have an email field
            functions.logger.warn(`Guest ${guestDoc.id} in event ${eventName} has no email, skipping reminder.`);
            continue;
          }

          // Find registered user by guest's email
          const usersRef = db.collection("users");
          const userQuerySnap = await usersRef.where("email", "==", guest.email.toLowerCase()).limit(1).get();

          if (!userQuerySnap.empty) {
            const userProfileDoc = userQuerySnap.docs[0];
            const userProfile = userProfileDoc.data() as UserProfile;
            const userId = userProfileDoc.id;

            const title = `Reminder: ${eventName} is tomorrow!`;
            const body = `Don't forget, ${eventName} is happening tomorrow, ${event.date}.`;
            const notificationData = {
              eventId: eventId,
              type: "event_reminder",
              navigateTo: `/(events)/details/${eventId}`, // Example deep link
            };

            // Send Push Notification
            if (userProfile.fcmTokens && userProfile.fcmTokens.length > 0) {
              await sendFcmNotification(userProfile.fcmTokens, title, body, notificationData);
              functions.logger.info(`Sent event reminder push to user ${userId} for event ${eventName}.`);
            } else {
              functions.logger.warn(`User ${userId} (guest: ${guest.email}) has no FCM tokens for event ${eventName}.`);
            }

            // Create In-App Notification
            const inAppPayload: NewInAppNotificationPayload = {
              recipientId: userId,
              type: "event_reminder",
              title: title,
              body: body,
              data: {
                screen: "EventDetails",
                itemId: eventId,
              },
              isRead: false,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("inAppNotifications").add(inAppPayload);
            functions.logger.info(`Created in-app event reminder for user ${userId} for event ${eventName}.`);
          } else {
            functions.logger.info(`Guest with email ${guest.email} (event ${eventName}) is not a registered user.`);
          }
        }
      });

      await Promise.all(reminderPromises);
      functions.logger.info("Finished processing event reminders.");
      return null;
    } catch (error) {
      functions.logger.error("Error in sendUpcomingEventReminders scheduled function:", error);
      return null;
    }
  });

// --- Scheduled Function for Daily Event Countdowns ---
export const dailyEventCountdowns = functions.pubsub.schedule("every 24 hours").onRun(async (
  _context: functions.EventContext) => {
  functions.logger.info("Running scheduled job: dailyEventCountdowns");

  try {
    const now = new Date();
    const eventsSnapshot = await db.collection("events").get();

    for (const doc of eventsSnapshot.docs) {
      const event = doc.data() as Event;
      const eventDate = new Date(event.date);

      // Calculate days until event
      const timeDiff = eventDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Send notifications at specific milestones
      if (daysLeft === 30 || daysLeft === 14 || daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
        // Fetch organizer's FCM tokens
        const organizerDoc = await db.collection("users").doc(event.organizerId).get();
        if (organizerDoc.exists) {
          const organizerData = organizerDoc.data() as UserProfile;
          if (organizerData.fcmTokens && organizerData.fcmTokens.length > 0) {
            const title = `Event Countdown: ${event.name}`;
            const body = `Only ${daysLeft} days until your event: "${event.name}"!`;
            const notificationData = {
              eventId: event.id,
              type: "event_countdown",
              navigateTo: `/(events)/details/${event.id}`,
            };
            await sendFcmNotification(organizerData.fcmTokens, title, body, notificationData);
            functions.logger.info(`Sent event countdown push to organizer 
              ${organizerData.displayName} for event ${event.name}.`);
          }
        }

        // Also notify team members if applicable
        if (event.teamIds && event.teamIds.length > 0) {
          for (const teamId of event.teamIds) {
            const teamDoc = await db.collection("teams").doc(teamId).get();
            if (teamDoc.exists) {
              const team = teamDoc.data() as Team;
              for (const memberId of team.memberIds) {
                if (memberId !== event.organizerId) { // Don't duplicate for organizer
                  const memberDoc = await db.collection("users").doc(memberId).get();
                  if (memberDoc.exists) {
                    const memberData = memberDoc.data() as UserProfile;
                    if (memberData.fcmTokens && memberData.fcmTokens.length > 0) {
                      const title = `Event Countdown: ${event.name}`;
                      const body = `Only ${daysLeft} days until the event: "${event.name}"!`;
                      const notificationData = {
                        eventId: event.id,
                        type: "event_countdown",
                        navigateTo: `/(events)/details/${event.id}`,
                      };
                      await sendFcmNotification(memberData.fcmTokens, title, body, notificationData);
                      functions.logger.info(`Sent event countdown push to team member ${memberData.displayName} 
                        for event ${event.name}.`);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    functions.logger.info("Finished processing daily event countdowns.");
    return null;
  } catch (error) {
    functions.logger.error("Error in dailyEventCountdowns scheduled function:", error);
    return null;
  }
});

/**
 * Callable Cloud Function to send a generic push notification.
 * This function can be called from the client to trigger a push notification.
 *
 * @param {object} data - The data for the notification.
 * @param {string} data.recipientId - The ID of the user to send the notification to.
 * @param {string} data.title - Notification title.
 * @param {string} data.body - Notification body.
 * @param {object} [data.notificationData] - Additional data to send with the notification (for deep linking, etc.).
 */
export const sendPushNotification = functions.https.onCall(async (request, _context) => {
  const { recipientId, title, body, notificationData } = request.data;

  if (!recipientId || !title || !body) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with 'recipientId', 'title', and 'body'."
    );
  }

  try {
    const userDoc = await db.collection("users").doc(recipientId).get();
    if (!userDoc.exists) {
      functions.logger.warn(`Recipient user ${recipientId} not found for push notification.`);
      return { success: false, message: "Recipient user not found." };
    }

    const userData = userDoc.data() as UserProfile;
    if (!userData.fcmTokens || userData.fcmTokens.length === 0) {
      functions.logger.warn(`Recipient user ${recipientId} has no FCM tokens.`);
      return { success: false, message: "Recipient has no FCM tokens." };
    }

    await sendFcmNotification(userData.fcmTokens, title, body, notificationData);
    functions.logger.info(`Successfully sent push notification to ${recipientId}.`);
    return { success: true, message: "Push notification sent successfully." };
  } catch (error: any) {
    functions.logger.error("Error sending push notification via callable function:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send push notification.",
      error.message
    );
  }
});

export * from "./mailjet";
export * from "./twilio";
