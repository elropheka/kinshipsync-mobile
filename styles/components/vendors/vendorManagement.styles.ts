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
} from 'constants/dimensions';

export const createVendorManagementStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: theme.background,
  },
  backButton: {
    marginRight: Spacing.s,
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    marginRight: Spacing.xl,
    color: theme.text,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    backgroundColor: theme.background,
    marginBottom: Spacing.m,
  },
  tabButton: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTabButton: {
    borderColor: theme.tint,
  },
  tabButtonText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  activeTabButtonText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
    color: theme.tint,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: Spacing.l,
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '30%',
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundPaper,
    borderWidth: 1,
    borderColor: theme.border,
  },
  summaryNumber: {
    fontSize: ResponsiveFontSizes.header1,
    fontWeight: Fonts.weights.bold,
    color: theme.accent,
  },
  summaryLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.s,
    color: theme.text,
  },
  vendorList: {
    flex: 1,
    paddingHorizontal: Spacing.l,
  },
  vendorCard: {
    backgroundColor: theme.background,
    borderRadius: BorderRadius.l,
    marginBottom: Spacing.m,
    padding: Spacing.m,
    borderColor: theme.border,
    borderWidth: 1,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorIconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: BorderRadius.m,
    backgroundColor: theme.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  vendorIcon: {
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  vendorCategory: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  ratingText: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  chevronButton: {
    padding: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.divider,
    marginVertical: Spacing.m,
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.xs,

  },
  statusText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,

  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginLeft: Spacing.xs,
  },
  amountText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  homeIndicator: {
    width: moderateScale(100),
    height: moderateScale(5),
    backgroundColor: theme.text,
    borderRadius: BorderRadius.s,
    alignSelf: 'center',
    marginBottom: Spacing.s,
  },
  loader: {
    marginTop: Spacing.xl,
  },
  errorText: {
    textAlign: 'center',
    color: theme.error,
    margin: Spacing.l,
    fontSize: ResponsiveFontSizes.body,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
    margin: Spacing.l,
    fontSize: ResponsiveFontSizes.body,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  browseButton: {
    marginTop: Spacing.m,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    backgroundColor: theme.tint,
    borderRadius: BorderRadius.m,
  },
  browseButtonText: {
    color: theme.background,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createVendorManagementStyles(Colors.light);