import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface ResponsiveGridProps {
  children: React.ReactNode;
  style?: ViewStyle;
  itemSpacing?: number;
  columnSpacing?: number;
  minItemWidth?: number;
  maxColumns?: number;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  style,
  itemSpacing = 16,
  columnSpacing = 16,
  minItemWidth = 280,
  maxColumns = 4,
}) => {
  const { isTablet, isLargeScreen, screenWidth } = useResponsiveLayout();

  // Calculate number of columns based on screen size
  const getColumnCount = (): number => {
    if (isLargeScreen && isTablet) {
      return Math.min(maxColumns, Math.floor((screenWidth - columnSpacing) / (minItemWidth + columnSpacing)));
    } else if (isTablet) {
      return Math.min(3, Math.floor((screenWidth - columnSpacing) / (minItemWidth + columnSpacing)));
    } else {
      return Math.min(2, Math.floor((screenWidth - columnSpacing) / (minItemWidth + columnSpacing)));
    }
  };

  const columnCount = getColumnCount();

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -columnSpacing / 2,
  };

  const itemStyle: ViewStyle = {
    width: `${100 / columnCount}%` as any,
    paddingHorizontal: columnSpacing / 2,
    paddingVertical: itemSpacing / 2,
  };

  // Clone children and apply responsive styles
  const responsiveChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Safely access props with proper typing
      const childElement = child as React.ReactElement<any>;
      return React.cloneElement(childElement, {
        style: [itemStyle, childElement.props?.style],
      });
    }
    return child;
  });

  return (
    <View style={[styles.container, gridStyle, style]}>
      {responsiveChildren}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
