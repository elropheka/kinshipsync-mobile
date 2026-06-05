import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
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
    body: {
      flex: 1,
      paddingHorizontal: isTablet() ? Spacing.xxl : Spacing.l,
      justifyContent: 'space-between',
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.m,
    },
    brandLogo: {
      width: isTablet() ? 52 : 44,
      height: isTablet() ? 52 : 44,
      marginRight: Spacing.m,
    },
    brandNameBlock: {
      justifyContent: 'center',
    },
    brandNameLine: {
      color: theme.secondary,
      fontFamily: Fonts.headerBold,
      fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
      lineHeight: isTablet() ? 34 : 28,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    mainContent: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    carouselSection: {
      justifyContent: 'flex-start',
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.l,
      overflow: 'visible',
    },
    messageBlock: {
      width: '100%',
      paddingTop: Spacing.m,
      paddingBottom: Spacing.s,
      alignItems: 'center',
    },
    headline: {
      color: theme.secondary,
      textAlign: 'center',
      fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
      marginBottom: Spacing.s,
      fontFamily: Fonts.headerBold,
    },
    tagline: {
      color: theme.secondary,
      textAlign: 'center',
      lineHeight: 22,
      opacity: 0.88,
      fontSize: ResponsiveFontSizes.body,
    },
    authButtonsContainer: {
      gap: Spacing.s,
      paddingTop: Spacing.s,
      paddingBottom: Spacing.s,
    },
  });
