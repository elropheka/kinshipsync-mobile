import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  Layout,
  moderateScale,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    // paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: Colors.light.backgroundLight,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
    // flex: 1, // Add if title needs to take up space for centering with other elements
    // textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundLight,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: moderateScale(3),
    borderBottomColor: Colors.light.accentHighlight,
  },
  tabText: {
    fontWeight: Fonts.weights.medium,
    color: Colors.light.textSecondary,
    fontSize: ResponsiveFontSizes.body,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.neutralBg,
    marginHorizontal: Spacing.m,
    marginVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    height: Layout.inputHeight, // Using standard input height
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.m,
    marginTop: Spacing.m,
    marginBottom: Spacing.m,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: Colors.light.buttonPrimary + '1A',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
  },
  selectedFilter: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  filterText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.buttonPrimary,
  },
  activeFilterText: {
    color: Colors.light.primaryContrastText,
  },
  addEventButton: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  addEventText: { // Consider renaming
    color: Colors.light.accentContrastText,
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  guestCountContainer: {
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  guestCount: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.s,
    color: Colors.light.text,
  },
  progressBar: {
    height: moderateScale(4),
    backgroundColor: Colors.light.divider,
    borderRadius: BorderRadius.s,
  },
  progressFill: {
    width: '60%', // Example progress
    height: '100%',
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.s,
  },
  guestList: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Layout.buttonHeight + Spacing.xxl, // Ensure space for BottomNavigation + FAB
    flex: 1, // Ensure list takes available space
  },
  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  guestItemPressed: {
    backgroundColor: Colors.light.border, // This is gray-300 (#D1D5DB)
  },
  guestName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  guestEvent: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
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
    // backgroundColor is set dynamically
  },
  statusText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    // color is set dynamically
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  // Styles for Event Selection List
  eventListContainer: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Layout.buttonHeight + Spacing.xxl, 
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.l, // Increased padding for better touchability
    backgroundColor: Colors.light.backgroundLight, // Or Colors.light.card for distinct items
  },
  eventName: {
    fontSize: ResponsiveFontSizes.subtitle, // Slightly larger for event names
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
    marginBottom: Spacing.xxs, // Small margin if date is below
  },
  eventDate: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
});
