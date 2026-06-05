import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { useAppTheme } from "@/context/AppThemeContext";
import SidebarComponent from './sideBar';
import * as Font from 'expo-font';
import * as notificationService from '@/services/notificationService';
import { OneSignal } from 'react-native-onesignal';

import Toast from 'react-native-toast-message';
import { GlobalBottomNavigation } from './GlobalBottomNavigation';
import { ScrollNavProvider } from '@/context/ScrollNavContext';


export default function AppCoreNav() {
  const { isAuthenticated,  user: authUser } = useAuth();
  const { isSidebarVisible, toggleSidebar } = useSidebar();
  const { currentColors } = useAppTheme();
  const [fontError, setFontError] = useState<Error | null>(null);

  const handleCloseSidebar = () => toggleSidebar();


  useEffect(() => {
    const cleanupNotificationHandlers = notificationService.initializeNotificationHandlers();
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Inter-Light': require('../../../assets/fonts/Inter_18pt-Light.ttf'),
          'Inter-Regular': require('../../../assets/fonts/Inter_18pt-Regular.ttf'),
          'Inter-Medium': require('../../../assets/fonts/Inter_18pt-Medium.ttf'),
          'Inter-SemiBold': require('../../../assets/fonts/Inter_18pt-SemiBold.ttf'),
          'Inter-Bold': require('../../../assets/fonts/Inter_18pt-Bold.ttf'),
          'Inter-ExtraBold': require('../../../assets/fonts/Inter_18pt-ExtraBold.ttf'),
        });
    
      } catch (error) {
        setFontError(error instanceof Error ? error : new Error('Unknown font loading error'));
       
      }
    }
    loadFonts();
    return () => cleanupNotificationHandlers();
  }, []);


  useEffect(() => {
    const registerForOneSignal = async () => {
      if (!authUser?.uid || !isAuthenticated) {
        return;
      }

      try {
        // Check if user has permission
        const hasPermission = await OneSignal.Notifications.getPermissionAsync();
        
        if (hasPermission) {
          // Get OneSignal subscription ID
          const subscriptionId = await notificationService.getOneSignalSubscriptionId();
          
          if (subscriptionId) {
            // Save to Firestore
            await notificationService.saveOneSignalSubscriptionIdToProfile(
              isAuthenticated,
              authUser.uid,
              subscriptionId
            );
            console.log('✅ OneSignal subscription registered for user:', authUser.uid);
          } else {
            console.warn('⚠️ OneSignal subscription ID not available yet');
          }
        } else {
          console.log('ℹ️ Push notification permission not granted yet');
        }
      } catch (error) {
        console.error('❌ Error registering OneSignal subscription:', error);
      }
    };

    // Register OneSignal subscription when user is authenticated
    if (authUser?.uid && isAuthenticated) {
      registerForOneSignal();
    }
  }, [authUser, isAuthenticated]);

  // Listen for OneSignal subscription changes
  useEffect(() => {
    if (!authUser?.uid || !isAuthenticated) {
      return;
    }

    const handleSubscriptionChange = async (event: { previous: { id?: string; token?: string; optedIn: boolean }; current: { id?: string; token?: string; optedIn: boolean } }) => {
      console.log('🔄 OneSignal subscription changed:', event);
      const subscriptionId = event.current.id;
      
      if (subscriptionId) {
        try {
          await notificationService.saveOneSignalSubscriptionIdToProfile(
            isAuthenticated,
            authUser.uid,
            subscriptionId
          );
          console.log('✅ OneSignal subscription ID updated in Firestore');
        } catch (error) {
          console.error('❌ Error updating OneSignal subscription ID:', error);
        }
      }
    };

    OneSignal.User.pushSubscription.addEventListener('change', handleSubscriptionChange);

    return () => {
      OneSignal.User.pushSubscription.removeEventListener('change', handleSubscriptionChange);
    };
  }, [authUser, isAuthenticated]);

 

  if (fontError) {
    console.warn('Proceeding despite font error:', fontError.message);
  }


  const navigator = (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleStyle: { fontFamily: 'Inter-Regular' },
        gestureEnabled: process.env.NODE_ENV === 'development',
        contentStyle: { backgroundColor: currentColors.backgroundPrimary },
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
          <Stack.Screen name="(teams)" options={{ gestureEnabled: true }} />
          <Stack.Screen name="themes" options={{ gestureEnabled: true }} />
        </>
      )}
    </Stack>
  );

  const shell = (
    <>
      {navigator}
      <GlobalBottomNavigation />
      <SidebarComponent isVisible={isSidebarVisible} onClose={handleCloseSidebar} />
      <Toast />
    </>
  );

  return isAuthenticated ? <ScrollNavProvider>{shell}</ScrollNavProvider> : shell;
}
