import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { alertService } from '../services/alertService';
import { useAppAuth } from '@/hooks/useAppAuth';
import { LoginCredentials, SignupCredentials, BackendUser } from '../types/auth';
import { getAuthErrorMessageWithContext } from '@/utils/authErrorUtils';
import { exchangeFirebaseTokenForBackendJWT } from '../services/authService';
import { 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithCredential, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User as FirebaseUserT
} from 'firebase/auth';
import { auth as firebaseAppAuth, firestore as clientFirestore } from '@/services/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleSignin, statusCodes, User as GoogleUser } from '@react-native-google-signin/google-signin';
import { uploadUserAvatar } from '@/services/storageService';

import {
  setAuthUserAndToken,
  clearAuthData,
  setAuthIsLoading,
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
  let timeoutId: NodeJS.Timeout;
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
  signInWithApple: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    token, 
    isLoading: isAuthLoading, 
    error: authError,
    isInitialized: isAuthInitialized, 
         
  } = useAppAuth();
  const dispatch = useDispatch(); 


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '433750501084-trq5r04hpjv03s5u56ce3fqpsa64nuqu.apps.googleusercontent.com', 
      iosClientId: '433750501084-425hb71ogrc7p04p7cujs0t2qct3igkj.apps.googleusercontent.com', 
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
         
          const profileSnap = await fetchWithTimeout(getDoc(profileDocRef)); 
          if (profileSnap.exists()) {
            userProfileData = profileSnap.data();
            console.log('[AuthContext] Profile data found:', userProfileData);
          } else {
            console.warn(`[AuthContext] Profile not found for UID: ${firebaseUser.uid}. This might be an issue if profile creation is expected.`);

          }
        } catch (error) {
          console.error("[AuthContext] Error fetching profile (or timeout) during onAuthStateChanged:", error);
      
        }
        
        try {
          console.log('[AuthContext] Attempting to map Firebase user to BackendUser.');
         
          appUser = mapFirebaseUserToBackendUser(firebaseUser, userProfileData);
          console.log('[AuthContext] Mapped appUser:', appUser);
        } catch (error) {
          console.error('[AuthContext] Error in mapFirebaseUserToBackendUser:', error);
      
        }

        try {
          console.log('[AuthContext] Attempting to get ID token.');
          idToken = await firebaseUser.getIdToken();
          console.log('[AuthContext] ID token obtained:', idToken ? 'Exists (not logging full token)' : 'null');
        } catch (error) {
          console.error('[AuthContext] Error getting ID token:', error);

        }


        if (appUser && idToken) {
          try {
            console.log('[AuthContext] Exchanging Firebase token for backend JWT.');

            // Exchange Firebase token for backend JWT
            const { backendToken, backendUser } = await exchangeFirebaseTokenForBackendJWT(
              idToken,
              {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: appUser.displayName,
                emailVerified: firebaseUser.emailVerified
              }
            );

            console.log('[AuthContext] Backend JWT obtained, storing token.');

            // Store BACKEND token (not Firebase token)
            await SecureStore.setItemAsync(TOKEN_KEY, backendToken);
            console.log('[AuthContext] Backend token stored in SecureStore.');

            // Update Redux with backend user data
            dispatch(setAuthUserAndToken({
              user: {
                ...appUser,
                id: backendUser.id, // Add backend user ID
              },
              token: backendToken
            }));

            console.log('[AuthContext] Dispatched backend user and token to Redux.');
          } catch (error) {
            console.error('[AuthContext] Error exchanging token:', error);
            // Fallback to Firebase token if backend is unavailable
            console.warn('[AuthContext] Falling back to Firebase token.');
            try {
              await SecureStore.setItemAsync(TOKEN_KEY, idToken);
              dispatch(setAuthUserAndToken({ user: appUser, token: idToken }));
            } catch (fallbackError) {
              console.error('[AuthContext] Fallback also failed:', fallbackError);
              await SecureStore.deleteItemAsync(TOKEN_KEY).catch(e => console.error('[AuthContext] Failed to clear token on error:', e));
              dispatch(clearAuthData());
            }
          }
        } else {

          console.warn('[AuthContext] Critical failure: appUser could not be mapped or idToken is null. Clearing auth data.');
          console.log('[AuthContext] Details: appUser is null?', !appUser, 'idToken is null?', !idToken);
          await SecureStore.deleteItemAsync(TOKEN_KEY).catch(e => console.error('[AuthContext] Failed to clear token on critical failure:', e));
          dispatch(clearAuthData());
        }
      } else {
    
        console.log('[AuthContext] No Firebase user. Clearing auth data.');
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(e => console.error('[AuthContext] Failed to clear token on sign out:', e));
        dispatch(clearAuthData());
      }
      

      if (!isAuthInitialized) {
        console.log('[AuthContext] Dispatching setAuthIsInitialized(true). Current isAuthInitialized (from Redux):', isAuthInitialized);
        dispatch(setAuthIsInitialized(true));
      }
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from onAuthStateChanged.');
      unsubscribe();
    };
  }, [dispatch, isAuthInitialized]); 

  const handleSignIn = useCallback(async (credentials: LoginCredentials) => {
    dispatch(setAuthIsLoading(true));
    try {
     
      await signInWithEmailAndPassword(firebaseAppAuth, credentials.email, credentials.pass);
     
      router.replace('/(main)/home'); 

    } catch (err: any) {
      console.error('AuthContext: Sign in failed', err);
      const errorMessage = getAuthErrorMessageWithContext(err, 'signIn');
      alertService.showAlert('error', 'Sign In Failed', errorMessage);
    } finally {
      dispatch(setAuthIsLoading(false));
    }
  }, [dispatch]);

  const handleSignUp = useCallback(async (credentials: SignupCredentials) => {
    dispatch(setAuthIsLoading(true));
    try {
      // Client-side Firebase user creation
      const userCredential = await createUserWithEmailAndPassword(firebaseAppAuth, credentials.email, credentials.pass);
      const newUserUid = userCredential.user.uid;

      let avatarUrl: string | undefined = undefined;
      if (credentials.avatarUri) {
        try {
         
          const uploadResult = await uploadUserAvatar(credentials.avatarUri, newUserUid);
          avatarUrl = uploadResult.avatarUrl;
        } catch (uploadError) {
          console.error("AuthContext: Failed to upload avatar during signup", uploadError);
          
        }
      }

  
      const profileData: any = { 
        first_name: credentials.first_name,
        last_name: credentials.last_name,
        userId: newUserUid,
        role: 'organizer', 
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

   
      if (credentials.phone) {
        profileData.phone = credentials.phone;
      }
      if (credentials.location) {
        profileData.location = credentials.location;
      }

      if (avatarUrl) {
        profileData.avatarUrl = avatarUrl;
      }

      await setDoc(doc(clientFirestore, "profiles", newUserUid), profileData);
      
      router.replace('/(main)/home');
    } catch (err: any) {
      console.error('AuthContext: Sign up failed', err);
      const errorMessage = getAuthErrorMessageWithContext(err, 'signUp');
      alertService.showAlert('error', 'Sign Up Failed', errorMessage);
    } finally {
      dispatch(setAuthIsLoading(false));
    }
  }, [dispatch]);

  const handleSignOut = useCallback(async () => {
    dispatch(setAuthIsLoading(true));
    try {
      await firebaseAppAuth.signOut();
      router.replace('/(auth)/signIn');
    } catch (err: any) {
      console.error('AuthContext: Sign out failed', err);
      const errorMessage = getAuthErrorMessageWithContext(err, 'signOut');
      alertService.showAlert('error', 'Sign Out Failed', errorMessage);
    } finally {
      dispatch(setAuthIsLoading(false));
    }
  }, [dispatch]);

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
        const errorMessage = 'Google Sign-In failed to return an ID token.';
        alertService.showAlert('error', 'Google Sign-In Failed', errorMessage);
        return;
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
        alertService.showAlert('error', 'Google Sign-In Failed', 'No user returned from Firebase after Google Sign-In');
        return;
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) console.log('Google Sign-In cancelled');
      else if (error.code === statusCodes.IN_PROGRESS) console.log('Google Sign-In in progress');
      else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) console.error('Google Play services not available');
      else console.error('AuthContext: Google Sign-In failed', error);
      const errorMessage = getAuthErrorMessageWithContext(error, 'general');
      alertService.showAlert('error', 'Google Sign-In Failed', errorMessage);
    } finally {
      dispatch(setAuthIsLoading(false));
    }
  }, [dispatch]);
  
  const handleSignInWithApple = useCallback(async () => {
    dispatch(setAuthIsLoading(true));
    try {
      // Check if we're on iOS
      if (Platform.OS !== 'ios') {
        alertService.showAlert('error', 'Apple Sign-In Failed', 'Apple Sign In is only available on iOS devices');
        return;
      }

     
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        alertService.showAlert('error', 'Apple Sign-In Failed', 'Apple Authentication is not available on this device');
        return;
      }

   
      const appleAuthResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('Apple Sign-In result:', appleAuthResponse);

      if (!appleAuthResponse.identityToken) {
        alertService.showAlert('error', 'Apple Sign-In Failed', 'Apple Sign-In failed to return an identity token.');
        return;
      }

      // Create OAuth provider credential for Firebase
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleAuthResponse.identityToken,
        rawNonce: appleAuthResponse.authorizationCode as string,
      });

     
      const userCredential = await signInWithCredential(firebaseAppAuth, credential);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
    
        const profileDocRef = doc(clientFirestore, "profiles", firebaseUser.uid);
        const profileSnap = await getDoc(profileDocRef);
        
        if (!profileSnap.exists()) {
    
          const newProfileData = {
            first_name: appleAuthResponse.fullName?.givenName || firebaseUser.displayName?.split(' ')[0] || '',
            last_name: appleAuthResponse.fullName?.familyName || firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
            phone: firebaseUser.phoneNumber || '',
            location: '',
            userId: firebaseUser.uid,
            role: 'organizer',
            email: appleAuthResponse.email || firebaseUser.email,
            avatarUrl: firebaseUser.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          await setDoc(profileDocRef, newProfileData);
        }
        
        router.replace('/(main)/home');
      } else {
        alertService.showAlert('error', 'Apple Sign-In Failed', 'No user returned from Firebase after Apple Sign-In');
        return;
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        console.log('Apple Sign-In cancelled by user');
        // Don't show error for cancelled
        return;
      } else {
        console.error('AuthContext: Apple Sign-In failed', error);
        const errorMessage = getAuthErrorMessageWithContext(error, 'general');
        alertService.showAlert('error', 'Apple Sign-In Failed', errorMessage);
      }
    } finally {
      dispatch(setAuthIsLoading(false));
    }
  }, [dispatch ]);
  
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
    signInWithApple: handleSignInWithApple,
  }), [
    token, 
    isAuthInitialized, 
    isAuthLoading, 
    user, 
    authError, 
    handleSignIn, 
    handleSignOut, 
    handleSignUp, 
    handleSignInWithGoogle,
    handleSignInWithApple
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
