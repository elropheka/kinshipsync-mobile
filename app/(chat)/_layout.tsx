import { Stack } from 'expo-router';
import React from 'react';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '@/constants/Colors';

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        headerBackVisible: false,
         headerStyle: {
                  backgroundColor: Colors.light.backgroundPrimary,
                },
      }}
    >
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen
        name="chatArea"
        options={{
          title: 'Chat',
        }}
      />
    </Stack>
  );
}
