import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useResponsiveLayout } from '../../../hooks/useResponsiveLayout';

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
  const { isTablet, isLargeScreen } = useResponsiveLayout();

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: isTablet ? Math.max(paddingHorizontal * 2, 32) : paddingHorizontal,
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
