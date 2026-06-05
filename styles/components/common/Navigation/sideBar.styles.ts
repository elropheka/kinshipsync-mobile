import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Layout,
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
  isTablet,
} from 'constants/dimensions';

export const SIDEBAR_WIDTH = isTablet() ? Layout.SCREEN_WIDTH * 0.65 : Layout.SCREEN_WIDTH * 0.85;

export const createSideBarStyles = (theme: typeof Colors.light) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: Layout.SCREEN_HEIGHT,
    backgroundColor: theme.background,
    zIndex: 999,
    shadowColor: theme.text,
    shadowOffset: { width: moderateScale(2), height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(5),
    elevation: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? (isTablet() ? Spacing.xxl * 2 : Spacing.xxl) : undefined,
    paddingHorizontal: isTablet() ? Spacing.xxl : Spacing.l,
    flexDirection: 'column',
    backgroundColor: theme.background,
  },
  scrollContent: {
    flex: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet() ? Spacing.xxl : Spacing.l,
    paddingTop: isTablet() ? Spacing.m : Spacing.s,
  },
  sidebarTitle: {
    fontSize: isTablet() ? ResponsiveFontSizes.header1 : ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.medium,
    fontFamily: Fonts.headerBold,
    color: theme.text,
  },
  sidebarLogo: {
    width: isTablet() ? 180 : 150,
    height: isTablet() ? 44 : 36,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,

  },
  avatarText: {
    color: theme.buttonPrimary,
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
  },
  profileInfo: {
    marginLeft: Spacing.m,
  },
  profileName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
    fontFamily: Fonts.headerSemiBold,
  },
  profileEmail: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
    fontFamily: Fonts.bodyLight,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginBottom: Spacing.m,
    fontWeight: Fonts.weights.medium,
    fontFamily: Fonts.bodyLight,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  menuText: {
    marginLeft: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    fontFamily: Fonts.bodyRegular,
  },
  logoutContainer: {
    paddingVertical: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
    marginTop: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.l,
  },
  logoutText: {
    marginLeft: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.error,
    fontFamily: Fonts.bodyRegular,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createSideBarStyles(Colors.light);