import { Stack } from 'expo-router';
import React from 'react';
import BackButton from '@/components/common/Navigation/BackButton'; // Import BackButton
import { Colors } from '@/constants/Colors'; // Import Colors for styling

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // Show header by default
        headerLeft: () => <BackButton />, // Use BackButton component
        headerBackVisible: false, // We are using a custom back button
         headerStyle: {
                  backgroundColor: Colors.light.backgroundPrimary,
                },
      }}
    >
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
          // You might want to show the header for the messages list
          // headerShown: true, // Inherits true from screenOptions
        }}
      />
      <Stack.Screen
        name="chatArea"
        options={{
          title: 'Chat',
          // Header for chatArea could be dynamic (e.g., contact name)
          // headerShown: true, // Inherits true from screenOptions
        }}
      />
    </Stack>
  );
}
