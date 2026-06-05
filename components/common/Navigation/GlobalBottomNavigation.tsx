import React from 'react';
import { Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useScrollHandler } from '@/context/ScrollNavContext';
import { shouldShowBottomNav } from '@/utils/bottomNavVisibility';
import BottomNavigation from './bottomNavigation';

export class GlobalBottomNavigation extends React.Component {
  public render(): React.ReactNode {
    return <GlobalBottomNavigationInner />;
  }
}

const GlobalBottomNavigationInner: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const { isNavVisible } = useScrollHandler();

  if (!isAuthenticated || Platform.OS === 'web') {
    return null;
  }

  if (!shouldShowBottomNav(pathname)) {
    return null;
  }

  return <BottomNavigation isVisible={isNavVisible} />;
};

export default GlobalBottomNavigation;
