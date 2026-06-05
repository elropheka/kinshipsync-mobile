/**
 * Utilities for handling event website URLs in the mobile application
 */

/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

/**
 * Validates a custom URL slug
 * @param slug The slug to validate
 * @returns true if the slug is valid, false otherwise
 */
export const isValidSlug = (slug: string): boolean => {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with a hyphen
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Gets the full URL for an event website
 * @param customUrlSlug The custom URL slug for the event website
 * @returns The complete URL for the event website
 */
export const getEventWebsiteUrl = (customUrlSlug: string): string => {
  // Use the same base URL as the web client for consistency
  const baseUrl = 'https://kinshipsync.com';
  return `${baseUrl}/events/site/${customUrlSlug}`;
};

const createShortHash = (eventId?: string): string => {
  if (eventId) {
    return eventId.replace(/-/g, '').slice(0, 6).toLowerCase();
  }
  return Math.random().toString(16).slice(2, 8);
};

/**
 * Generates a default website slug from the event name plus a short hash for uniqueness.
 */
export const generateEventWebsiteSlug = (eventName: string, eventId?: string): string => {
  const baseSlug = generateSlug(eventName);
  if (!baseSlug) {
    return `event-${createShortHash(eventId)}`;
  }
  return `${baseSlug}-${createShortHash(eventId)}`;
};

/**
 * Appends numeric suffixes when a slug candidate is already taken.
 */
export const withSlugCollisionSuffix = (slug: string, attempt: number): string => {
  if (attempt <= 1) {
    return slug;
  }
  return `${slug}-${attempt}`;
};
