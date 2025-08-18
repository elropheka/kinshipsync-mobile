import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveFormProps {
  children: React.ReactNode;
  style?: ViewStyle;
  columns?: number;
  spacing?: number;
}

export const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  style,
  columns = 1,
  spacing = 16,
}) => {
  const { isTablet, isLandscape } = useResponsiveLayout();

  const getFormStyle = (): ViewStyle => {
    const baseSpacing = isTablet ? spacing * 1.5 : spacing;
    
    if (isTablet && isLandscape && columns > 1) {
      // Multi-column layout for tablets in landscape
      return {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: baseSpacing,
      };
    }
    
    // Single column layout for phones and tablets in portrait
    return {
      gap: baseSpacing,
    };
  };

  const getFieldStyle = (): ViewStyle => {
    if (isTablet && isLandscape && columns > 1) {
      return {
        width: `${100 / columns}%` as any,
        minWidth: 200, // Ensure fields don't get too narrow
      };
    }
    
    return {
      width: '100%',
    };
  };

  // Clone children and apply responsive styles
  const responsiveChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        style: [getFieldStyle(), (child as any).props?.style],
      } as any);
    }
    return child;
  });

  return (
    <View style={[styles.container, getFormStyle(), style]}>
      {responsiveChildren}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
