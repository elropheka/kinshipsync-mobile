import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Layout,
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  moderateScale,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  authButtonsContainer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.l,
    gap: Spacing.s,
  },
  loginButton: {
    backgroundColor: Colors.light.background,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.text,
  },
  createAccountButton: {
    backgroundColor: Colors.light.text,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.light.text,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
  },
  createAccountButtonText: {
    color: Colors.light.background,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.light.backgroundPrimary,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  appName: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 1,
    marginTop: Spacing.xs,
    color: Colors.light.buttonPrimary,
  },
  tagline: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    lineHeight: ResponsiveFontSizes.header3 * 1.4,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.s,
    textAlign: 'center',
    color: Colors.light.text,
  },
  description: {
    fontSize: ResponsiveFontSizes.body,
    lineHeight: ResponsiveFontSizes.body * 1.4,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  mainContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.l,
  },
  featuresContainer: {
    flex: 2,
    marginRight: Spacing.l,
  },
  featuresTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.m,
    color: Colors.light.text,
  },
  featureItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '48%',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.s,
  },
  featureText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.xs,
    color: Colors.light.text,
    textAlign: 'center',
  },
  collaborationText: {
    fontSize: ResponsiveFontSizes.body,
    lineHeight: ResponsiveFontSizes.body * 1.4,
    marginTop: Spacing.m,
    padding: Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.m,
    color: Colors.light.text,
    fontWeight: Fonts.weights.medium,
  },
  phonePreviewContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    height: Layout.SCREEN_HEIGHT * 0.5,
    width: Layout.SCREEN_WIDTH * 0.3,
    marginTop: Spacing.l,
    borderColor: Colors.light.text,
    borderWidth: moderateScale(5),
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    backgroundColor: Colors.light.background,
  },
  phonePreview: {
    width: Layout.SCREEN_WIDTH * 0.6, // Full phone width
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.xs,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3),
    elevation: 3,
    marginLeft: -Layout.SCREEN_WIDTH * 0.3, // Shift left to show only right half
  },
  phoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.s,
  },
  daysCounter: {
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.textSecondary,
  },
  notificationIcon: {
    fontSize: IconSizes.s,
    color: Colors.light.icon,
  },
  eventInfoContainer: {
    marginBottom: Spacing.m,
  },
  coupleNames: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.xs,
    color: Colors.light.buttonPrimary,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xxs,
  },
  eventDetailsIcon: {
    fontSize: IconSizes.s,
    marginRight: Spacing.xs,
    color: Colors.light.icon,
  },
  eventDetailsText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
  },
  featureSection: {
    marginBottom: Spacing.s,
    borderRadius: BorderRadius.m,
    backgroundColor: Colors.light.backgroundLight,
    padding: Spacing.s,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added for better alignment
    marginBottom: Spacing.xs,
  },
  vendorHeader: { // This style seems specific, might need its own color in Colors.ts if used widely
    backgroundColor: '#FFA500', // Kept for now, consider adding to Colors.ts as accentOrange or similar
    borderRadius: BorderRadius.s,
    padding: Spacing.xs,
  },
  featureTitle: {
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.text,
  },
  featureIcon: {
    fontSize: IconSizes.s,
    color: Colors.light.buttonPrimary,
  },
  featureDescription: {
    fontSize: ResponsiveFontSizes.caption,
    lineHeight: ResponsiveFontSizes.caption * 1.4,
    marginBottom: Spacing.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  featureImage: {
    height: moderateScale(40),
    alignItems: 'flex-end',
  },
  imagePlaceholder: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.s,
  },
  announcementTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  announcementItem: {
    alignItems: 'center',
    width: '45%',
  },
  announcementImage: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.s,
    marginBottom: Spacing.xs,
  },
  announcementText: {
    fontSize: ResponsiveFontSizes.small - 1, // Was 9, slightly smaller than 'small'
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  featureButton: {
    marginBottom: Spacing.s,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsButton: {
    backgroundColor: '#8a85ff', // Consider adding to Colors.ts
    alignSelf: 'flex-start',
  },
  vendorsButton: {
    backgroundColor: '#FFA500', // Consider adding to Colors.ts
    alignSelf: 'flex-start',
  },
  websiteButton: {
    backgroundColor: '#9370DB', // Consider adding to Colors.ts
    alignSelf: 'flex-start',
  },
  miscButton: {
    backgroundColor: '#C0A9A9', // Consider adding to Colors.ts
    alignSelf: 'flex-start',
  },
  featureButtonText: {
    color: Colors.light.text,
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.body,
  },
  andMoreContainer: {
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
  },
  andMoreText: {
    color: Colors.light.text,
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.body,
  },
  // New styles for slider-based features
  sliderContainer: {
    flex: 1,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,

  },
  featureSlide: {
    flex: 1,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.l,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.m,
  },
  featureListContainer: {
    flexGrow: 1,
  },
  featureIconContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.m,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  featureContent: {
    alignItems: 'center',
  },
  collaborationContainer: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.xl,
  },
});
