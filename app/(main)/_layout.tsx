import { Tabs } from 'expo-router';
import React, { useState, useRef, useCallback, createContext, useContext } from 'react';
import { Platform, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import BottomNavigation from 'components/common/Navigation/bottomNavigation';

import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { Colors } from '@/constants/Colors';
import BackButton from '@/components/common/Navigation/BackButton'; 


export const ScrollContext = createContext<{
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  isNavVisible: boolean;
}>({
  handleScroll: (_event: NativeSyntheticEvent<NativeScrollEvent>) => {},
  isNavVisible: true,
});

  
export const useScrollHandler = () => useContext(ScrollContext);


function MainTabsLayout() {
 
  const [isNavVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; 



  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > lastScrollY.current + scrollThreshold) {
      setNavVisible(false); 
    } else if (currentScrollY < lastScrollY.current - scrollThreshold) {
      setNavVisible(true); 
    }
    
    lastScrollY.current = currentScrollY;
  }, []);

  return (
    <ScrollContext.Provider value={{ handleScroll, isNavVisible }}>
      <SubscriptionProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            headerLeft: () => <BackButton />, 
            tabBarStyle: {
              display: Platform.OS === 'web' ? 'none' : 'flex',
            },
             headerStyle: {
                      backgroundColor: Colors.light.backgroundPrimary
                },
          }}
          tabBar={props => {
            if (!props.state || !props.state.routes) {
              return null;
            }
            const routeName = props.state.routes[props.state.index]?.name ?? 'home';
            const routesToHideTabBar = ['settings',  'teams', 'notifications', 'profile', 'guests', '(events)/guests'];
            const hideTabBar = routesToHideTabBar.includes(routeName);
            return hideTabBar ? null : <BottomNavigation {...props} isVisible={isNavVisible} />;
          }}
        >
          <Tabs.Screen
            name="home"
            options={{ title: "Home", headerShown: false }}
          />
          <Tabs.Screen
            name="notifications"
            options={{ title: "Notifications", headerShown: true }}
          />
          <Tabs.Screen
            name="profile"
            options={{ title: "Profile", headerShown: true }}
          />
          <Tabs.Screen
            name="settings"
            options={{ title: "Settings", headerShown: true }}
          />
          <Tabs.Screen
            name="subscriptionPlans"
            options={{ title: "Subscription Plans", headerShown: true }}
          />
          <Tabs.Screen
            name="teams"
            options={{ title: "Teams", headerShown: true }}
          />
        </Tabs>
      </SubscriptionProvider>
    </ScrollContext.Provider>
  );
}


export default MainTabsLayout;
