import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import BackButton from '@/components/common/Navigation/BackButton';
import { Colors } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/context/AppThemeContext';

function VendorsStack() {
  const { currentColors } = useAppTheme();
  return (
    <>
    <StatusBar
            backgroundColor={Platform.OS === 'android' ? currentColors.backgroundSecondary : undefined}
            style="dark"
            translucent={Platform.OS === 'android' ? false : undefined}
          />
      <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        headerTitleStyle: {
          fontFamily: 'Poppins',
        },
         headerStyle: {
                  backgroundColor: currentColors.accent,
                },
        headerBackVisible: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen 
        name="all/index"
        options={{
          title: "All Vendors",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="selection/index"
        options={{
          title: "Select Vendor",
          headerShown: true, 
        }}
      />
      <Stack.Screen 
        name="details/[id]"
        options={{
          title: "Vendor Details",
          headerShown: true, 
        }}
      />
      <Stack.Screen 
        name="category/[name]"
        options={{
          title: "Vendor Category",
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
