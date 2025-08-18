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

    backgroundColor: Colors.light.backgroundLight,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,

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
    height: Layout.inputHeight,
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
  addEventText: {
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
    width: '60%',
    height: '100%',
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.s,
  },
  guestList: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Layout.buttonHeight + Spacing.xxl,
    flex: 1,
  },
  guestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  guestItemPressed: {
    backgroundColor: Colors.light.border,
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

  },
  statusText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,

  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },

  eventListContainer: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Layout.buttonHeight + Spacing.xxl, 
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.l,
    backgroundColor: Colors.light.backgroundLight,
  },
  eventName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
    marginBottom: Spacing.xxs,
  },
  eventDate: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
});
