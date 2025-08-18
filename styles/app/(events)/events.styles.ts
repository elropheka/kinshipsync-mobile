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
    height: Layout.inputHeight,
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
  filterText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.info,
  },
  
  addEventButton: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: Spacing.m,
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
    flex: 1,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  eventName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  eventDate: {
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
  eventLocationText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
  },
  eventOrganizerText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
    fontStyle: 'italic',
  },
  eventGuestCount: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
    fontWeight: Fonts.weights.medium,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  retryButton: {
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
  },
  retryButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  emptyStateText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
