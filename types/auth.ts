// Types for your backend's user object
interface UserMetadata {
  lastSignInTime?: string;
  creationTime?: string;
  lastRefreshTime?: string; // Note: This was in your example, might be specific
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
  tokensValidAfterTime?: string; // Note: This was in your example
  providerData?: UserProviderData[];
  // Add any other fields your backend user object might have, e.g., name, photoURL
  displayName?: string;
  photoURL?: string;
}

// API Request/Response Types
export interface LoginCredentials {
  email: string;
  pass: string;
}

export interface SignupCredentials {
  email: string;
  pass: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  avatarUri?: string | null; // Added optional avatarUri
}

export interface LoginResponse {
  token: string;
}

export interface SignupResponse {
  uid: string; 
  token: string; // Custom Firebase token
}

export interface GetUserProfileResponse {
  user: BackendUser;
}

export interface FirebaseSocialAuthPayload {
  firebaseIdToken: string;
}

export interface FirebaseSocialAuthResponse {
  token: string;
  user?: BackendUser; // User might be returned directly, or need a separate fetch
}

// Redux Auth Slice State
export interface AuthState {
  user: BackendUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // To track if initial auth check (e.g., from SecureStore) is done
}
