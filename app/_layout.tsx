import React, { useEffect, useState, useCallback } from "react";
import { View, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/store';
import AppCoreNav from "@/components/common/Navigation/AppCoreNav";
// import { ResponsiveContainer } from "@/components/common/Layout/ResponsiveContainer";
import * as SplashScreen from 'expo-splash-screen'; 
import { useFonts } from 'expo-font'; 
import { Colors } from "@/constants/Colors";
import * as Updates from 'expo-updates';

SplashScreen.preventAutoHideAsync();

const RootLayout: React.FC = () => {
  
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
        // Check for updates in production
        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            // Optionally reload the app to use the new update
            // Uncomment the next line if you want automatic reload
            // await Updates.reloadAsync();
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
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: Colors.light.backgroundSecondary }} onLayout={onLayoutRootView}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
        <ReduxProvider store={store}>
          <AuthProvider>
            <SidebarProvider>
              <ThemeProvider>
                {/* <ResponsiveContainer> */}
                  <AppCoreNav />
                {/* </ResponsiveContainer> */}
              </ThemeProvider>
            </SidebarProvider>
          </AuthProvider>
        </ReduxProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </View>
  );
};

export default RootLayout;
