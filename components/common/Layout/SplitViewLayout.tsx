import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

interface SplitViewLayoutProps {
  masterView: React.ReactNode;
  detailView: React.ReactNode;
  masterWidth?: number;
  detailWidth?: number;
  style?: ViewStyle;
  showDetail?: boolean;
}

export const SplitViewLayout: React.FC<SplitViewLayoutProps> = ({
  masterView,
  detailView,
  masterWidth = 320,
  detailWidth = 400,
  style,
  showDetail = true,
}) => {
  const { isTablet, screenWidth } = useResponsiveLayout();

  // On small screens or when not tablet, stack vertically
  if (!isTablet || screenWidth < 768) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.masterContainer}>
          {masterView}
        </View>
        {showDetail && (
          <View style={styles.detailContainer}>
            {detailView}
          </View>
        )}
      </View>
    );
  }

  // On tablets, use split view layout
  const isCompact = screenWidth < 1024;
  const actualMasterWidth = isCompact ? Math.min(masterWidth, screenWidth * 0.4) : masterWidth;
  const actualDetailWidth = isCompact ? screenWidth - actualMasterWidth : detailWidth;

  return (
    <View style={[styles.splitContainer, style]}>
      <View style={[styles.masterSplit, { width: actualMasterWidth }]}>
        {masterView}
      </View>
      {showDetail && (
        <View style={[styles.detailSplit, { width: actualDetailWidth }]}>
          {detailView}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  masterContainer: {
    flex: 1,
  },
  detailContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  masterSplit: {
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  detailSplit: {
    flex: 1,
  },
});
