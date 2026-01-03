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
  isTablet,
} from 'constants/dimensions';

export const createLandingPageHomeStyles = (theme: typeof Colors.light) => StyleSheet.create({
  authButtonsContainer: {
    position: 'absolute',
    bottom: isTablet() ? Spacing.xxl * 2 : Spacing.xxl,
    left: 0,
    right: 0,
    paddingHorizontal: isTablet() ? Spacing.xxl : Spacing.l,
    gap: isTablet() ? Spacing.m : Spacing.s,
    width: '100%',
    alignSelf: 'center'
  },
  loginButton: {
    backgroundColor: theme.background,
    paddingVertical: isTablet() ? Spacing.l : Spacing.m,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.text,
  },
  createAccountButton: {
    backgroundColor: theme.text,
    paddingVertical: isTablet() ? Spacing.l : Spacing.m,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  loginButtonText: {
    color: theme.text,
    fontSize: isTablet() ? ResponsiveFontSizes.title : ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
  },
  createAccountButtonText: {
    color: theme.background,
    fontSize: isTablet() ? ResponsiveFontSizes.title : ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: theme.backgroundPrimary,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: isTablet() ? Spacing.xxl : Spacing.l,
    paddingHorizontal: isTablet() ? Spacing.xl : 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: isTablet() ? Spacing.m : Spacing.s,
  },
  appName: {
    fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 1,
    marginTop: Spacing.xs,
    color: theme.buttonPrimary,
  },
  tagline: {
    fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    lineHeight: isTablet() ? ResponsiveFontSizes.header2 * 1.4 : ResponsiveFontSizes.header3 * 1.4,
    marginHorizontal: isTablet() ? Spacing.xxl : Spacing.l,
    marginBottom: Spacing.s,
    textAlign: 'center',
    color: theme.text,
    maxWidth: isTablet() ? 800 : '100%',
  },
  description: {
    fontSize: isTablet() ? ResponsiveFontSizes.subtitle : ResponsiveFontSizes.body,
    lineHeight: isTablet() ? ResponsiveFontSizes.subtitle * 1.4 : ResponsiveFontSizes.body * 1.4,
    marginHorizontal: isTablet() ? Spacing.xxl : Spacing.l,
    marginBottom: Spacing.l,
    textAlign: 'center',
    maxWidth: isTablet() ? 800 : '100%',
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
    color: theme.text,
  },
  featureItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '45%',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.s,
  },
  featureText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.xs,
    color: theme.text,
    textAlign: 'center',
  },
  collaborationText: {
    fontSize: ResponsiveFontSizes.body,
    lineHeight: ResponsiveFontSizes.body * 1.4,
    marginTop: Spacing.m,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    color: theme.text,
    fontWeight: Fonts.weights.medium,
  },
  phonePreviewContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    height: Layout.SCREEN_HEIGHT * 0.5,
    width: Layout.SCREEN_WIDTH * 0.3,
    marginTop: Spacing.l,
    borderColor: theme.text,
    borderWidth: moderateScale(5),
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    backgroundColor: theme.background,
  },
  phonePreview: {
    width: Layout.SCREEN_WIDTH * 0.6,
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.xs,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3),
    elevation: 3,
    marginLeft: -Layout.SCREEN_WIDTH * 0.3,
  },
  phoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.s,
  },
  daysCounter: {
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.bold,
    color: theme.textSecondary,
  },
  notificationIcon: {
    fontSize: IconSizes.s,
    color: theme.icon,
  },
  eventInfoContainer: {
    marginBottom: Spacing.m,
  },
  coupleNames: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.xs,
    color: theme.buttonPrimary,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xxs,
  },
  eventDetailsIcon: {
    fontSize: IconSizes.s,
    marginRight: Spacing.xs,
    color: theme.icon,
  },
  eventDetailsText: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary,
  },
  featureSection: {
    marginBottom: Spacing.s,
    borderRadius: BorderRadius.m,
    backgroundColor: theme.backgroundLight,
    padding: Spacing.s,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  vendorHeader: {
    backgroundColor: '#FFA500',
    borderRadius: BorderRadius.s,
    padding: Spacing.xs,
  },
  featureTitle: {
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.small,
    color: theme.text,
  },
  featureIcon: {
    fontSize: IconSizes.s,
    color: theme.buttonPrimary,
  },
  featureDescription: {
    fontSize: ResponsiveFontSizes.caption,
    lineHeight: ResponsiveFontSizes.caption * 1.4,
    marginBottom: Spacing.xs,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  featureImage: {
    height: moderateScale(40),
    alignItems: 'flex-end',
  },
  imagePlaceholder: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: theme.border,
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
    backgroundColor: theme.border,
    borderRadius: BorderRadius.s,
    marginBottom: Spacing.xs,
  },
  announcementText: {
    fontSize: ResponsiveFontSizes.small - 1,
    textAlign: 'center',
    color: theme.textSecondary,
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
    backgroundColor: '#8a85ff',
    alignSelf: 'flex-start',
  },
  vendorsButton: {
    backgroundColor: '#FFA500',
    alignSelf: 'flex-start',
  },
  websiteButton: {
    backgroundColor: '#9370DB',
    alignSelf: 'flex-start',
  },
  miscButton: {
    backgroundColor: '#C0A9A9',
    alignSelf: 'flex-start',
  },
  featureButtonText: {
    color: theme.text,
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.body,
  },
  andMoreContainer: {
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
  },
  andMoreText: {
    color: theme.text,
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.body,
  },

  sliderContainer: {
    flex: 1,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  featureSlide: {
    flex: 1,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.l,
    justifyContent: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: Spacing.l,
  },
  featureListContainer: {
    flexGrow: 1,
  },
  featureIconContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.m,
    backgroundColor: theme.background,
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

// For backwards compatibility, export the light theme styles
export const styles = createLandingPageHomeStyles(Colors.light);