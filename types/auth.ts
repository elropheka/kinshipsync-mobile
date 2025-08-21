
interface UserMetadata {
  lastSignInTime?: string;
  creationTime?: string;
  lastRefreshTime?: string; 
}

interface UserProviderData {
  uid?: string;
  email?: string;
  providerId?: string;
}

export interface BackendUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  disabled?: boolean;
  metadata?: UserMetadata;
  tokensValidAfterTime?: string; 
  providerData?: UserProviderData[];
 
  displayName?: string;
  photoURL?: string;
}


export interface LoginCredentials {
  email: string;
  pass: string;
}

export interface SignupCredentials {
  email: string;
  pass: string;
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
  avatarUri?: string | null; 
}

export interface LoginResponse {
  token: string;
}

export interface SignupResponse {
  uid: string; 
  token: string; 
}

export interface GetUserProfileResponse {
  user: BackendUser;
}

export interface FirebaseSocialAuthPayload {
  firebaseIdToken: string;
}

export interface FirebaseSocialAuthResponse {
  token: string;
  user?: BackendUser; 
}


export interface AuthState {
  user: BackendUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; 
}
