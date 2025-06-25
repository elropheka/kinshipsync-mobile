import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors'; // Adjusted path
import BackButton from '@/components/common/Navigation/BackButton';

export default function ThemeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.backgroundPrimary,
        },
        headerLeft: () => <BackButton />, // Custom back button
        headerTintColor: Colors.light.primary,
        headerTitleStyle: {
          // fontFamily: 'Poppins-Medium', // Example if you have a specific font for headers
        },
        
      }}
    >
      <Stack.Screen
        name="createTheme"
        options={{
          title: 'Create Theme', // You can customize the title
          // headerBackVisible: true, // This is true by default if there's a screen to go back to
        }}
      />
    </Stack>
  );
}
