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
      <Tabs.Screen name="notifications" options={{ title: 'Notifications', ...HeaderTheme.tabPushedScreenOptions(currentColors) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: true }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', ...HeaderTheme.tabPushedScreenOptions(currentColors) }} />
      <Tabs.Screen name="teams" options={{ title: 'Teams', ...HeaderTheme.tabPushedScreenOptions(currentColors) }} />
      <Tabs.Screen
        name="subscriptionPlans"
        options={{ title: 'Subscription Plans', ...HeaderTheme.tabPushedScreenOptions(currentColors) }}
      />
      <Tabs.Screen
        name="deleteAccount"
        options={{ title: 'Delete Account', ...HeaderTheme.tabPushedScreenOptions(currentColors, '/settings') }}
      />
    </Tabs>
  );
}

export default MainTabsLayout;

export { useScrollHandler } from '@/context/ScrollNavContext';
