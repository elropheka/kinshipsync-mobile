import { formatDistanceToNow, parseISO } from 'date-fns';

export const formatTimeToNow = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    // Fallback to original string or a generic message
    return dateString; 
  }
};
