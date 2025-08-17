import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';
import BackButton from '@/components/common/Navigation/BackButton';

export default function ThemeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.backgroundPrimary,
        },
        headerLeft: () => <BackButton />,
        headerTintColor: Colors.light.primary,
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
