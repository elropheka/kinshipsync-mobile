import React, { createContext, useContext, useEffect, useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { useAppAuth } from '../hooks/useAppAuth';
import { LoginCredentials, SignupCredentials, LoginResponse, SignupResponse, BackendUser } from '../types/auth';
import { User as FirebaseUserT } from 'firebase/auth';

import { 
  GoogleAuthProvider, 
  getIdToken, 
  signInWithCredential, 
  signInWithCustomToken, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth as firebaseAppAuth, firestore as clientFirestore } from '../services/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleSignin, statusCodes, User as GoogleUser } from '@react-native-google-signin/google-signin';
import { uploadUserAvatar } from '../services/storageService';

import {
  setAuthUserAndToken,
  clearAuthData,
  setAuthIsLoading,
  setAuthError,
  setAuthIsInitialized,
} from '../store/slices/authSlice';

const TOKEN_KEY = 'authToken';

const mapFirebaseUserToBackendUser = (
  firebaseUser: FirebaseUserT, 
  profileData?: any
): BackendUser => {
  const displayNameFromProfile = profileData?.first_name && profileData?.last_name 
    ? `${profileData.first_name} ${profileData.last_name}` 
    : firebaseUser.displayName;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || undefined,
    emailVerified: firebaseUser.emailVerified,
    displayName: displayNameFromProfile || undefined,
    photoURL: firebaseUser.photoURL || profileData?.photoURL || undefined,
    metadata: { 
      creationTime: firebaseUser.metadata.creationTime,
      lastSignInTime: firebaseUser.metadata.lastSignInTime,
    },
  };
};

