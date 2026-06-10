export const Features = {
  unlimitedEvents: 'unlimited_events',
  eventWebsite: 'event_website',
  customEventPages: 'custom_event_pages',
  guestManagement: 'guest_management',
  notifications: 'notifications',
  basicAnalytics: 'basic_analytics',
  vendorAccess: 'vendor_access',
  prioritySupport: 'priority_support',
  advancedAnalytics: 'advanced_analytics',
  customThemes: 'custom_themes',
  teamCollaboration: 'team_collaboration',
  exportReports: 'export_reports',
} as const;

export type FeatureKey = (typeof Features)[keyof typeof Features];

export const FeatureDetails: Record<FeatureKey, { label: string; description: string }> = {
  [Features.unlimitedEvents]: { label: 'Unlimited Events', description: 'Create and manage unlimited events' },
  [Features.eventWebsite]: { label: 'Event Website', description: 'Create a dedicated website for your event' },
  [Features.customEventPages]: { label: 'Custom Event Pages', description: 'Customize your event pages with themes and branding' },
  [Features.guestManagement]: { label: 'Guest Management', description: 'Manage guests, RSVPs, and seating' },
  [Features.notifications]: { label: 'Email & Push Notifications', description: 'Send email and push notifications to guests' },
  [Features.basicAnalytics]: { label: 'Basic Analytics', description: 'View event attendance and engagement metrics' },
  [Features.vendorAccess]: { label: 'Vendor Directory Access', description: 'Browse and connect with vendors' },
  [Features.prioritySupport]: { label: 'Priority Support', description: 'Get priority customer support' },
  [Features.advancedAnalytics]: { label: 'Advanced Analytics', description: 'Detailed analytics with export capabilities' },
  [Features.customThemes]: { label: 'Custom Themes', description: 'Create and apply custom themes to events' },
  [Features.teamCollaboration]: { label: 'Team Collaboration', description: 'Invite team members to manage events together' },
  [Features.exportReports]: { label: 'Export & Reporting', description: 'Export event data and generate reports' },
};
