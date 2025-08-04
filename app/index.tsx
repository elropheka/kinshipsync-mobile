import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import SplashScreen from './(auth)/splashScreen';
import LandingScreen from './(auth)/landingScreen';

const AppRootIndex: React.FC = () => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!isInitialized) {
    return <LandingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(main)/home" />;
  } else {
    return <Redirect href="/(auth)/landingScreen" />;
  }
};

export default AppRootIndex;
