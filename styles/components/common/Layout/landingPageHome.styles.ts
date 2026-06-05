import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import {
  Spacing,
  ResponsiveFontSizes,
  isTablet,
} from 'constants/dimensions';

export const createLandingPageHomeStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: Spacing.xxl * 4,
    },
    logoRow: {
      paddingVertical: Spacing.m,
    },
    logoImage: {
      width: isTablet() ? 220 : 180,
      height: isTablet() ? 56 : 48,
    },
    welcomeTitle: {
      color: theme.primary,
      marginBottom: Spacing.m,
      fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
    },
    authButtonsContainer: {
      position: 'absolute',
      bottom: isTablet() ? Spacing.xxl * 2 : Spacing.xxl,
      left: 0,
      right: 0,
      paddingHorizontal: isTablet() ? Spacing.xxl : Spacing.l,
      gap: isTablet() ? Spacing.m : Spacing.s,
    },
  });
