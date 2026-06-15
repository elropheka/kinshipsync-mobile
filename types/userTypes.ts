// User Profile
export interface UserProfile {
  userId: string; // Corresponds to the auth user ID
  firstName?: string | null;
  lastName?: string | null;
  displayName: string;
  email: string; // Usually from auth, but can be here for display
  bio?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null; // ISO 8601
  phoneNumber?: string | null;
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  } | null;
  fcmTokens?: string[] | null; // For Firebase Cloud Messaging (legacy)
  oneSignalSubscriptionIds?: string[] | null; // For OneSignal push notifications
  isAdmin?: boolean | null;
  isVendor?: boolean | null;
  // Add other profile-specific fields
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload extends Partial<Omit<UserProfile, 'userId' | 'email' | 'createdAt' | 'updatedAt'>> {}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'event_invite' | 'event_update' | 'rsvp_update' | 'new_message' | 'task_assigned' | 'system_alert' | 'friend_request' | 'generic' | 'team_member_added' | 'family_tree_update' | 'team_task_update' | 'vendor_booking' | 'vendor_confirmation' | 'vendor_quote' | 'vendor_review' | 'budget_item_added' | 'payment_made' | 'budget_milestone' | 'rsvp_received' | 'guest_milestone' | 'dietary_preference' | 'schedule_added' | 'schedule_conflict' | 'schedule_reminder' | 'idea_submitted' | 'idea_popular' | 'idea_comment' | 'website_published' | 'website_updated' | 'website_stats' | 'event_countdown' | 'planning_progress' | 'vendor_suggestion' | 'theme_recommendation' | 'task_reminder' | 'customer_request' | 'request_status_changed';
  title: string;
  message: string;
  referenceId?: string; // e.g., eventId, messageId, taskId
  isRead: boolean;
  createdAt: string; // ISO 8601
  link?: string; // Optional deep link into the app
}
export interface MarkNotificationReadPayload {
  notificationId: string; // or string[] for bulk update
}
export interface MarkAllNotificationsReadPayload {
  userId: string;
}


// Subscription Plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // monthly price in cents
  yearlyPrice?: number; // yearly price in cents (optional — if null, monthly only)
  currency: string;
  interval?: 'month' | 'year';
  features: string[];
  metadata?: { color?: string; accentColor?: string; [key: string]: any; };
  isCurrentPlan?: boolean;
  trialDays?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CheckoutSessionRequest {
  planId: string;
  interval: 'month' | 'year';
  couponCode?: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId?: string;
}

export interface CouponValidationRequest {
  code: string;
  planId: string;
  interval: 'month' | 'year';
}

export interface CouponValidationResponse {
  valid: boolean;
  discountType?: 'percentage' | 'fixed_amount';
  discountValue?: number;
  description?: string;
  message?: string;
}

export interface CancelSubscriptionRequest {
  userId: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message?: string;
}

export interface AppFeature {
  id?: string;
  key: string;
  name: string;
  description?: string;
  planIds: string[];
  isActive: boolean;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'trialing' | 'past_due' | 'canceled';
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  nextBillingDate?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paystackCustomerCode?: string;
  paystackSubscriptionCode?: string;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}
export interface ChangeSubscriptionPayload {
  newPlanId: string;
  paymentMethodId?: string; // If needed for immediate charge or new payment method
}
export interface CancelSubscriptionPayload {
  reason?: string;
  cancelAtPeriodEnd: boolean; // true to cancel at end of current billing, false for immediate (if allowed)
}


// User Settings
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string; // e.g., 'en', 'es', 'fr'
  emailNotifications: {
    eventInvites: boolean;
    eventUpdates: boolean;
    messageAlerts: boolean;
    newsletter: boolean;
  };
  pushNotifications: {
    eventInvites: boolean;
    eventUpdates: boolean;
    messageAlerts: boolean;
    taskAlerts: boolean;
  };
  eventVisibility: {
    showAllPublicEvents: boolean; // If true, show all public events; if false, show only user's events (invited/organizer)
  };
  // Add other user-configurable settings
  updatedAt: string;
}
export interface UpdateUserSettingsPayload extends Partial<Omit<UserSettings, 'userId' | 'updatedAt'>> {}
