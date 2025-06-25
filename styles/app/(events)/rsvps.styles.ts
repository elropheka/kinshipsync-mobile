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
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
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
    backgroundColor: Colors.light.backgroundPaper,
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
    color: Colors.light.text,
    fontSize: ResponsiveFontSizes.subtitle,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: Colors.light.info + '1A',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
  },
  selectedFilter: {
    backgroundColor: Colors.light.info,
  },
  filterText: { // Text for non-selected filter
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.info,
  },
  // activeFilterText: { // Text for selected filter, if different
  //   color: Colors.light.infoContrastText,
  // },
  itemCountContainer: {
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  itemCount: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.s,
    color: Colors.light.text,
  },
  listContainer: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.xxl + Spacing.l,
    flex: 1, // Ensure list takes available space
  },
  rsvpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  rsvpInfo: {
    flex: 1,
    marginRight: Spacing.s,
  },
  guestName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  eventName: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  preferencesSummary: {
    marginTop: Spacing.xs,
  },
  preferenceText: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.xxs,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.accentHighlight,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.s,
    borderRadius: BorderRadius.l,
    marginTop: Spacing.s,
    alignSelf: 'flex-start',
  },
  reminderButtonText: {
    color: Colors.light.text,
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.xs,
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
    // marginLeft: Spacing.m, // If separator should not span full width
  },
});
