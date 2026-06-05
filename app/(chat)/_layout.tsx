import { Stack } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';
import ColoredHeaderStatusBar from '@/components/common/Navigation/ColoredHeaderStatusBar';

export default function ChatLayout() {
  const { currentColors } = useAppTheme();

  return (
    <>
      <ColoredHeaderStatusBar backgroundColor={Colors.brown} contentStyle="light" />
      <Stack
        screenOptions={{
          headerShown: true,
          ...HeaderTheme.lightOptions(currentColors),
        }}
      >
        <Stack.Screen
          name="messages"
          options={{
            title: 'Messages',
            ...HeaderTheme.rustOptions(currentColors),
          }}
        />
        <Stack.Screen
          name="chatArea"
          options={{
            title: 'Chat',
            ...HeaderTheme.rustOptions(currentColors),
          }}
        />
      </Stack>
    </>
  );
}
