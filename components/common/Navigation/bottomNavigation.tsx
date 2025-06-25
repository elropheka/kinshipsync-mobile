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
import { Colors } from 'constants/Colors'; // Assuming Colors is correctly imported
import { router } from 'expo-router';
import { styles } from '../../../styles/components/common/Navigation/bottomNavigation.styles'; // Assuming styles are correct
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Constants (These can remain as they are related to UI layout)
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_ESTIMATED_HEIGHT = 150;
const NAVBAR_HEIGHT = SCREEN_HEIGHT * 0.09;
const NAVBAR_BOTTOM_OFFSET = 15;
const MENU_GAP = 5;
// MENU_VISIBLE_BOTTOM is relative to the screen bottom
const MENU_VISIBLE_BOTTOM = NAVBAR_BOTTOM_OFFSET + NAVBAR_HEIGHT + MENU_GAP;
// MENU_START_TRANSLATE_Y and MENU_END_TRANSLATE_Y are relative to the menu's natural position when the navbar is visible
// Let's redefine these to be relative to the bottom of the screen for clarity with Animated
const MENU_OFFSET_FROM_BOTTOM = 15; // The distance the menu appears above the navbar
const MENU_START_TRANSLATE_Y = MENU_ESTIMATED_HEIGHT + MENU_OFFSET_FROM_BOTTOM; // Start off screen below
const MENU_END_TRANSLATE_Y = -MENU_OFFSET_FROM_BOTTOM; // End above the navbar (negative translation moves it up)

// Define the expected props including the new isVisible prop
interface CustomBottomNavigationProps extends BottomTabBarProps {
  isVisible: boolean; // Add the new prop to control visibility
}

const BottomNavigation: React.FC<CustomBottomNavigationProps> = (props) => {
  // Destructure isVisible from props
  const { isVisible, ...restProps } = props;

  // Safely get the current route name, providing a fallback
  const routeName = props.state?.routes?.[props.state?.index]?.name || 'defaultRouteName';

  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  // Animated value for the add menu translation
  const menuAnim = useRef(new Animated.Value(MENU_START_TRANSLATE_Y)).current;

  // *** NEW: Animated value for the main navigation bar translation ***
  const navBarAnim = useRef(new Animated.Value(0)).current; // Start visible (translateY: 0)

  // Define routes using the paths router.push expects
   const routes = {
    home: '/home',
    events: '/all',
    // teams: '/(main)/teams', // Teams route will be handled in the add menu
    guests: '/guests',
    budget: '/budget',
    chat: '/chatArea',
    vendors: '(vendors)/all',
    messages: '/messages',
    newEvent: '/createEvent',
    teams: '/(main)/teams', // Added teams route for the add menu
  } as const;

  type RouteKeys = keyof typeof routes;
  type RouteNames = (typeof routes)[RouteKeys];

  // Check if the current route is active based on props.state
  const isActiveRoute = (targetRouteName: RouteNames) => {
    // Safely access routeName
    return routeName === targetRouteName;
  };

  const getIconColor = (targetRouteName: RouteNames) => {
    // Use Colors object if defined and accessible, otherwise use hardcoded
    return isActiveRoute(targetRouteName) ? Colors.light.background : Colors.light.text;
  };

  const getLabelColor = (targetRouteName: RouteNames) => {
    // Use Colors object if defined and accessible, otherwise use hardcoded
    return isActiveRoute(targetRouteName) ? Colors.light.background : Colors.light.text;
  };

  const getTabButtonStyle = (targetRouteName: RouteNames) => {
    return isActiveRoute(targetRouteName) ? styles.activeTabButton : styles.tabButton;
  };

  // Use router.push for tab presses
  const handleTabPress = (targetRouteName: RouteNames) => {
     router.push(targetRouteName as any); // Cast might be needed depending on TS config
     setIsAddMenuVisible(false); // Close add menu on tab press
  };

  // Use router.push for navigation within the add menu
  const handleNavigation = (path: string) => {
     router.push(path as any); // router.push works with file-based paths
     setIsAddMenuVisible(false); // Close add menu after navigation
  };

  // Effect to animate the add menu visibility
  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: isAddMenuVisible ? MENU_END_TRANSLATE_Y : MENU_START_TRANSLATE_Y,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isAddMenuVisible, menuAnim]);

  // *** NEW: Effect to animate the main navigation bar visibility based on isVisible prop ***
  useEffect(() => {
    Animated.timing(navBarAnim, {
      // Target 0 (visible) when isVisible is true
      // Target its full height + bottom offset when isVisible is false (slide down)
      toValue: isVisible ? 0 : NAVBAR_HEIGHT + NAVBAR_BOTTOM_OFFSET,
      duration: 300, // Match add menu duration for consistency
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // If the bar is becoming hidden, ensure the add menu is closed
    if (!isVisible) {
      setIsAddMenuVisible(false);
    }
  }, [isVisible, navBarAnim, NAVBAR_HEIGHT, NAVBAR_BOTTOM_OFFSET]); // Add dependencies used in the effect

  // Hide the navigation bar completely on settings and subscriptionPlans pages
  // This takes precedence over the scroll animation
   const routesToHideTabBar = ['settings', 'subscriptionPlans'];
   // Safely access routeName
   if (routesToHideTabBar.includes(routeName)) {
     return null;
   }


  return (
    <>
      {/* Wrap the main navigation bar in an Animated.View */}
      {/* Apply the translateY animation */}
      <Animated.View style={[styles.container, { transform: [{ translateY: navBarAnim }] }]}>
        {/* ... Your TouchableOpacity buttons using handleTabPress ... */}
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

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          // Only allow opening the add menu if the main bar is visible
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

      {/* Your existing UI for the add menu */}
      {/* Only render the add menu UI if it's visible AND the main bar is visible */}
      {isAddMenuVisible && isVisible && (
        <>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setIsAddMenuVisible(false)}
          />
          <Animated.View style={[styles.addMenuContainer, { transform: [{ translateY: menuAnim }] }]}>
            {/* ... Your add menu items using handleNavigation (router.push) ... */}
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
              onPress={() => handleNavigation('/themes/createTheme')} // Placeholder route
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
