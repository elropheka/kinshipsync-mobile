import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import * as Device from 'expo-device';

export interface SizeClass {
  horizontal: 'compact' | 'regular' | 'large';
  vertical: 'compact' | 'regular' | 'large';
}

export interface ResponsiveLayout {
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  sizeClass: SizeClass;
  screenWidth: number;
  screenHeight: number;
  isLargeScreen: boolean;
  isMediumScreen: boolean;
  isSmallScreen: boolean;
}

export const useResponsiveLayout = (): ResponsiveLayout => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
      setIsLandscape(window.width > window.height);
    });

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  const isTablet = Device.deviceType === Device.DeviceType.TABLET;
  const isPortrait = !isLandscape;
  
  const getSizeClass = (): SizeClass => {
    const { width, height } = dimensions;
    
    let horizontal: 'compact' | 'regular' | 'large';
    if (width < 375) horizontal = 'compact';
    else if (width < 768) horizontal = 'regular';
    else horizontal = 'large';
    
    let vertical: 'compact' | 'regular' | 'large';
    if (height < 667) vertical = 'compact';
    else if (height < 1024) vertical = 'regular';
    else vertical = 'large';
    
    return { horizontal, vertical };
  };

  const sizeClass = getSizeClass();
  
  const isLargeScreen = dimensions.width >= 768;
  const isMediumScreen = dimensions.width >= 375 && dimensions.width < 768;
  const isSmallScreen = dimensions.width < 375;

  return {
    isTablet,
    isLandscape,
    isPortrait,
    sizeClass,
    screenWidth: dimensions.width,
    screenHeight: dimensions.height,
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
  };
};
