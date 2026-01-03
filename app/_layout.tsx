import React, { useEffect, useState, useCallback } from "react";
import { View, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppThemeProvider, useAppTheme } from "@/context/AppThemeContext";
import { AlertProvider } from "@/context/AlertContext";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/store';
import AppCoreNav from "@/components/common/Navigation/AppCoreNav";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Colors } from "@/constants/Colors";
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { setMessagingApiToken } from '@/services/messagingService';
import { OneSignal, LogLevel } from 'react-native-onesignal';

SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  const { currentColors } = useAppTheme();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-BlackItalic': require('../assets/fonts/Poppins-BlackItalic.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-BoldItalic': require('../assets/fonts/Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraBoldItalic': require('../assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraLightItalic': require('../assets/fonts/Poppins-ExtraLightItalic.ttf'),
    'Poppins-Italic': require('../assets/fonts/Poppins-Italic.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-LightItalic': require('../assets/fonts/Poppins-LightItalic.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-MediumItalic': require('../assets/fonts/Poppins-MediumItalic.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-SemiBoldItalic': require('../assets/fonts/Poppins-SemiBoldItalic.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Poppins-ThinItalic': require('../assets/fonts/Poppins-ThinItalic.ttf'),
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize OneSignal SDK
        try {
          // Enable verbose logging for debugging (only in development)
          if (__DEV__) {
            OneSignal.Debug.setLogLevel(LogLevel.Verbose);
          }
          // Initialize with your OneSignal App ID
          OneSignal.initialize('8d7630da-1b46-425d-a912-c9002e7c79a4');
          console.log('✅ OneSignal SDK initialized');
          
          // Request push notification permissions
          // Check if we can request permission (hasn't been prompted before)
          const canRequest = await OneSignal.Notifications.canRequestPermission();
          if (canRequest) {
            const permissionGranted = await OneSignal.Notifications.requestPermission(false);
            if (permissionGranted) {
              console.log('✅ Push notification permission granted');
            } else {
              console.log('ℹ️ Push notification permission denied');
            }
          } else {
            // Permission was already requested, check current status
            const hasPermission = await OneSignal.Notifications.getPermissionAsync();
            if (hasPermission) {
              console.log('✅ Push notification permission already granted');
            } else {
              console.log('ℹ️ Push notification permission was previously denied');
            }
          }
        } catch (oneSignalError) {
          console.warn('⚠️ Error initializing OneSignal SDK:', oneSignalError);
          // Don't block app startup if OneSignal initialization fails
        }

        // Initialize messaging API token from environment or app config
        try {
          const tokenFromEnv = typeof process !== 'undefined' && process.env?.MESSAGING_API_TOKEN;
          const tokenFromConfig = Constants.expoConfig?.extra?.messagingApiToken;
          
          // Use token from environment first, then from app.json config
          const messagingToken = tokenFromEnv || tokenFromConfig;
          
          if (messagingToken && messagingToken !== 'null' && messagingToken !== 'undefined') {
            await setMessagingApiToken(messagingToken);
            console.log('✅ Messaging API token initialized from environment/config');
          } else {
            console.log('ℹ️ Messaging API token not found in environment/config. It can be set at runtime using setMessagingApiToken().');
          }
        } catch (tokenError) {
          console.warn('⚠️ Error initializing messaging API token:', tokenError);
          // Don't block app startup if token initialization fails
        }

        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
          }
        }
        
        if (fontsLoaded || fontError) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn("Error during app preparation:", e);
        setAppIsReady(true); 
      }
    }
    prepare();
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
   
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: currentColors.backgroundSecondary }} onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={currentColors.backgroundSecondary}
        />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ErrorBoundary>
          <ReduxProvider store={store}>
            <AuthProvider>
              <AppThemeProvider>
                <SidebarProvider>
                  <ThemeProvider>
                    <AlertProvider>
                    {/* <ResponsiveContainer> */}
                      <AppCoreNav />
                      {/* </ResponsiveContainer> */}
                    </AlertProvider>
                  </ThemeProvider>
                </SidebarProvider>
              </AppThemeProvider>
            </AuthProvider>
          </ReduxProvider>
          </ErrorBoundary>
        </GestureHandlerRootView>
      </View>
    </SafeAreaProvider>
  );
};

export default RootLayout;
