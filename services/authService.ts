import axiosInstance from './axiosInstance';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import {
  GetUserProfileResponse,
} from '../types/auth';
import { auth as firebaseAuth } from './firebaseConfig';
import { getAuthErrorMessageWithContext } from '../utils/authErrorUtils';

const API_URL = '/auth';

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const response = await axiosInstance.get<GetUserProfileResponse>(`${API_URL}/user`);
  return response.data;
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    const errorMessage = getAuthErrorMessageWithContext(error, 'passwordReset');
    throw new Error(errorMessage);
  }
};

export const exchangeFirebaseTokenForBackendJWT = async (
  firebaseToken: string,
  userData: {
    uid: string;
    email: string;
    displayName?: string;
    emailVerified: boolean;
  }
) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/firebase/exchange-token`, {
      firebaseToken,
      userData
    });

    return {
      backendToken: response.data.data.token,
      backendUser: response.data.data.user
    };
  } catch (error) {
    console.error('Failed to exchange Firebase token:', error);
    throw error;
  }
};

const authService = {
  getUserProfile,
  sendPasswordReset,
  exchangeFirebaseTokenForBackendJWT,
};

export default authService;
