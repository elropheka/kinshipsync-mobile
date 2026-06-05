import React from 'react';
import { Stack } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';

export default function ThemeLayout() {
  const { currentColors } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        ...HeaderTheme.lightOptions(currentColors),
      }}
    >
      <Stack.Screen
        name="createTheme"
        options={{
          title: 'Create Theme',
        }}
      />
    </Stack>
  );
}
