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
import { FontAssets } from '@/constants/fontAssets';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { setMessagingApiToken } from '@/services/messagingService';
import { OneSignal, LogLevel } from 'react-native-onesignal';

SplashScreen.preventAutoHideAsync();

const AppShell: React.FC<{ onLayoutRootView: () => void }> = ({ onLayoutRootView }) => {
  const { currentColors } = useAppTheme();

  return (
    <View
      style={{ flex: 1, width: '100%', height: '100%', backgroundColor: currentColors.backgroundSecondary }}
      onLayout={onLayoutRootView}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={currentColors.backgroundSecondary}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <SidebarProvider>
            <ThemeProvider>
              <AlertProvider>
                <AppCoreNav />
              </AlertProvider>
            </ThemeProvider>
          </SidebarProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </View>
  );
};

const ThemedApp: React.FC<{ onLayoutRootView: () => void }> = ({ onLayoutRootView }) => (
  <ReduxProvider store={store}>
    <AuthProvider>
      <AppThemeProvider>
        <AppShell onLayoutRootView={onLayoutRootView} />
      </AppThemeProvider>
    </AuthProvider>
  </ReduxProvider>
);

const RootLayout: React.FC = () => {
  const [fontsLoaded, fontError] = useFonts(FontAssets.interFontMap);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        try {
          if (__DEV__) {
            OneSignal.Debug.setLogLevel(LogLevel.Verbose);
          }
          OneSignal.initialize('8d7630da-1b46-425d-a912-c9002e7c79a4');
          console.log('✅ OneSignal SDK initialized');

          const canRequest = await OneSignal.Notifications.canRequestPermission();
          if (canRequest) {
            const permissionGranted = await OneSignal.Notifications.requestPermission(false);
            if (permissionGranted) {
              console.log('✅ Push notification permission granted');
            } else {
              console.log('ℹ️ Push notification permission denied');
            }
          } else {
            const hasPermission = await OneSignal.Notifications.getPermissionAsync();
            if (hasPermission) {
              console.log('✅ Push notification permission already granted');
            } else {
              console.log('ℹ️ Push notification permission was previously denied');
            }
          }
        } catch (oneSignalError) {
          console.warn('⚠️ Error initializing OneSignal SDK:', oneSignalError);
        }

        try {
          const tokenFromEnv = typeof process !== 'undefined' && process.env?.MESSAGING_API_TOKEN;
          const tokenFromConfig = Constants.expoConfig?.extra?.messagingApiToken;
          const messagingToken = tokenFromEnv || tokenFromConfig;

          if (messagingToken && messagingToken !== 'null' && messagingToken !== 'undefined') {
            await setMessagingApiToken(messagingToken);
            console.log('✅ Messaging API token initialized from environment/config');
          } else {
            console.log('ℹ️ Messaging API token not found in environment/config. It can be set at runtime using setMessagingApiToken().');
          }
        } catch (tokenError) {
          console.warn('⚠️ Error initializing messaging API token:', tokenError);
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
      <ThemedApp onLayoutRootView={onLayoutRootView} />
    </SafeAreaProvider>
  );
};

export default RootLayout;