function fetchWithTimeout<TData>(promise: Promise<TData>, timeoutMs: number = 10000): Promise<TData> {
  let timeoutId: number;
  const timeoutPromise = new Promise<TData>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs} ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: ReturnType<typeof useAppAuth>['user'];
  error: ReturnType<typeof useAppAuth>['error'];

  signIn: (credentials: LoginCredentials) => Promise<any>;
  signUp: (credentials: SignupCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    token, // from Redux, drives isAuthenticated
    isLoading: isAuthLoading, // from Redux
    error: authError,
    isInitialized: isAuthInitialized, // From Redux
    // directLogin, // Will be replaced by handleSignIn
    // directSignup, // Will be replaced by handleSignUp
    // googleLogin, // No longer used from useAppAuth here
    // appleLogin, // Uncomment when implemented
    // initializeAuth, // Will be replaced by onAuthStateChanged effect
    logout,         // This thunk will be refactored in authSlice.ts
  } = useAppAuth();
  const dispatch = useDispatch(); // For dispatching authSliceActions

  // This useEffect sets up the onAuthStateChanged listener
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '433750501084-trq5r04hpjv03s5u56ce3fqpsa64nuqu.apps.googleusercontent.com', // Web client ID for Firebase
      iosClientId: '433750501084-425hb71ogrc7p04p7cujs0t2qct3igkj.apps.googleusercontent.com', // iOS client ID from GoogleService-Info.plist
      offlineAccess: true, 
    });

    const unsubscribe = onAuthStateChanged(firebaseAppAuth, async (firebaseUser) => {
      console.log('[AuthContext] onAuthStateChanged triggered. Firebase user:', firebaseUser ? firebaseUser.uid : 'null');
      if (firebaseUser) {
        let userProfileData: any = null;
        let idToken: string | null = null;
        let appUser: BackendUser | null = null;

        try {
          console.log('[AuthContext] Attempting to fetch profile for UID:', firebaseUser.uid);
          const profileDocRef = doc(clientFirestore, "profiles", firebaseUser.uid);
          // Wrap getDoc with fetchWithTimeout
          const profileSnap = await fetchWithTimeout(getDoc(profileDocRef)); 
          if (profileSnap.exists()) {
            userProfileData = profileSnap.data();
            console.log('[AuthContext] Profile data found:', userProfileData);
          } else {
            console.warn(`[AuthContext] Profile not found for UID: ${firebaseUser.uid}. This might be an issue if profile creation is expected.`);
            // If profile is critical and not found, could treat as an error or proceed with Firebase data only
          }
        } catch (error) {
          console.error("[AuthContext] Error fetching profile (or timeout) during onAuthStateChanged:", error);
          // If profile fetch fails, we can still proceed with Firebase user data.
          // The appUser will be mapped using firebaseUser only.
        }
        
        try {
          console.log('[AuthContext] Attempting to map Firebase user to BackendUser.');
          // Pass userProfileData (which might be null if fetch failed)
          appUser = mapFirebaseUserToBackendUser(firebaseUser, userProfileData);
          console.log('[AuthContext] Mapped appUser:', appUser);
        } catch (error) {
          console.error('[AuthContext] Error in mapFirebaseUserToBackendUser:', error);
          // If mapping fails, we might not be able to proceed with a valid appUser.
          // Consider clearing auth data or handling this as a critical error.
        }

        try {
          console.log('[AuthContext] Attempting to get ID token.');
          idToken = await firebaseUser.getIdToken(); // This can also fail
          console.log('[AuthContext] ID token obtained:', idToken ? 'Exists (not logging full token)' : 'null');
        } catch (error) {
          console.error('[AuthContext] Error getting ID token:', error);
          // If getting ID token fails, authentication cannot proceed.
        }

        // Proceed if we have at least the Firebase user mapped and an ID token
        if (appUser && idToken) {
          try {
            console.log('[AuthContext] Attempting to store token in SecureStore.');
            await SecureStore.setItemAsync(TOKEN_KEY, idToken);
            console.log('[AuthContext] Token stored in SecureStore.');
            console.log('[AuthContext] Dispatching setAuthUserAndToken with user:', appUser, 'and token:', idToken ? 'Exists' : 'null');
            dispatch(setAuthUserAndToken({ user: appUser, token: idToken }));
          } catch (error) {
            console.error('[AuthContext] Error storing token or dispatching setAuthUserAndToken:', error);
            await SecureStore.deleteItemAsync(TOKEN_KEY).catch(e => console.error('[AuthContext] Failed to clear token on error:', e));
            dispatch(clearAuthData()); // Clear auth data on critical error
          }
        } else {
          // This case means appUser mapping might have failed or idToken couldn't be retrieved.
          // This is a critical failure in the auth process.
          console.warn('[AuthContext] Critical failure: appUser could not be mapped or idToken is null. Clearing auth data.');
          console.log('[AuthContext] Details: appUser is null?', !appUser, 'idToken is null?', !idToken);
          await SecureStore.deleteItemAsync(TOKEN_KEY).catch(e => console.error('[AuthContext] Failed to clear token on critical failure:', e));
          dispatch(clearAuthData());
        }
      } else {
        // No Firebase user (signed out state)
        console.log('[AuthContext] No Firebase user. Clearing auth data.');
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(e => console.error('[AuthContext] Failed to clear token on sign out:', e));
        dispatch(clearAuthData());
      }
      
      // Always set isInitialized to true after the first auth state check completes,
      // regardless of whether a user is signed in or if there were non-critical errors (like profile fetch).
      if (!isAuthInitialized) {
        console.log('[AuthContext] Dispatching setAuthIsInitialized(true). Current isAuthInitialized (from Redux):', isAuthInitialized);
        dispatch(setAuthIsInitialized(true));
      }
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from onAuthStateChanged.');
      unsubscribe();
    };
  }, [dispatch, isAuthInitialized]); // Added isAuthInitialized to ensure effect runs if it changes externally, though typically it's set here.

  const handleSignIn = useCallback(async (credentials: LoginCredentials) => {
    dispatch(setAuthIsLoading(true));
    try {
      // Client-side Firebase sign-in
      await signInWithEmailAndPassword(firebaseAppAuth, credentials.email, credentials.pass);
      // onAuthStateChanged will handle Redux state update and navigation
      router.replace('/(main)/home'); // Removed for declarative navigation

    } catch (err: any) {
      console.error('AuthContext: Sign in failed', err);
      dispatch(setAuthError(err.message || 'Sign in failed'));
      router.replace('/(auth)/signIn');
      throw err;
    }
  }, [dispatch, router]);

  const handleSignUp = useCallback(async (credentials: SignupCredentials) => {
    dispatch(setAuthIsLoading(true));
    try {
      // Client-side Firebase user creation
      const userCredential = await createUserWithEmailAndPassword(firebaseAppAuth, credentials.email, credentials.pass);
      const newUserUid = userCredential.user.uid;

      let avatarUrl: string | undefined = undefined;
      if (credentials.avatarUri) {
        try {
          // Upload avatar if provided
          const uploadResult = await uploadUserAvatar(credentials.avatarUri, newUserUid);
          avatarUrl = uploadResult.avatarUrl;
        } catch (uploadError) {
          console.error("AuthContext: Failed to upload avatar during signup", uploadError);
          // Decide how to handle upload failure: proceed without avatar, show error, etc.
          // For now, we'll log and proceed without the avatar.
        }
      }

      // Create profile in Firestore
      const profileData: any = { // Use any for now, refine with a proper type later if needed
        first_name: credentials.first_name,
        last_name: credentials.last_name,
        phone: credentials.phone,
        location: credentials.location,
        userId: newUserUid,
        role: 'organizer', // Default role
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (avatarUrl) {
        profileData.avatarUrl = avatarUrl;
      }

      await setDoc(doc(clientFirestore, "profiles", newUserUid), profileData);
      
      router.replace('/(main)/home');
    } catch (err: any) {
      console.error('AuthContext: Sign up failed', err);
      dispatch(setAuthError(err.message || 'Sign up failed'));
      throw err;
    }
  }, [dispatch, router]);

  const handleSignOut = useCallback(async () => {
    dispatch(setAuthIsLoading(true));
    try {
      await firebaseAppAuth.signOut();
      router.replace('/(auth)/signIn');
    } catch (err: any) {
      console.error('AuthContext: Sign out failed', err);
      dispatch(setAuthError(err.message || 'Sign out failed'));
      throw err;
    }
  }, [dispatch, router]);

  const handleSignInWithGoogle = useCallback(async () => {
    dispatch(setAuthIsLoading(true));
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const googleSignInResponse = signInResult as unknown as {
        data: {
          idToken: string | null;
          scopes: string[];
          serverAuthCode: string;
          user: GoogleUser;
        };
        type: 'success';
      };

      console.log('Google Sign-In result:', googleSignInResponse);

      if (!googleSignInResponse || !googleSignInResponse.data.idToken) {
        router.replace('/(auth)/signIn');
        throw new Error('Google Sign-In failed to return an ID token.');
      }
      const googleCredential = GoogleAuthProvider.credential(googleSignInResponse.data.idToken);
      const userCredential = await signInWithCredential(firebaseAppAuth, googleCredential);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {

        const profileDocRef = doc(clientFirestore, "profiles", firebaseUser.uid);
        const profileSnap = await getDoc(profileDocRef);
        if (!profileSnap.exists()) {
          const nameParts = firebaseUser.displayName?.split(' ') || [];
          const newProfileData = {
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            phone: firebaseUser.phoneNumber || '',
            location: '',
            userId: firebaseUser.uid,
            role: 'organizer',
            email: firebaseUser.email,
            avatarUrl: firebaseUser.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          await setDoc(profileDocRef, newProfileData);
        }
        router.replace('/(main)/home');
      } else {
        router.replace('/(auth)/signIn');
        throw new Error('No user returned from Firebase after Google Sign-In');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) console.log('Google Sign-In cancelled');
      else if (error.code === statusCodes.IN_PROGRESS) console.log('Google Sign-In in progress');
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) console.error('Google Play services not available');
      else console.error('AuthContext: Google Sign-In failed', error);
      dispatch(setAuthError(error.message || 'Google Sign-In failed'));
      router.replace('/(auth)/signIn');
      throw error;
    }
  }, [dispatch, router]);
  
  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: !!user && !!token && isAuthInitialized,
    isLoading: isAuthLoading,
    isInitialized: isAuthInitialized,
    user,
    error: authError,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
  }), [
    token, 
    isAuthInitialized, 
    isAuthLoading, 
    user, 
    authError, 
    handleSignIn, 
    handleSignOut, 
    handleSignUp, 
    handleSignInWithGoogle
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
