import React from 'react';
import { Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useScrollHandler } from '@/context/ScrollNavContext';
import { shouldShowBottomNav, shouldShowVendorFab } from '@/utils/bottomNavVisibility';
import { useCurrentUser } from '@/hooks/useUser';
import BottomNavigation from './bottomNavigation';
import VendorFAB from '@/components/vendors/VendorFAB';

export class GlobalBottomNavigation extends React.Component {
  public render(): React.ReactNode {
    return <GlobalBottomNavigationInner />;
  }
}

const GlobalBottomNavigationInner: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { profile } = useCurrentUser();
  const pathname = usePathname();
  const { isNavVisible } = useScrollHandler();

  if (!isAuthenticated || Platform.OS === 'web') {
    return null;
  }

  if (!shouldShowBottomNav(pathname)) {
    return null;
  }

  const isVendor = profile?.isVendor === true;
  const showVendorFab = isVendor && shouldShowVendorFab(pathname);

  return (
    <>
      <BottomNavigation isVisible={isNavVisible} />
      {showVendorFab && <VendorFAB isVisible={isNavVisible} />}
    </>
  );
};

export default GlobalBottomNavigation;
