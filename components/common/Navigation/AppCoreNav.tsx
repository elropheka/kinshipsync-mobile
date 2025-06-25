import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { useSidebar } from "../../../context/SidebarContext";
import SidebarComponent from './sideBar'; // Assuming sideBar.tsx is in the same directory
import * as Font from 'expo-font';
import * as notificationService from '../../../services/notificationService';
import LoadingScreen from "../LoadingScreen"; // Assuming LoadingScreen is in components/common/
import Toast from 'react-native-toast-message'; // Added Toast import
import { Colors } from "@/constants/Colors";

// Combined component for core app logic: Auth, Navigation, Font Loading, Sidebar
export default function AppCoreNav() {
  const { isAuthenticated, isLoading: authIsLoading, user: authUser } = useAuth();
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  const handleCloseSidebar = () => toggleSidebar();

  // Font loading and notification initialization
  useEffect(() => {
    const cleanupNotificationHandlers = notificationService.initializeNotificationHandlers();
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Poppins-Light': require('../../../assets/fonts/Poppins-Light.ttf'),
          'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
          'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        setFontError(error instanceof Error ? error : new Error('Unknown font loading error'));
        setFontsLoaded(true); // Proceed even if fonts fail
      }
    }
    loadFonts();
    return () => cleanupNotificationHandlers();
  }, []);

  // Notification registration
  useEffect(() => {
    const registerForPushNotifications = async () => {
      const permissionGranted = await notificationService.requestNotificationPermissions();
      if (permissionGranted && authUser?.uid && isAuthenticated) {
        const token = await notificationService.getPushToken();
        if (token) {
          await notificationService.saveFcmTokenToProfile(isAuthenticated, authUser.uid, token);
        }
      }
    };
    if (authUser?.uid && isAuthenticated) {
      registerForPushNotifications();
    }
  }, [authUser]);

  if (!fontsLoaded || authIsLoading) {
    return <LoadingScreen />;
  }

  if (fontError) {
    console.warn('Proceeding despite font error:', fontError.message);
  }

  // Main navigation stack
  const navigator = (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleStyle: { fontFamily: 'Poppins-Regular' },
        gestureEnabled: process.env.NODE_ENV === 'development',
        contentStyle: { backgroundColor: Colors.light.backgroundPrimary },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
      ) : (
        <>
          <Stack.Screen name="(main)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(events)" options={{ gestureEnabled: true }} />
          <Stack.Screen name="(vendors)" options={{ gestureEnabled: true }} />
          <Stack.Screen name="(chat)" options={{ gestureEnabled: true }} />
        </>
      )}
    </Stack>
  );

  return (
    <>
      {navigator}
      <SidebarComponent isVisible={isSidebarVisible} onClose={handleCloseSidebar} />
      <Toast />
    </>
  );
}
