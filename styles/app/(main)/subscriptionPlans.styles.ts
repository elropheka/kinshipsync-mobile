import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
  isTablet,
} from 'constants/dimensions';

export const createSubscriptionPlansStyles = (theme: typeof Colors.light) => StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet() ? Spacing.xl : Spacing.m,
    paddingTop: Platform.OS === 'android' ? (isTablet() ? Spacing.xxl * 2 : Spacing.xl) : (isTablet() ? Spacing.xxl * 2 : Spacing.xxl),
    paddingBottom: isTablet() ? Spacing.l : Spacing.m,
    backgroundColor: theme.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  headerBackButton: {
    padding: isTablet() ? Spacing.s : Spacing.xs
  },
  headerTitle: {
    fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    color: theme.textDarkContrast,
  },
  container: {
    flex: 1,
    padding: isTablet() ? Spacing.m : Spacing.s,
    maxWidth: isTablet() ? 900 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
  },
  introText: {
    fontSize: isTablet() ? ResponsiveFontSizes.title : ResponsiveFontSizes.subtitle,
    textAlign: 'center',
    marginVertical: isTablet() ? Spacing.l : Spacing.m,
    color: theme.textDarkContrast,
    paddingHorizontal: isTablet() ? Spacing.m : Spacing.s,
    maxWidth: isTablet() ? 700 : '100%',
    alignSelf: 'center',
  },
  planCard: {
    borderRadius: BorderRadius.l,
    marginBottom: isTablet() ? Spacing.xxl : Spacing.l,
    borderWidth: moderateScale(2),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(2.5),
    maxWidth: isTablet() ? 600 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
  },
  planHeader: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    alignItems: 'center',
  },
  planName: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.textLight,
    marginBottom: Spacing.xs,
  },
  planPrice: {
    fontSize: ResponsiveFontSizes.title,
    color: theme.textLight,
    fontWeight: Fonts.weights.medium,
  },
  featuresContainer: {
    padding: Spacing.l,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  featureIcon: {
    marginRight: Spacing.s,

  },
  featureText: {
    fontSize: ResponsiveFontSizes.subtitle - 1,
    color: theme.textDarkContrast,
    flex: 1,
  },
  selectButton: {
    paddingVertical: Spacing.m,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    elevation: 1,

  },
  currentPlanButton: {
    backgroundColor: theme.textSecondary,
  },
  selectButtonText: {
    color: theme.textLight,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  currentPlanInfoCard: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    marginHorizontal: Spacing.s,
    marginBottom: Spacing.l,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
    elevation: 2,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
  },
  currentPlanInfoTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: theme.buttonPrimary,
    marginBottom: Spacing.s,
  },
  currentPlanInfoText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textDarkContrast,
    marginBottom: Spacing.xs,
  },
  cancelButton: {
    backgroundColor: theme.error,
    marginTop: Spacing.m,
  },
  disabledButton: {
    backgroundColor: theme.textSecondary,
    opacity: 0.7,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createSubscriptionPlansStyles(Colors.light);