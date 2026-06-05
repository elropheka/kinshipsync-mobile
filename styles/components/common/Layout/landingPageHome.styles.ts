import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import {
  Spacing,
  ResponsiveFontSizes,
  BorderRadius,
  isTablet,
} from 'constants/dimensions';

export const createLandingPageHomeStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    body: {
      flex: 1,
      paddingHorizontal: isTablet() ? Spacing.xxl : Spacing.l,
      justifyContent: 'space-between',
    },
    topSection: {
      alignItems: 'center',
      paddingTop: Spacing.s,
    },
    logoImage: {
      width: isTablet() ? 180 : 150,
      height: isTablet() ? 46 : 38,
      marginBottom: Spacing.m,
    },
    messageBlock: {
      width: '100%',
      backgroundColor: theme.primary,
      borderRadius: BorderRadius.xl,
      paddingVertical: Spacing.l,
      paddingHorizontal: Spacing.l,
      alignItems: 'center',
    },
    headline: {
      color: theme.textLight,
      textAlign: 'center',
      fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
      marginBottom: Spacing.s,
    },
    tagline: {
      color: theme.textLight,
      textAlign: 'center',
      lineHeight: 22,
      opacity: 0.92,
      fontSize: ResponsiveFontSizes.body,
    },
    carouselSection: {
      flex: 1,
      justifyContent: 'center',
      minHeight: 300,
      paddingVertical: Spacing.s,
      overflow: 'visible',
    },
    authButtonsContainer: {
      gap: Spacing.s,
      paddingTop: Spacing.s,
      paddingBottom: Spacing.s,
    },
  });
