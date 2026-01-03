import { Colors } from '../constants/Colors';

const AVATAR_COLORS = [
  Colors.light.primary,
  Colors.light.accent,
  Colors.light.secondary,
  Colors.light.success,
  Colors.light.warning,
  Colors.light.info,
  Colors.light.primaryLight,
  Colors.light.secondaryLight,
  Colors.light.tertiary,
  Colors.light.grey,
];

/**
 * Generate initials from a display name
 * @param name - The display name to generate initials from
 * @returns Up to 2 uppercase initials
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '?';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    // Single name - take first 2 characters
    return parts[0].substring(0, 2).toUpperCase();
  } else {
    // Multiple names - take first character of first two parts
    const first = parts[0][0] || '';
    const second = parts[1][0] || '';
    return (first + second).toUpperCase();
  }
}

/**
 * Generate a consistent color based on the name
 * Uses a simple hash function to ensure same names always get the same color
 * @param name - The name to generate color for
 * @returns A color from the avatar colors palette
 */
export function getAvatarColor(name: string): string {
  if (!name || typeof name !== 'string') return Colors.light.primary;

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}
