import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAppTheme } from '@/context/AppThemeContext';
import BackButton from '@/components/common/Navigation/BackButton';

export default function ThemeLayout() {
  const { currentColors } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: currentColors.backgroundPrimary,
        },
        headerLeft: () => <BackButton />,
        headerTintColor: currentColors.primary,
        headerTitleStyle: {
        },
        
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
