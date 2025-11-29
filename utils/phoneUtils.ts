/**
 * Phone number utility functions for formatting and validation
 */

/**
 * Validates if a phone number is in E.164 format
 * E.164 format: +[country code][number] (e.g., +1234567890)
 * @param phoneNumber - Phone number to validate
 * @returns true if valid E.164 format, false otherwise
 */
export const isValidE164Format = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  // E.164 format: + followed by 1-15 digits, starting with 1-9
  return /^\+[1-9]\d{1,14}$/.test(phoneNumber);
};

/**
 * Formats a phone number to E.164 format
 * Attempts to convert various phone number formats to E.164
 * @param phoneNumber - Phone number in any format
 * @param countryCode - Default country code (e.g., '1' for US/Canada)
 * @returns Formatted phone number in E.164 format, or null if invalid
 */
export const formatToE164 = (phoneNumber: string, countryCode: string = '1'): string | null => {
  if (!phoneNumber) return null;

  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // If it already starts with +, validate it
  if (cleaned.startsWith('+')) {
    if (isValidE164Format(cleaned)) {
      return cleaned;
    }
    return null;
  }

  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, '');

  // If it starts with country code, add +
  if (cleaned.startsWith(countryCode)) {
    return `+${cleaned}`;
  }

  // Otherwise, prepend + and country code
  return `+${countryCode}${cleaned}`;
};

/**
 * Extracts the country code from an E.164 formatted phone number
 * @param phoneNumber - Phone number in E.164 format
 * @returns Country code or null if invalid
 */
export const extractCountryCode = (phoneNumber: string): string | null => {
  if (!isValidE164Format(phoneNumber)) return null;
  
  // E.164 format: +[country code][number]
  // Country codes can be 1-3 digits
  const match = phoneNumber.match(/^\+\d{1,3}/);
  return match ? match[0].substring(1) : null;
};

/**
 * Formats a phone number for display
 * @param phoneNumber - Phone number in E.164 format
 * @param format - Display format ('national' | 'international')
 * @returns Formatted phone number string
 */
export const formatForDisplay = (phoneNumber: string, format: 'national' | 'international' = 'international'): string => {
  if (!isValidE164Format(phoneNumber)) return phoneNumber;

  if (format === 'international') {
    return phoneNumber;
  }

  // For national format, remove country code and +, add formatting
  // This is a simple implementation - can be enhanced based on country
  const withoutPlus = phoneNumber.substring(1);
  const countryCode = extractCountryCode(phoneNumber);
  
  if (countryCode && withoutPlus.startsWith(countryCode)) {
    const nationalNumber = withoutPlus.substring(countryCode.length);
    // Simple formatting: (XXX) XXX-XXXX for US numbers
    if (countryCode === '1' && nationalNumber.length === 10) {
      return `(${nationalNumber.substring(0, 3)}) ${nationalNumber.substring(3, 6)}-${nationalNumber.substring(6)}`;
    }
    return nationalNumber;
  }

  return phoneNumber;
};




