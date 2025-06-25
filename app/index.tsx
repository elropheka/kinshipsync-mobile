import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import SplashScreen from './(auth)/splashScreen';
import LandingScreen from './(auth)/landingScreen';

const AppRootIndex: React.FC = () => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  if (isLoading) {
    // Show a loading screen while auth state is being determined.
    // This ensures that we wait for the onAuthStateChanged listener in AuthProvider
    // to complete its initial check.
    return <SplashScreen />;
  }

  if (!isInitialized) {
    // If the auth state is not initialized yet, we can also show a loading screen.
    // This is useful if you have some async initialization logic in your AuthProvider.
    return <LandingScreen />;
  }

  if (isAuthenticated) {
    // User is authenticated, redirect to the main app area.
    // Assuming '/(main)/home' is your primary screen for authenticated users.
    // Expo Router will look for app/(main)/home.tsx or app/(main)/index.tsx in the (main) group.
    return <Redirect href="/(main)/home" />;
  } else {
    // User is not authenticated, redirect to the landing screen within the auth flow.
    // Expo Router will look for app/(auth)/landingScreen.tsx in the (auth) group.
    return <Redirect href="/(auth)/landingScreen" />;
  }
};

export default AppRootIndex;
