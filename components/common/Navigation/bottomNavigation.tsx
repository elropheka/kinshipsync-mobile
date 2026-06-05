import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, Ionicons as SecondaryIcon } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@/context/AppThemeContext';
import { createBottomNavigationStyles } from '../../../styles/components/common/Navigation/bottomNavigation.styles';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const NAVBAR_HEIGHT = SCREEN_HEIGHT * 0.09;

interface CustomBottomNavigationProps extends BottomTabBarProps {
  isVisible: boolean;
}

const BottomNavigation: React.FC<CustomBottomNavigationProps> = (props) => {
  const { isVisible } = props;
  const { currentColors } = useAppTheme();
  const routeName = props.state?.routes?.[props.state?.index]?.name || 'home';
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  const navBarAnim = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createBottomNavigationStyles(currentColors), [currentColors]);

  const tabs = [
    { key: 'home', label: 'Home', icon: 'home', route: '/home' as const },
    { key: 'events', label: 'Events', icon: 'calendar', route: '/all' as const },
    { key: 'messages', label: 'Messages', icon: 'chatbubble-ellipses-outline', route: '/messages' as const },
    { key: 'profile', label: 'Profile', icon: 'person-outline', route: '/profile' as const },
  ];

  const isActive = (tabKey: string) => {
    if (tabKey === 'home') return routeName === 'home';
    if (tabKey === 'events') return routeName.includes('events') || routeName === 'all';
    if (tabKey === 'messages') return routeName === 'messages';
    if (tabKey === 'profile') return routeName === 'profile';
    return false;
  };

  useEffect(() => {
    Animated.timing(navBarAnim, {
      toValue: isVisible ? 0 : NAVBAR_HEIGHT,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (!isVisible) {
      setIsAddMenuVisible(false);
    }
  }, [isVisible, navBarAnim]);

  const routesToHideTabBar = ['settings', 'teams', 'notifications'];
  if (routesToHideTabBar.includes(routeName)) {
    return null;
  }

  return (
    <>
      <Animated.View style={[styles.container, { transform: [{ translateY: navBarAnim }] }]}>
        {tabs.map((tab) => {
          const active = isActive(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={active ? styles.activeTabButton : styles.tabButton}
              onPress={() => {
                setIsAddMenuVisible(false);
                router.push(tab.route as any);
              }}
            >
              {tab.icon === 'calendar' ? (
                <Feather name="calendar" size={22} color={active ? currentColors.tabBarIconActive : currentColors.tabBarIcon} />
              ) : (
                <SecondaryIcon
                  name={tab.icon as any}
                  size={22}
                  color={active ? currentColors.tabBarIconActive : currentColors.tabBarIcon}
                />
              )}
              <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {isAddMenuVisible && isVisible ? (
        <>
          <Pressable style={styles.menuBackdrop} onPress={() => setIsAddMenuVisible(false)} />
          <View style={styles.addMenuContainer}>
            <TouchableOpacity style={styles.addMenuItem} onPress={() => router.push('/createEvent' as any)}>
              <SecondaryIcon name="calendar-outline" size={20} color={currentColors.icon} style={styles.addMenuItemIcon} />
              <Text style={styles.addMenuItemText}>Create Event</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.addMenuItem} onPress={() => router.push('/(vendors)/all' as any)}>
              <SecondaryIcon name="briefcase-outline" size={20} color={currentColors.icon} style={styles.addMenuItemIcon} />
              <Text style={styles.addMenuItemText}>Add Vendor</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </>
  );
};

export default BottomNavigation;
