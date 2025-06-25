import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors'; // Assuming Colors is in constants
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
    // backgroundColor and borderColor are dynamic
  },
  planHeader: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    alignItems: 'center',
    // backgroundColor is dynamic
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
    // color is dynamic
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
    // backgroundColor is dynamic
  },
  currentPlanButton: {
    backgroundColor: Colors.light.textSecondary,
  },
  selectButtonText: {
    color: Colors.light.textLight,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
  },
  centered: { // Added
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: { // Added
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  currentPlanInfoCard: { // Added
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    marginHorizontal: Spacing.s, // Match container padding
    marginBottom: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary, // Highlight current plan
    elevation: 2,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
  },
  currentPlanInfoTitle: { // Added
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.buttonPrimary,
    marginBottom: Spacing.s,
  },
  currentPlanInfoText: { // Added
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textDarkContrast,
    marginBottom: Spacing.xs,
  },
  cancelButton: { // Added for the cancel subscription button
    backgroundColor: Colors.light.error, // Use error color for cancel
    marginTop: Spacing.m,
  },
  disabledButton: { // Added
    backgroundColor: Colors.light.textSecondary, // Fallback for disabled state
    opacity: 0.7,
  },
});
