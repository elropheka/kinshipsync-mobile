import { Stack } from 'expo-router';
import React from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';
import { StackBackButton } from '@/components/common/Navigation/StackBackButton';

function chatPushedScreenOptions(title: string): NativeStackNavigationOptions {
  return {
    title,
    headerLeft: () => <StackBackButton fallbackRoute="/messages" />,
    headerBackVisible: false,
  };
}

export default function ChatLayout() {
  const { currentColors } = useAppTheme();

  return (
    <>
      <ColoredHeaderStatusBar backgroundColor={Colors.brown} contentStyle="light" />
      <Stack
        screenOptions={{
          headerShown: true,
          ...HeaderTheme.rustSurfaceOptions(currentColors),
        }}
      >
        <Stack.Screen
          name="messages"
          options={{
            title: 'Messages',
            headerLeft: () => <StackBackButton />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen name="chatArea" options={chatPushedScreenOptions('Chat')} />
        <Stack.Screen name="newChat" options={chatPushedScreenOptions('New Chat')} />
        <Stack.Screen
          name="conversationSettings"
          options={chatPushedScreenOptions('Conversation Settings')}
        />
      </Stack>
    </>
  );
}
