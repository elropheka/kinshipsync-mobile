import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { AntDesign as SpecialIcon, Ionicons as SecondaryIcon, Feather, Entypo } from '@expo/vector-icons';
import { Colors } from 'constants/Colors';
import { router } from 'expo-router';
import { styles } from '../../../styles/components/common/Navigation/bottomNavigation.styles';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MENU_ESTIMATED_HEIGHT = 150;
const NAVBAR_HEIGHT = SCREEN_HEIGHT * 0.09;
const NAVBAR_BOTTOM_OFFSET = 15;
const MENU_OFFSET_FROM_BOTTOM = 15;
const MENU_START_TRANSLATE_Y = MENU_ESTIMATED_HEIGHT + MENU_OFFSET_FROM_BOTTOM;
const MENU_END_TRANSLATE_Y = -MENU_OFFSET_FROM_BOTTOM;

interface CustomBottomNavigationProps extends BottomTabBarProps {
  isVisible: boolean;
}

const BottomNavigation: React.FC<CustomBottomNavigationProps> = (props) => {
  const { isVisible } = props;

  const routeName = props.state?.routes?.[props.state?.index]?.name || 'defaultRouteName';

  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const menuAnim = useRef(new Animated.Value(MENU_START_TRANSLATE_Y)).current;

  const navBarAnim = useRef(new Animated.Value(0)).current;

  const isLandscape = dimensions.width > dimensions.height;

   const routes = {
    home: '/home',
    events: '/all',
    guests: '/guests',
    budget: '/budget',
    chat: '/chatArea',
    vendors: '(vendors)/all',
    messages: '/messages',
    newEvent: '/createEvent',
    teams: '/(main)/teams',
  } as const;

  type RouteKeys = keyof typeof routes;
  type RouteNames = (typeof routes)[RouteKeys];

  const isActiveRoute = (targetRouteName: RouteNames) => {
    return routeName === targetRouteName;
  };

  const getIconColor = (targetRouteName: RouteNames) => {
    return isActiveRoute(targetRouteName) ? Colors.light.background : Colors.light.text;
  };

  const getLabelColor = (targetRouteName: RouteNames) => {
    return isActiveRoute(targetRouteName) ? Colors.light.background : Colors.light.text;
  };

  const getTabButtonStyle = (targetRouteName: RouteNames) => {
    return isActiveRoute(targetRouteName) ? styles.activeTabButton : styles.tabButton;
  };

  const handleTabPress = (targetRouteName: RouteNames) => {
     router.push(targetRouteName as any);
     setIsAddMenuVisible(false);
  };

  const handleNavigation = (path: string) => {
     router.push(path as any);
     setIsAddMenuVisible(false);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: isAddMenuVisible ? MENU_END_TRANSLATE_Y : MENU_START_TRANSLATE_Y,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isAddMenuVisible, menuAnim]);

  useEffect(() => {
    Animated.timing(navBarAnim, {
      toValue: isVisible ? 0 : NAVBAR_HEIGHT + NAVBAR_BOTTOM_OFFSET,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (!isVisible) {
      setIsAddMenuVisible(false);
    }
  }, [isVisible, navBarAnim]);

   const routesToHideTabBar = ['settings'];
   if (routesToHideTabBar.includes(routeName)) {
     return null;
   }


  const containerStyle = isLandscape
    ? [
        styles.container,
        {
          left: 0,
          right: 0,
          width: undefined,
          marginHorizontal: 15,
        },
        { transform: [{ translateY: navBarAnim }] },
      ]
    : [styles.container, { transform: [{ translateY: navBarAnim }] }];

  return (
    <>
      <Animated.View style={containerStyle}>
         <TouchableOpacity
          style={getTabButtonStyle(routes.home)}
          onPress={() => handleTabPress(routes.home)}
        >
          <SpecialIcon name="home" size={24} color={getIconColor(routes.home)} />
          <Text style={[styles.tabLabel, { color: getLabelColor(routes.home) }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getTabButtonStyle(routes.events)}
          onPress={() => handleTabPress(routes.events)}
        >
          <Feather name="calendar" size={24} color={getIconColor(routes.events)} />
          <Text style={[styles.tabLabel, { color: getLabelColor(routes.events) }]}>My Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => isVisible && setIsAddMenuVisible(!isAddMenuVisible)}
        >
          <SecondaryIcon name={isAddMenuVisible ? "close-outline" : "add-outline"} size={40} color={Colors.light.neutralBg} />
        </TouchableOpacity>

        <TouchableOpacity
          style={getTabButtonStyle(routes.guests)}
          onPress={() => handleTabPress(routes.guests)}
        >
          <SecondaryIcon name="person" size={24} color={getIconColor(routes.guests)} />
          <Text style={[styles.tabLabel, { color: getLabelColor(routes.guests) }]}>Guests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getTabButtonStyle(routes.budget)}
          onPress={() => handleTabPress(routes.budget)}
        >
          <Entypo name="wallet" size={24} color={getIconColor(routes.budget)} />
          <Text style={[styles.tabLabel, { color: getLabelColor(routes.budget) }]}>Budget</Text>
        </TouchableOpacity>
      </Animated.View>

      {isAddMenuVisible && isVisible && (
        <>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setIsAddMenuVisible(false)}
          />
          <Animated.View style={[styles.addMenuContainer, { transform: [{ translateY: menuAnim }] }]}>
             <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => handleNavigation('/createEvent')}
            >
              <SecondaryIcon name="calendar-outline" size={20} color={Colors.light.icon} style={styles.addMenuItemIcon} />
              <Text style={styles.addMenuItemText}>Create Event</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => handleNavigation('/messages')}
            >
              <SecondaryIcon name="chatbox-ellipses-outline" size={20} color={Colors.light.icon} style={styles.addMenuItemIcon} />
              <Text style={styles.addMenuItemText}>Send Messages</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => handleNavigation('/(vendors)/all')}
            >
              <SecondaryIcon name="briefcase-outline" size={20} color={Colors.light.icon} style={styles.addMenuItemIcon} />
              <Text style={styles.addMenuItemText}>Add Vendor</Text>
            </TouchableOpacity>
             <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => handleNavigation('/(main)/teams')}
            >
              <SecondaryIcon name="people-outline" size={20} color={Colors.light.icon} style={styles.addMenuItemIcon} />
              <Text style={styles.addMenuItemText}>Create Team</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => handleNavigation('/themes/createTheme')}
            >
              <SecondaryIcon name="color-palette-outline" size={20} color={Colors.light.icon} style={styles.addMenuItemIcon} />
              <Text style={styles.addMenuItemText}>Create Theme</Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </>
  );
};

export default BottomNavigation;
