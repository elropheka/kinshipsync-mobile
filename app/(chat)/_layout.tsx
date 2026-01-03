import { Stack } from 'expo-router';
import React from 'react';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/AppThemeContext';

export default function ChatLayout() {
  const { currentColors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        headerBackVisible: false,
         headerStyle: {
                  backgroundColor: currentColors.backgroundPrimary,
                },
      }}
    >
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerStyle: {
            backgroundColor: Colors.brown,
          },
          headerTintColor: currentColors.text,
        }}
      />
      <Stack.Screen
        name="chatArea"
        options={{
          title: 'Chat',
          headerStyle: {
            backgroundColor: Colors.brown,
          },
          headerTintColor: currentColors.text,
        }}
      />
    </Stack>
  );
}
