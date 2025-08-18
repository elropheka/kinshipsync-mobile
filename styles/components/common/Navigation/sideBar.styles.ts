import { StyleSheet, StatusBar, Platform } from 'react-native';
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

const SIDEBAR_WIDTH = Layout.SCREEN_WIDTH * 0.75;


export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.dark.background + 'BF',
    zIndex: 998,

  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: Layout.SCREEN_HEIGHT,
    backgroundColor: Colors.light.background,
    zIndex: 999,
    shadowColor: Colors.light.text,
    shadowOffset: { width: moderateScale(2), height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(5),
    elevation: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? (Spacing.xxl) : undefined,
    paddingHorizontal: Spacing.l,
    flexDirection: 'column',
    backgroundColor: Colors.light.background,

  },
  scrollContent: {
    flex: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
    paddingTop: Spacing.s,
  },
  sidebarTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.medium,
    fontFamily: Fonts.headerBold,
    color: Colors.light.text,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,

  },
  avatarText: {
    color: Colors.light.buttonPrimary,
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
  },
  profileInfo: {
    marginLeft: Spacing.m,
  },
  profileName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
    fontFamily: Fonts.headerSemiBold,
  },
  profileEmail: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
    fontFamily: Fonts.bodyLight,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
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
    color: Colors.light.text,
    fontFamily: Fonts.bodyRegular,
  },
  logoutContainer: {
    paddingVertical: Spacing.l,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
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
    color: Colors.light.error,
    fontFamily: Fonts.bodyRegular,
  },
});
