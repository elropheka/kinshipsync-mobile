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
    marginBottom: Spacing.l,
    textAlign: 'center',
    color: Colors.light.text,
  },
  mainContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: Spacing.l,
  },
  featuresContainer: {
    flex: 1,
    marginRight: Spacing.m,
  },
  phonePreviewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: Layout.SCREEN_HEIGHT * 0.5,
    width: Layout.SCREEN_WIDTH * 0.6, // Adjusted from 2, assuming it was a typo for 0.6-0.8 range
    marginTop: Spacing.l,
    borderColor: Colors.light.text,
    borderWidth: moderateScale(5),
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    backgroundColor: Colors.light.background,
  },
  phonePreview: {
    width: '100%',
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.s,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 }, // Adjusted shadow
    shadowOpacity: 0.1, // Adjusted shadow
    shadowRadius: moderateScale(3), // Adjusted shadow
    elevation: 3, // Adjusted elevation
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
    fontSize: ResponsiveFontSizes.subtitle,
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
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  featureIcon: {
    fontSize: IconSizes.s,
    color: Colors.light.buttonPrimary,
  },
  featureDescription: {
    fontSize: ResponsiveFontSizes.small,
    lineHeight: ResponsiveFontSizes.small * 1.4,
    marginBottom: Spacing.xs,
    color: Colors.light.textSecondary,
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
});
