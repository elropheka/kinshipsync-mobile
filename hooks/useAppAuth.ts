import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  // performDirectSignup, // Removed
  // performDirectLogin, // Removed
  // performFakeDirectLogin, // Removed
  // performFakeDirectSignup, // Removed
  // performGoogleLogin, // Removed
  // performAppleLogin, // Removed
  // initializeAppAuth, // Removed
  logoutUser, // Kept
  selectCurrentUser,
  selectAuthToken,
  selectAuthIsLoading,
  selectAuthError,
  selectIsAuthInitialized,
} from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../types/redux'; // Or from '../store/store'
// import { LoginCredentials, SignupCredentials } from '../types/auth'; // No longer needed here

export const useAppAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const token = useSelector((state: RootState) => selectAuthToken(state));
  const isLoading = useSelector((state: RootState) => selectAuthIsLoading(state));
  const error = useSelector((state: RootState) => selectAuthError(state));
  const isInitialized = useSelector((state: RootState) => selectIsAuthInitialized(state));

  // directSignup, directLogin, googleLogin, appleLogin, initializeAuth are removed
  // as their logic is now primarily in AuthContext.tsx and uses Firebase SDK directly.
  // The onAuthStateChanged listener in AuthContext updates the Redux state.

  const logout = useCallback(() => {
    // This still dispatches the logoutUser thunk from authSlice.ts
    // AuthContext.handleSignOut calls firebaseAppAuth.signOut()
    // onAuthStateChanged then updates the state.
    // The logoutUser thunk can handle additional cleanup like SecureStore.
    return dispatch(logoutUser()).unwrap();
  }, [dispatch]);

  return {
    user,
    token,
    isLoading,
    error,
    isInitialized,
    // directSignup, // Removed
    // directLogin, // Removed
    // fakeDirectLogin, // Removed
    // fakeDirectSignup, // Removed
    // googleLogin, // Removed
    // appleLogin, // Removed
    // initializeAuth, // Removed
    logout, // Kept
  };
};
