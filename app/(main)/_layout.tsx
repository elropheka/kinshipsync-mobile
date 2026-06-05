import { Tabs } from 'expo-router';
import React from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import { HeaderTheme } from '@/components/common/Navigation/HeaderTheme';

function MainTabsLayout() {
  const { currentColors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        ...HeaderTheme.tabAccentOptions(currentColors),
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications', headerShown: true }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: true }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', headerShown: true }} />
      <Tabs.Screen name="teams" options={{ title: 'Teams', headerShown: true }} />
    </Tabs>
  );
}

export default MainTabsLayout;

export { useScrollHandler } from '@/context/ScrollNavContext';
