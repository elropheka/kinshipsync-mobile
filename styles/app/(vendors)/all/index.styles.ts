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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: Colors.light.background,
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
    color: Colors.light.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
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
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    fontWeight: Fonts.weights.bold,
    color: Colors.light.buttonPrimary,
  },
  tabIndicator: { // Track for the indicator
    height: moderateScale(3),
    backgroundColor: Colors.light.divider,
    marginHorizontal: Spacing.l,
  },
  indicatorBase: { // The moving indicator
    height: '100%',
    backgroundColor: Colors.light.buttonPrimary,
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
    backgroundColor: Colors.light.backgroundPaper,
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
    color: Colors.light.text,
  },
  locationContainer: {
    backgroundColor: Colors.light.backgroundPaper,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.divider,
  },
  locationHeader: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
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
    color: Colors.light.text,
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
    color: Colors.light.text,
  },
  viewAllText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.success,
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
    backgroundColor: Colors.light.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  vendorTypeName: {
    fontSize: ResponsiveFontSizes.caption,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    marginBottom: Spacing.m,
    elevation: 2,
    shadowColor: Colors.light.text,
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
    backgroundColor: Colors.light.backgroundPrimary,
    // borderRightWidth: 1, // Optional, if a separator is desired
    // borderRightColor: Colors.light.divider,
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
    color: Colors.light.text,
  },
  sponsoredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.warning,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.s,
  },
  sponsoredText: {
    color: Colors.light.warningContrastText,
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.bold,
    marginLeft: Spacing.xxs,
  },
  vendorCategory: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },
  vendorPrice: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
    alignSelf: 'flex-start',
    color: Colors.light.buttonPrimary, // Themed price
  },
  itemPrice: { // Added style for item price
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text, // Or a specific color for price
    marginTop: Spacing.xxs,
  },
  nextButton: {
    backgroundColor: Colors.light.buttonPrimary,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.l,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.primaryContrastText, // Themed text
  },
  addButton: { // This seems like a primary action button
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    margin: Spacing.l,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.primaryContrastText,
  },
});
