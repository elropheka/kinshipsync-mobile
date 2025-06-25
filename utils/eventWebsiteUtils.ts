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

/**
 * Suggests a URL slug based on the event name and date
 * @param eventName The name of the event
 * @param eventDate The date of the event (ISO string)
 * @returns A suggested URL slug
 */
export const suggestEventSlug = (eventName: string, eventDate: string): string => {
  const date = new Date(eventDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Generate a base slug from the event name
  const baseSlug = generateSlug(eventName);
  
  // Append the year and month
  return `${baseSlug}-${year}-${month}`;
};
