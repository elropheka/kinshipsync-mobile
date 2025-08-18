import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.xxl,
    paddingBottom: Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  headerBackButton: {
    padding: Spacing.xs
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    color: Colors.light.textDarkContrast,
  },
  container: {
    flex: 1,
    padding: Spacing.s,
  },
  introText: {
    fontSize: ResponsiveFontSizes.subtitle,
    textAlign: 'center',
    marginVertical: Spacing.m,
    color: Colors.light.textDarkContrast,
    paddingHorizontal: Spacing.s,
  },
  planCard: {
    borderRadius: BorderRadius.l,
    marginBottom: Spacing.l,
    borderWidth: moderateScale(2),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(2.5),
  },
  planHeader: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    alignItems: 'center',
  },
  planName: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.textLight,
    marginBottom: Spacing.xs,
  },
  planPrice: {
    fontSize: ResponsiveFontSizes.title,
    color: Colors.light.textLight,
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
    color: Colors.light.textDarkContrast,
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
    backgroundColor: Colors.light.textSecondary,
  },
  selectButtonText: {
    color: Colors.light.textLight,
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
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  currentPlanInfoCard: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    marginHorizontal: Spacing.s,
    marginBottom: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
    elevation: 2,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
  },
  currentPlanInfoTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.buttonPrimary,
    marginBottom: Spacing.s,
  },
  currentPlanInfoText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textDarkContrast,
    marginBottom: Spacing.xs,
  },
  cancelButton: {
    backgroundColor: Colors.light.error,
    marginTop: Spacing.m,
  },
  disabledButton: {
    backgroundColor: Colors.light.textSecondary,
    opacity: 0.7,
  },
});
