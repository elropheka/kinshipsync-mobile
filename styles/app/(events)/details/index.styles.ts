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

export const createIndexStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.m,
    // paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: theme.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.xs,
    color: theme.text,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  banner: {
    height: moderateScale(220),
    backgroundColor: theme.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tagContainer: {
    position: 'absolute',
    top: Spacing.l,
    left: Spacing.l,
    backgroundColor: theme.textSecondary,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
  },
  tagText: {
    color: theme.background,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  heartContainer: { // Assuming this is for a heart icon button
    justifyContent: 'center',
    alignItems: 'center',
    // Example: position absolute if it overlays banner
    // position: 'absolute',
    // top: Spacing.l,
    // right: Spacing.l,
    // backgroundColor: theme.background + '80', // Semi-transparent white
    // padding: Spacing.s,
    // borderRadius: BorderRadius.round,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.l,
  },
  eventTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    marginTop: Spacing.l,
    marginBottom: Spacing.m,
    color: theme.text,
  },
  detailsContainer: {
    marginBottom: Spacing.l,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  detailText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
    marginLeft: Spacing.s,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  statusDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.success,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    fontWeight: Fonts.weights.medium,
  },
  progressContainer: {
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: moderateScale(12),
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.s,
    overflow: 'hidden',
    marginBottom: Spacing.s,
  },
  progressFill: {
    width: '75%', // Example progress
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: BorderRadius.s,
  },
  progressText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    textAlign: 'right',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  tab: {
    paddingVertical: Spacing.m,
    marginRight: Spacing.l,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.primary,
  },
  tabText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
  },
  activeTabText: {
    color: theme.primary,
    fontWeight: Fonts.weights.medium,
  },
  tabContent: {
    paddingBottom: Spacing.xl,
  },
  sectionContainer: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.m,
    color: theme.text,
  },
  sectionText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    lineHeight: ResponsiveFontSizes.subtitle * 1.5,
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    alignItems: 'center',
  },
  venueImagePlaceholder: {
    width: moderateScale(80),
    height: moderateScale(80),
    backgroundColor: theme.divider,
    borderRadius: BorderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: theme.text,
  },
  venueAddress: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginBottom: Spacing.s,
  },
  directionButton: {
    backgroundColor: theme.primary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    alignSelf: 'flex-start',
  },
  directionButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  notesCard: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
  },
  notesText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    lineHeight: ResponsiveFontSizes.subtitle * 1.5,
  },
  timelineContainer: {
    paddingLeft: Spacing.m,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.s,
  },
  timeContainer: {
    width: moderateScale(80),
    paddingRight: Spacing.m,
  },
  timeText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  timelineDot: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.primary,
    marginRight: Spacing.m,
    marginTop: moderateScale(2),
  },
  timelineConnector: {
    width: moderateScale(2),
    height: moderateScale(30),
    backgroundColor: theme.divider,
    marginLeft: moderateScale(80) + moderateScale(16/2) - moderateScale(2/2), // Align with dot
    marginBottom: Spacing.s,
  },
  eventContainer: { // This seems generic, might be for timeline event text
    flex: 1,
  },
  eventName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: theme.text,
  },
  eventDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  guestsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    flex: 1, // Added to distribute space
  },
  statNumber: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.xs,
    color: theme.primary,
  },
  statLabel: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  addGuestButton: {
    flexDirection: 'row',
    backgroundColor: theme.primary,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  addGuestButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.s,
  },
  guestListTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.m,
    color: theme.text,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  guestInitials: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  initialsText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    marginBottom: Spacing.xs,
    color: theme.text,
  },
  guestDetails: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  taskStats: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  taskProgressContainer: { // This seems to be the same as taskStats, can be merged or differentiated
    alignItems: 'center',
  },
  taskProgressText: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.xs,
    color: theme.primary,
  },
  taskProgressLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  taskListContainer: {
    marginBottom: Spacing.xl,
  },
  taskCategory: {
    marginBottom: Spacing.l,
  },
  taskCategoryTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.m,
    color: theme.text,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  taskCompleted: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
    marginLeft: Spacing.m,
    textDecorationLine: 'line-through',
  },
  taskIncomplete: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    marginLeft: Spacing.m,
  },
  addTaskButton: {
    flexDirection: 'row',
    backgroundColor: theme.primary,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.s,
  },
  extraButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  extraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    borderRadius: BorderRadius.m,
    // backgroundColor: theme.backgroundPaper, // Optional
  },
  extraButtonText: {
    color: theme.textSecondary,
    marginLeft: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
  },
  popoverBackdrop: {
    flex: 1,
    backgroundColor: Colors.dark.background + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverContainer: {
    backgroundColor: theme.background,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    width: '60%',
    alignItems: 'stretch',
    shadowColor: theme.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(3.84),
    elevation: 5,
  },
  popoverButton: {
    paddingVertical: Spacing.m,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  popoverButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.primary,
  },
  lastPopoverButton: {
    borderBottomWidth: 0,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createIndexStyles(Colors.light);