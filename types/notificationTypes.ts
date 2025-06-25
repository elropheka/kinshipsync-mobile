export interface InAppNotificationData {
  screen?: string; // e.g., 'Chat', 'EventDetails'
  itemId?: string; // e.g., chatId, eventId
  url?: string; // Added for deep linking to external URLs or specific app routes
  // Add other relevant data fields as needed
}

export interface InAppNotification {
  id: string; // Firestore document ID
  recipientId: string;
  senderId?: string; // Optional, for system notifications or if sender is not a user
  type: string; // e.g., 'new_message', 'event_reminder', 'task_assigned', 'system_alert'
  title: string;
  body: string;
  data?: InAppNotificationData; // For navigation or other actions
  isRead: boolean;
  createdAt: number; // Timestamp (e.g., Date.now() or Firestore ServerTimestamp)
  updatedAt?: number; // Timestamp for when it was read or modified
}

// Example specific notification types (optional, for better type safety)
export type NotificationType =
  // Existing types
  | 'new_message'
  | 'event_invite'
  | 'event_reminder'
  | 'event_update'
  | 'task_assigned'
  | 'task_completed'
  | 'budget_update'
  | 'new_comment'
  | 'friend_request'
  | 'system_alert'
  | 'generic'
  // New types
  | 'team_member_added'
  | 'family_tree_update'
  | 'team_task_update'
  | 'vendor_booking'
  | 'vendor_confirmation'
  | 'vendor_quote'
  | 'vendor_review'
  | 'budget_item_added'
  | 'payment_made'
  | 'budget_milestone'
  | 'rsvp_received'
  | 'guest_milestone'
  | 'dietary_preference'
  | 'schedule_added'
  | 'schedule_conflict'
  | 'schedule_reminder'
  | 'idea_submitted'
  | 'idea_popular'
  | 'idea_comment'
  | 'website_published'
  | 'website_updated'
  | 'website_stats'
  | 'event_countdown'
  | 'planning_progress'
  | 'vendor_suggestion'
  | 'theme_recommendation'
  | 'task_reminder';

// Interface for sending a notification (before it's saved with an ID and timestamps)
export interface NewNotificationPayload {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: InAppNotificationData;
}
