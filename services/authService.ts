import { sendPasswordResetEmail } from 'firebase/auth';
import { auth as firebaseAuth } from './firebaseConfig';
import { getAuthErrorMessageWithContext } from '../utils/authErrorUtils';

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    const errorMessage = getAuthErrorMessageWithContext(error, 'passwordReset');
    throw new Error(errorMessage);
  }
};

const authService = {
  sendPasswordReset,
};

export default authService;
