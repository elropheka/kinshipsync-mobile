import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
// import authService from '../../services/authService'; // No longer used for primary auth thunks
import { auth as firebaseAuth } from '../../services/firebaseConfig'; // Firebase auth instance
import { signOut as firebaseSignOut } from 'firebase/auth'; // Specific import for signOut
import {
  AuthState,
  BackendUser,
  // LoginCredentials, // No longer needed for thunks here
  // SignupCredentials, // No longer needed for thunks here
  // FirebaseSocialAuthResponse, // No longer needed for thunks here
} from '../../types/auth';
import { RootState } from '../rootReducer'; 

const TOKEN_KEY = 'authToken';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isInitialized: false, // Will be set to true by onAuthStateChanged via a reducer
};

// Async Thunk for logout - still useful to group signout logic
export const logoutUser = createAsyncThunk<
  void, // Return type on success (void for logout)
  void, // Argument type (void for logout)
  { rejectValue: string; state: RootState }
>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Sign out from Firebase (onAuthStateChanged will handle state update)
      // The actual firebaseSignOut is now called from AuthContext.handleSignOut
      // This thunk can be simplified or just ensure SecureStore is cleared.
      // For now, let's assume AuthContext handles firebaseSignOut() and this thunk ensures store cleanup.
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      // If firebaseAuth.currentUser exists, it means onAuthStateChanged might not have fired yet
      // or this is an explicit logout call. AuthContext should call firebaseSignOut.
      if (firebaseAuth.currentUser) {
         // This is redundant if AuthContext calls it, but safe.
         // Consider removing if AuthContext is the sole caller of firebaseAppAuth.signOut()
        await firebaseSignOut(firebaseAuth);
      }
      Toast.show({ type: 'info', text1: 'Logged Out', text2: 'You have been logged out.', position: 'bottom' });
      // The actual state clearing (user, token to null) will be done by a reducer
      // triggered by onAuthStateChanged or a dedicated logout action.
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      Toast.show({ type: 'error', text1: 'Logout Error', text2: errorMessage, position: 'bottom' });
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUserAndToken: (state, action: PayloadAction<{ user: BackendUser; token: string }>) => {
      const newUser = action.payload.user;
      const oldUser = state.user;
      const newToken = action.payload.token;
      const oldToken = state.token;

      let userHasChanged = true;
      if (oldUser && newUser) {
        if (
          oldUser.uid === newUser.uid &&
          oldUser.displayName === newUser.displayName &&
          oldUser.email === newUser.email &&
          oldUser.photoURL === newUser.photoURL &&
          oldUser.emailVerified === newUser.emailVerified 
          // Add other fields if they are critical for re-render decisions
        ) {
          userHasChanged = false;
        }
      } else if (!oldUser && !newUser) { // Both null
        userHasChanged = false;
      }


      if (userHasChanged) {
        state.user = newUser;
      }
      if (oldToken !== newToken) {
        state.token = newToken;
      }
      
      // Only update if there was a change in user or token, or if it's the initial set
      if (userHasChanged || oldToken !== newToken) {
        state.isLoading = false;
        state.error = null;
      }
    },
    clearAuthData: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      // isInitialized remains true after initial load
    },
    setAuthIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false; // Typically stop loading on error
    },
    setAuthIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      if (action.payload) state.isLoading = false; // Stop loading if we just initialized
    },
    resetAuthState: () => initialState, // Kept for manual reset if ever needed
  },
  extraReducers: (builder) => {
    // Handle logoutUser thunk states if needed, though onAuthStateChanged is primary
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true; // Indicate logout is in progress
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      // State is already cleared by clearAuthData via onAuthStateChanged
      // This just marks the thunk as done.
      state.isLoading = false;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message || 'Logout failed';
    });
    // Other thunks (performDirectSignup, performDirectLogin, performGoogleLogin, initializeAppAuth)
    // are removed as their core logic is now in AuthContext and state updates are via onAuthStateChanged
    // and direct reducer calls.
  },
});

// Export new actions
export const {
  setAuthUserAndToken,
  clearAuthData,
  setAuthIsLoading,
  setAuthError,
  setAuthIsInitialized,
  resetAuthState,
} = authSlice.actions;

// Selectors remain the same
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthInitialized = (state: RootState) => state.auth.isInitialized;

export default authSlice.reducer;
