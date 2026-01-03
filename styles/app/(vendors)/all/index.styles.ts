import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import Fonts from '@/constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  Layout,
  moderateScale,
} from '@/constants/dimensions';

export const createIndexStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: theme.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.s,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    marginRight: Spacing.xl,
    color: theme.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.background,
  },
  tabBase: { // Base style for tabs
    paddingVertical: Spacing.m,
    flex: 1,
    alignItems: 'center',
  },
  tab: {
    // Inherits from tabBase
  },
  tabActive: {
    // Inherits from tabBase
    // Active state handled by indicator and text style
  },
  tabTextBase: {
    fontSize: ResponsiveFontSizes.subtitle,
  },
  tabText: {
    fontWeight: Fonts.weights.medium,
    color: theme.textSecondary,
  },
  tabTextActive: {
    fontWeight: Fonts.weights.bold,
    color: theme.buttonPrimary,
  },
  tabIndicator: { // Track for the indicator
    height: moderateScale(3),
    backgroundColor: theme.divider,
    marginHorizontal: Spacing.l,
  },
  indicatorBase: { // The moving indicator
    height: '100%',
    backgroundColor: theme.buttonPrimary,
    width: '50%', // Assuming 2 tabs, adjust if more
    position: 'absolute',
    bottom: 0,
    borderRadius: moderateScale(1.5),
  },
  activeIndicatorLeft: { // For positioning the indicator
    left: 0,
  },
  activeIndicatorRight: { // For positioning the indicator
    right: 0,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper,
    marginHorizontal: Spacing.l,
    marginVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    height: Layout.inputHeight,
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
  },
  locationContainer: {
    backgroundColor: theme.backgroundPaper,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.divider,
  },
  locationHeader: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.xs,
    color: theme.text,
  },
  sectionContainer: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  viewAllText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.success,
    fontWeight: Fonts.weights.medium,
  },
  vendorTypesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Or 'space-around' if more spacing needed
    marginTop: Spacing.m,
    flexWrap: 'wrap', // Allow wrapping if items exceed width
  },
  vendorTypeItem: {
    alignItems: 'center',
    width: '20%', // Adjust if number of items changes
    marginBottom: Spacing.m, // Added for vertical spacing if wrapped
  },
  vendorTypeIconContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  vendorTypeName: {
    fontSize: ResponsiveFontSizes.caption,
    textAlign: 'center',
    color: theme.textSecondary,
  },
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundLight,
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    marginBottom: Spacing.m,
    elevation: 2,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    alignItems: 'center',
  },
  vendorImageContainer: {
    width: moderateScale(85),
    height: moderateScale(85),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundPrimary,
    // borderRightWidth: 1, // Optional, if a separator is desired
    // borderRightColor: theme.divider,
  },
  vendorContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.m,
  },
  vendorInfo: {
    flex: 1,
    marginRight: Spacing.s, // Add space before price
  },
  vendorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  vendorName: {
    fontSize: ResponsiveFontSizes.subtitle - 1,
    fontWeight: Fonts.weights.bold,
    marginRight: Spacing.xs,
    color: theme.text,
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.warning,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.s,
  },
  sponsoredText: {
    color: theme.warningContrastText,
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.bold,
    marginLeft: Spacing.xxs,
  },
  vendorCategory: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginBottom: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginLeft: Spacing.xs,
  },
  vendorPrice: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
    alignSelf: 'flex-start',
    color: theme.buttonPrimary, // Themed price
  },
  itemPrice: { // Added style for item price
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text, // Or a specific color for price
    marginTop: Spacing.xxs,
  },
  nextButton: {
    backgroundColor: theme.buttonPrimary,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: theme.primaryContrastText, // Themed text
  },
  addButton: { // This seems like a primary action button
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    margin: Spacing.l,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.primaryContrastText,
  },
  loadMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.m,
    gap: Spacing.s,
  },
  loadingText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createIndexStyles(Colors.light);