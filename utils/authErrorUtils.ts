/**
 * Utility functions for handling authentication errors and converting them to user-friendly messages
 */

/**
 * Extracts a user-friendly error message from Firebase authentication errors
 * @param error - The error object from Firebase Auth
 * @param defaultMessage - Fallback message if error cannot be parsed
 * @returns A user-friendly error message
 */
export const getAuthErrorMessage = (error: any, defaultMessage: string = 'An unexpected error occurred. Please try again.'): string => {
  if (!error) {
    return defaultMessage;
  }

  // Handle Firebase error codes
  if (error.code) {
    const errorCode = error.code.toLowerCase();
    
    switch (errorCode) {
      // Sign Up Errors
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please sign in instead or use a different email.';
      
      case 'auth/invalid-email':
        return 'The email address you entered is invalid. Please check and try again.';
      
      case 'auth/operation-not-allowed':
        return 'Email/password authentication is not enabled. Please contact support.';
      
      case 'auth/weak-password':
        return 'Your password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
      
      // Sign In Errors
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support for assistance.';
      
      case 'auth/user-not-found':
        return 'No account found with this email address. Please check your email or sign up for a new account.';
      
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or use "Forgot Password" to reset it.';
      
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      
      // Network Errors
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later or reset your password.';
      
      // Password Reset Errors
      case 'auth/invalid-email':
        return 'The email address you entered is invalid. Please check and try again.';
      
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      
      // Social Auth Errors
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      
      case 'auth/cancelled-popup-request':
        return 'Only one popup at a time is allowed. Please try again.';
      
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups and try again.';
      
      // Apple Sign-In Errors
      case 'err_canceled':
        return 'Sign-in was cancelled. Please try again.';
      
      case 'auth/apple-signin-config-error':
        return 'Apple Sign-In configuration error. Please try again or use another sign-in method.';
      
      // Google Sign-In Errors
      case 'status_codes.sign_in_cancelled':
        return 'Google Sign-In was cancelled. Please try again.';
      
      case 'status_codes.in_progress':
        return 'Google Sign-In is already in progress. Please wait.';
      
      case 'status_codes.play_services_not_available':
        return 'Google Play Services is not available. Please update your Google Play Services.';
      
      // General Errors
      case 'auth/internal-error':
        return 'An internal error occurred. Please try again.';
      
      case 'auth/quota-exceeded':
        return 'Service temporarily unavailable. Please try again later.';
      
      case 'auth/unavailable':
        return 'Service is temporarily unavailable. Please try again later.';
      
      default:
        // Try to extract message from error.message if available
        if (error.message) {
          return error.message;
        }
        return defaultMessage;
    }
  }

  // Handle error objects with message property
  if (error.message) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return defaultMessage;
};

/**
 * Gets a user-friendly error message specifically for Firebase authentication
 * with context-aware messages (sign in vs sign up)
 */
export const getAuthErrorMessageWithContext = (
  error: any,
  context: 'signIn' | 'signUp' | 'signOut' | 'passwordReset' | 'general' = 'general'
): string => {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  if (error.code) {
    const errorCode = error.code.toLowerCase();
    
    // Context-specific messages for better UX
    if (context === 'signUp') {
      switch (errorCode) {
        case 'auth/email-already-in-use':
          return 'An account with this email already exists. Please sign in instead.';
        case 'auth/weak-password':
          return 'Please create a stronger password (at least 6 characters).';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
      }
    }
    
    if (context === 'signIn') {
      switch (errorCode) {
        case 'auth/user-not-found':
          return 'No account found with this email. Please sign up for a new account.';
        case 'auth/wrong-password':
          return 'Incorrect password. Try again or reset your password.';
        case 'auth/invalid-credential':
          return 'Invalid email or password. Please check and try again.';
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
      }
    }
  }

  // Fallback to general error message handler
  return getAuthErrorMessage(error);
};

