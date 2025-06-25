import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native'; // Added Platform import
import BackButton from '@/components/common/Navigation/BackButton'; // Import BackButton
import { Colors } from '@/constants/Colors'; // Import Colors for styling
import { StatusBar } from 'expo-status-bar';


// Inner component to handle auth and Stack setup
function VendorsStack() {


  return (
    <>
    <StatusBar 
            backgroundColor={Platform.OS === 'android' ? Colors.light.backgroundPrimary : undefined} 
            style={Platform.OS === 'ios' ? 'dark' : 'auto'}
            translucent={Platform.OS === 'android' ? false : undefined} // On Android, false makes it a solid color bar
          />
      <Stack
      screenOptions={{
        headerShown: true, // Ensure header is shown by default
        headerLeft: () => <BackButton />, // Use BackButton component
        headerTitleStyle: {
          fontFamily: 'Poppins', // Ensure this font is loaded
        },
         headerStyle: {
                  backgroundColor: '#9AFFE1', // Updated to match StatusBar
                },
        headerBackVisible: false, // We are using a custom back button
        presentation: 'card',
      }}
    >
      <Stack.Screen 
        name="all/index"
        options={{
          title: "All Vendors",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="selection/index"
        options={{
          title: "Select Vendor",
          headerShown: true, 
        }}
      />
      <Stack.Screen 
        name="details/[id]"
        options={{
          title: "Vendor Details",
          headerShown: true, 
        }}
      />
      <Stack.Screen 
        name="category/[name]"
        options={{
          title: "Vendor Category",
          headerShown: true, 
        }}
      />
    </Stack>
    </>
  );
}

// Default export is now simpler
export default function VendorsLayout() {
  return <VendorsStack />;
}
