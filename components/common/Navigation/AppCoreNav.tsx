import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import SidebarComponent from './sideBar';
import * as Font from 'expo-font';
import * as notificationService from '@/services/notificationService';

import Toast from 'react-native-toast-message'; 
import { Colors } from "@/constants/Colors";


export default function AppCoreNav() {
  const { isAuthenticated,  user: authUser } = useAuth();
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const [fontError, setFontError] = useState<Error | null>(null);

  const handleCloseSidebar = () => toggleSidebar();


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
    
      } catch (error) {
        setFontError(error instanceof Error ? error : new Error('Unknown font loading error'));
       
      }
    }
    loadFonts();
    return () => cleanupNotificationHandlers();
  }, []);


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
  }, [authUser, isAuthenticated]);

 

  if (fontError) {
    console.warn('Proceeding despite font error:', fontError.message);
  }


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
