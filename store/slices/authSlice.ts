import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { auth as firebaseAuth } from '../../services/firebaseConfig';
import { signOut as firebaseSignOut } from 'firebase/auth';
import {
  AuthState,
  BackendUser,
} from '../../types/auth';
import { RootState } from '../rootReducer'; 

const TOKEN_KEY = 'authToken';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: RootState }
>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      if (firebaseAuth.currentUser) {
        await firebaseSignOut(firebaseAuth);
      }
      Toast.show({ type: 'info', text1: 'Logged Out', text2: 'You have been logged out.', position: 'bottom' });
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
        ) {
          userHasChanged = false;
        }
      } else if (!oldUser && !newUser) {
        userHasChanged = false;
      }


      if (userHasChanged) {
        state.user = newUser;
      }
      if (oldToken !== newToken) {
        state.token = newToken;
      }
      
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

    },
    setAuthIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setAuthIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      if (action.payload) state.isLoading = false;
    },
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message || 'Logout failed';
    });
  },
});

export const {
  setAuthUserAndToken,
  clearAuthData,
  setAuthIsLoading,
  setAuthError,
  setAuthIsInitialized,
  resetAuthState,
} = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthInitialized = (state: RootState) => state.auth.isInitialized;

export default authSlice.reducer;
