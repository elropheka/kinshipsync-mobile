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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
    paddingTop: isTablet() ? Spacing.l : Spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet() ? Spacing.xl : Spacing.l,
    paddingVertical: isTablet() ? Spacing.l : Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
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
    color: Colors.light.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.neutralBg,
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
    color: Colors.light.text,
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
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
    justifyContent: 'center',
    height: moderateScale(36),
  },
  activeFilterChip: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  filterText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
  activeFilterText: {
    color: Colors.light.primaryContrastText,
    fontWeight: Fonts.weights.medium,
  },
  notificationSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  settingsText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.text,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
  },
  unreadItem: {
    backgroundColor: Colors.light.info + '1A',
  },
  avatarContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.m,
    backgroundColor: Colors.light.backgroundPaper,
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
    color: Colors.light.text,
  },
  notificationTime: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
  },
  notificationText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  unreadIndicator: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.buttonPrimary,
    marginLeft: Spacing.s,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginLeft: Spacing.l + moderateScale(50) + Spacing.m,
  },
  markAllReadButton: {
    position: 'absolute',
    right: Spacing.l,
    bottom: Spacing.xl,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.text,
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
    color: Colors.light.textSecondary,
  },
  errorText: {
    marginTop: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.danger,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  errorTextDetail: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.l,
  },
});
