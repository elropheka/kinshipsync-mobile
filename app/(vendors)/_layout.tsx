import { Stack } from 'expo-router';
import React from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';

function VendorsStack() {
  const { currentColors } = useAppTheme();

  return (
    <>
      <ColoredHeaderStatusBar backgroundColor={currentColors.accent} contentStyle="light" />
      <Stack
        screenOptions={{
          headerShown: true,
          presentation: 'card',
          ...HeaderTheme.accentOptions(currentColors),
        }}
      >
        <Stack.Screen
          name="all/index"
          options={{
            title: 'All Vendors',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="selection/index"
          options={{
            title: 'Select Vendor',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: 'Vendor Details',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="category/[name]"
          options={{
            title: 'Vendor Category',
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}

export default function VendorsLayout() {
  return <VendorsStack />;
}
