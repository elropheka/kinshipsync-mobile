import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import Fonts from '@/constants/fonts'; // Assuming fonts.ts is in constants
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  Layout,
  moderateScale,
} from '@/constants/dimensions'; // Assuming dimensions.ts is in constants

export const createIndexStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: Spacing.l,
  //   paddingVertical: Spacing.m,
  //   // paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
  //   backgroundColor: theme.backgroundLight,
  // },
  searchContainerExternal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.neutralBg,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    marginBottom: Spacing.s, // Changed from marginVertical to remove top margin
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    height: Layout.inputHeight,
  },
  searchIconExternal: {
    marginRight: Spacing.s,
  },
  searchInputExternal: {
    flex: 1,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  headerButton: {
    padding: Spacing.xs,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
    paddingBottom: Spacing.m,
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '31%',
    padding: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor is set dynamically
    borderWidth: 1, // Added for definition
    borderColor: theme.border, // Added for definition
  },
  summaryNumber: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    // color is set dynamically
  },
  summaryLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.l,
    // marginTop: Spacing.s, // Removed to reduce space if it's the first element
    borderBottomWidth: 1, // Added border for tab container itself
    borderBottomColor: theme.divider, // Added border for tab container
  },
  tab: {
    paddingVertical: Spacing.m,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    // borderBottomWidth: 2, // Handled by tabIndicator
    // borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
  },
  activeTabText: {
    color: theme.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  tabIndicatorContainer: {
    position: 'relative',
    height: moderateScale(3),
    backgroundColor: theme.divider,
    marginHorizontal: Spacing.l,
  },
  tabIndicator: {
    position: 'absolute',
    width: '33.3%',
    height: moderateScale(3),
    backgroundColor: theme.buttonPrimary,
    borderRadius: moderateScale(1.5),
  },
  eventsList: {
    paddingTop: Spacing.m,
    flex: 1,
    paddingHorizontal: Spacing.l,
    // paddingTop: Spacing.m, // Removed to reduce space below header
  },
  eventCard: {
    backgroundColor: theme.background,
    borderRadius: BorderRadius.l,
    marginBottom: Spacing.l,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(5),
    elevation: 2,
    overflow: 'hidden',
  },
  eventImageContainer: {
    width: '100%',
    height: moderateScale(150),
    backgroundColor: theme.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTypeTag: {
    position: 'absolute',
    top: Spacing.m,
    left: Spacing.m,
    backgroundColor: Colors.dark.background + '99',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
  },
  eventTypeText: {
    color: Colors.dark.text,
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.medium,
  },
  eventDetails: {
    padding: Spacing.m,
  },
  eventTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.s,
    color: theme.text,
  },
  eventInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.s,
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventInfoText: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  statusContainer: { // Re-using from other files, ensure consistency or make specific
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
  progressContainer: {
    marginTop: Spacing.m,
  },
  progressBackground: {
    height: moderateScale(6),
    backgroundColor: theme.divider,
    borderRadius: BorderRadius.s,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.s,
  },
  progressText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  noEventsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  noEventsText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
    marginTop: Spacing.m,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: Spacing.xxl + Spacing.l,
    right: Spacing.l,
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.buttonPrimary,
    shadowOffset: { width: 0, height: moderateScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(5),
    elevation: 5,
  },
  addButtonText: {
    color: theme.primaryContrastText,
    fontWeight: Fonts.weights.bold,
    marginLeft: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.error, // Ensure theme.error exists
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
  noEventsSubText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createIndexStyles(Colors.light);