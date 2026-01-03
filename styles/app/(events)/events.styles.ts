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

export const createEventsStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: theme.backgroundLight,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,

  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    backgroundColor: theme.backgroundLight,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: moderateScale(3),
    borderBottomColor: theme.accentHighlight,
  },
  tabText: {
    fontWeight: Fonts.weights.medium,
    color: theme.textSecondary,
    fontSize: ResponsiveFontSizes.body,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper,
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
    color: theme.text,
    fontSize: ResponsiveFontSizes.subtitle,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: theme.info + '1A',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
  },
  selectedFilter: {
    backgroundColor: theme.info,
  },
  filterText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.info,
  },
  
  addEventButton: {
    backgroundColor: theme.accent,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  addEventText: {
    color: theme.accentContrastText,
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  ownershipToggle: {
    backgroundColor: theme.backgroundPaper,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  ownershipToggleActive: {
    backgroundColor: theme.primary,
  },
  ownershipToggleText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.primary,
    marginLeft: Spacing.xs,
  },
  ownershipToggleTextActive: {
    color: theme.primaryContrastText,
  },
  itemCountContainer: {
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  itemCount: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.s,
    color: theme.text,
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
    color: theme.text,
  },
  eventDate: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
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
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
  },
  eventOrganizerText: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
    fontStyle: 'italic',
  },
  eventGuestCount: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
    fontWeight: Fonts.weights.medium,
  },
  separator: {
    height: 1,
    backgroundColor: theme.divider,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  retryButton: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
  },
  retryButtonText: {
    color: theme.primaryContrastText,
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
    color: theme.textSecondary,
    textAlign: 'center',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createEventsStyles(Colors.light);