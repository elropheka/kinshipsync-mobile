import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useResponsiveLayout } from '../../../hooks/useResponsiveLayout';
import { isTablet as isTabletFromDimensions } from '../../../constants/dimensions';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
  paddingHorizontal?: number;
  centerContent?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  maxWidth = 1200,
  paddingHorizontal = 16,
  centerContent = true,
}) => {
  const { isTablet: isTabletFromHook, isLargeScreen } = useResponsiveLayout();
  
  // Use both detection methods for better accuracy
  const isTablet = isTabletFromDimensions() || isTabletFromHook;

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: isTablet ? Math.max(paddingHorizontal * 1.5, 24) : paddingHorizontal,
    maxWidth: isLargeScreen ? maxWidth : '100%',
    alignSelf: centerContent ? 'center' : 'stretch',
    width: '100%',
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
