import axiosInstance from './axiosInstance';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {
  // LoginCredentials, // No longer used
  // LoginResponse, // No longer used
  // SignupCredentials, // No longer used
  // SignupResponse, // No longer used
  GetUserProfileResponse,
  // FirebaseSocialAuthPayload, // No longer used
  // FirebaseSocialAuthResponse, // No longer used
} from '../types/auth';
import { auth as firebaseAuth } from './firebaseConfig'; // Ensure firebaseConfig exports auth
import { getAuthErrorMessageWithContext } from '../utils/authErrorUtils';

const API_URL = '/auth'; // Base path for auth endpoints (if still used for other things)

/**
 * Registers a new user with email and password. (No longer used by primary mobile flow)
 */
// export const signup = async (credentials: SignupCredentials): Promise<SignupResponse> => {
//   const { pass, ...rest } = credentials;
//   const payload = { ...rest, password: pass };
//   const response = await axiosInstance.post<SignupResponse>(`${API_URL}/signup`, payload);
//   return response.data;
// };

/**
 * Logs in a user with email and password. (No longer used by primary mobile flow)
 */
// export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
//   const payload = { email: credentials.email, password: credentials.pass };
//   const response = await axiosInstance.post<LoginResponse>(`${API_URL}/login`, payload);
//   return response.data;
// };

/**
 * Fetches the current user's profile.
 * Token is expected to be added by the axios interceptor.
 */
export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const response = await axiosInstance.get<GetUserProfileResponse>(`${API_URL}/user`);
  return response.data;
};

/**
 * Authenticates a user with a Firebase ID token obtained from Google Sign-In. (No longer used by primary mobile flow)
 */
// export const authenticateWithGoogle = async (
//   payload: FirebaseSocialAuthPayload
// ): Promise<FirebaseSocialAuthResponse> => {
//   const response = await axiosInstance.post<FirebaseSocialAuthResponse>(`${API_URL}/google`, payload);
//   return response.data;
// };

/**
 * Authenticates a user with a Firebase ID token obtained from Apple Sign-In. (No longer used by primary mobile flow)
 */
// export const authenticateWithApple = async (
//   payload: FirebaseSocialAuthPayload
// ): Promise<FirebaseSocialAuthResponse> => {
//   const response = await axiosInstance.post<FirebaseSocialAuthResponse>(`${API_URL}/apple`, payload);
//   return response.data;
// };

// Optional: If your backend has an explicit logout endpoint
/**
 * Logs out the user from the backend session.
 */
// export const logoutFromBackend = async (): Promise<void> => {
//   await axiosInstance.post(`${API_URL}/logout`);
// };

/**
 * Sends a password reset email to the given email address using Firebase.
 * @param email The user's email address.
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // Use enhanced error handling for user-friendly messages
    const errorMessage = getAuthErrorMessageWithContext(error, 'passwordReset');
    throw new Error(errorMessage);
  }
};

const authService = {
  // signup, // Removed
  // login, // Removed
  getUserProfile, // Kept
  sendPasswordReset, // Added
  // authenticateWithGoogle, // Removed
  // authenticateWithApple, // Removed
  // logoutFromBackend, // Uncomment if used
};

export default authService;
