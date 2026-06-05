import { Stack, router } from 'expo-router';
import React from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';

function chatPushedScreenOptions(
  title: string,
  tintColor: string,
): NativeStackNavigationOptions {
  return {
    title,
    ...HeaderButtonItems.headerLeftBackOptions(tintColor, 'onRust', '/messages'),
  };
}

export default function ChatLayout() {
  const { currentColors } = useAppTheme();
  const tintColor = currentColors.accentContrastText;

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
            ...HeaderButtonItems.headerLeftBackOptions(tintColor, 'onRust', '/home'),
            ...HeaderButtonItems.headerRightIconOptions({
              label: 'New chat',
              sfSymbol: 'square.and.pencil',
              ionicon: 'create-outline',
              onPress: () => router.push('/(chat)/newChat'),
              tintColor,
            }),
          }}
        />
        <Stack.Screen name="chatArea" options={chatPushedScreenOptions('Chat', tintColor)} />
        <Stack.Screen name="newChat" options={chatPushedScreenOptions('New Chat', tintColor)} />
        <Stack.Screen
          name="conversationSettings"
          options={chatPushedScreenOptions('Conversation Settings', tintColor)}
        />
      </Stack>
    </>
  );
}
