import { Dimensions } from 'react-native';

// Breakpoint constants
export const BREAKPOINTS = {
  SMALL: 375,
  MEDIUM: 768,
  LARGE: 1024,
  XLARGE: 1200,
} as const;

// Size class definitions
export const SIZE_CLASSES = {
  COMPACT: 'compact',
  REGULAR: 'regular',
  LARGE: 'large',
} as const;

// Device type detection
export const getDeviceType = (width: number, height: number): string => {
  const aspectRatio = width / height;
  
  if (width >= BREAKPOINTS.LARGE && aspectRatio > 1.2) {
    return 'tablet-landscape';
  } else if (width >= BREAKPOINTS.MEDIUM) {
    return 'tablet-portrait';
  } else {
    return 'phone';
  }
};

// Responsive spacing calculations
export const getResponsiveSpacing = (baseSpacing: number, multiplier: number = 1): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.LARGE) {
    return baseSpacing * multiplier * 1.5;
  } else if (width >= BREAKPOINTS.MEDIUM) {
    return baseSpacing * multiplier * 1.25;
  }
  
  return baseSpacing * multiplier;
};

// Responsive font size calculations
export const getResponsiveFontSize = (baseSize: number, scale: number = 1): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.LARGE) {
    return baseSize * scale * 1.2;
  } else if (width >= BREAKPOINTS.MEDIUM) {
    return baseSize * scale * 1.1;
  }
  
  return baseSize * scale;
};

// Responsive padding calculations
export const getResponsivePadding = (basePadding: number): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.LARGE) {
    return basePadding * 2;
  } else if (width >= BREAKPOINTS.MEDIUM) {
    return Math.round(basePadding * 1.5);
  }
  
  return basePadding;
};

// Responsive margin calculations
export const getResponsiveMargin = (baseMargin: number): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.LARGE) {
    return baseMargin * 1.5;
  } else if (width >= BREAKPOINTS.MEDIUM) {
    return Math.round(baseMargin * 1.25);
  }
  
  return baseMargin;
};

// Grid column calculations
export const getGridColumns = (minItemWidth: number, spacing: number = 16): number => {
  const { width } = Dimensions.get('window');
  const availableWidth = width - (spacing * 2); // Account for container padding
  
  if (availableWidth < minItemWidth) {
    return 1;
  }
  
  return Math.floor(availableWidth / (minItemWidth + spacing));
};

// Responsive border radius
export const getResponsiveBorderRadius = (baseRadius: number): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.LARGE) {
    return baseRadius * 1.5;
  } else if (width >= BREAKPOINTS.MEDIUM) {
    return Math.round(baseRadius * 1.25);
  }
  
  return baseRadius;
};

// Responsive shadow
export const getResponsiveShadow = (baseShadow: number) => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.LARGE) {
    return {
      shadowOffset: { width: 0, height: baseShadow * 1.5 },
      shadowRadius: baseShadow * 1.5,
      elevation: Math.round(baseShadow * 1.5),
    };
  } else if (width >= BREAKPOINTS.MEDIUM) {
    return {
      shadowOffset: { width: 0, height: Math.round(baseShadow * 1.25) },
      shadowRadius: Math.round(baseShadow * 1.25),
      elevation: Math.round(baseShadow * 1.25),
    };
  }
  
  return {
    shadowOffset: { width: 0, height: baseShadow },
    shadowRadius: baseShadow,
    elevation: baseShadow,
  };
};
