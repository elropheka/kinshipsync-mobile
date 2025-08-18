import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({ children }) => {
  const { isTablet, isLandscape, screenWidth } = useResponsiveLayout();

  // Use side navigation for tablets in landscape or large screens
  const useSideNavigation = isTablet && (isLandscape || screenWidth >= 1024);

  if (useSideNavigation) {
    return (
      <View style={styles.sideNavContainer}>
        <View style={styles.sidebar}>
          {/* Side navigation placeholder */}
          <View style={styles.sidebarContent}>
            <View style={styles.sidebarItem}>
              <View style={styles.sidebarIcon} />
              <View style={styles.sidebarText} />
            </View>
            <View style={styles.sidebarItem}>
              <View style={styles.sidebarIcon} />
              <View style={styles.sidebarText} />
            </View>
            <View style={styles.sidebarItem}>
              <View style={styles.sidebarIcon} />
              <View style={styles.sidebarText} />
            </View>
          </View>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Use bottom navigation for phones and tablets in portrait
  return (
    <View style={styles.bottomNavContainer}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.bottomNav}>
        {/* Bottom navigation placeholder */}
        <View style={styles.bottomNavContent}>
          <View style={styles.bottomNavItem}>
            <View style={styles.bottomNavIcon} />
            <View style={styles.bottomNavText} />
          </View>
          <View style={styles.bottomNavItem}>
            <View style={styles.bottomNavIcon} />
            <View style={styles.bottomNavText} />
          </View>
          <View style={styles.bottomNavItem}>
            <View style={styles.bottomNavIcon} />
            <View style={styles.bottomNavText} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sideNavContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  sidebarContent: {
    padding: 16,
    gap: 16,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sidebarIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
  },
  sidebarText: {
    width: 80,
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  bottomNavContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomNavItem: {
    alignItems: 'center',
    gap: 4,
  },
  bottomNavIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
  },
  bottomNavText: {
    width: 40,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});
