import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  Layout,
  moderateScale,
  isTablet,
} from 'constants/dimensions';

export const createNotificationsStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
    paddingTop: isTablet() ? Spacing.l : Spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet() ? Spacing.xl : Spacing.l,
    paddingVertical: isTablet() ? Spacing.l : Spacing.m,
    backgroundColor: theme.backgroundLight,
  },
  backButton: {
    padding: isTablet() ? Spacing.m : Spacing.s,
    marginRight: isTablet() ? Spacing.m : Spacing.s,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    marginRight: isTablet() ? Spacing.xxl : Spacing.xxl,
    color: theme.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.neutralBg,
    marginHorizontal: isTablet() ? Spacing.xl : Spacing.l,
    marginBottom: isTablet() ? Spacing.l : Spacing.m,
    paddingHorizontal: isTablet() ? Spacing.l : Spacing.m,
    borderRadius: BorderRadius.xl,
    height: isTablet() ? Layout.inputHeight * 1.2 : Layout.inputHeight,
    maxWidth: isTablet() ? 600 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
  },
  filterScrollContainer: {
    maxHeight: moderateScale(50),
  },
  filterContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
    justifyContent: 'center',
    height: moderateScale(36),
  },
  activeFilterChip: {
    backgroundColor: theme.buttonPrimary,
  },
  filterText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  activeFilterText: {
    color: theme.primaryContrastText,
    fontWeight: Fonts.weights.medium,
  },
  notificationSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  settingsText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.text,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: theme.backgroundLight,
  },
  unreadItem: {
    backgroundColor: theme.info + '1A',
  },
  avatarContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.m,
    backgroundColor: theme.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  senderName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  notificationTime: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  notificationText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  unreadIndicator: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.buttonPrimary,
    marginLeft: Spacing.s,
  },
  separator: {
    height: 1,
    backgroundColor: theme.divider,
    marginLeft: Spacing.l + moderateScale(50) + Spacing.m,
  },
  markAllReadButton: {
    position: 'absolute',
    right: Spacing.l,
    bottom: Spacing.xl,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(3.84),
    elevation: 5,
  },
  markAllReadIcon: {
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.m,
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  errorText: {
    marginTop: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.danger,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  errorTextDetail: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.l,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createNotificationsStyles(Colors.light);