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
    paddingBottom: Spacing.m,
    // paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.xs,
    color: Colors.light.text,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  banner: {
    height: moderateScale(220),
    backgroundColor: Colors.light.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tagContainer: {
    position: 'absolute',
    top: Spacing.l,
    left: Spacing.l,
    backgroundColor: Colors.light.textSecondary,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
  },
  tagText: {
    color: Colors.light.background,
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
    // backgroundColor: Colors.light.background + '80', // Semi-transparent white
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
    color: Colors.light.text,
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
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.success,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
    fontWeight: Fonts.weights.medium,
  },
  progressContainer: {
    marginBottom: Spacing.xl,
  },
  progressBar: {
    height: moderateScale(12),
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.s,
    overflow: 'hidden',
    marginBottom: Spacing.s,
  },
  progressFill: {
    width: '75%', // Example progress
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.s,
  },
  progressText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    textAlign: 'right',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  tab: {
    paddingVertical: Spacing.m,
    marginRight: Spacing.l,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.textSecondary,
  },
  activeTabText: {
    color: Colors.light.primary,
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
    color: Colors.light.text,
  },
  sectionText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
    lineHeight: ResponsiveFontSizes.subtitle * 1.5,
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    alignItems: 'center',
  },
  venueImagePlaceholder: {
    width: moderateScale(80),
    height: moderateScale(80),
    backgroundColor: Colors.light.divider,
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
    color: Colors.light.text,
  },
  venueAddress: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.s,
  },
  directionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    alignSelf: 'flex-start',
  },
  directionButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  notesCard: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
  },
  notesText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
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
    color: Colors.light.textSecondary,
  },
  timelineDot: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.primary,
    marginRight: Spacing.m,
    marginTop: moderateScale(2),
  },
  timelineConnector: {
    width: moderateScale(2),
    height: moderateScale(30),
    backgroundColor: Colors.light.divider,
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
    color: Colors.light.text,
  },
  eventDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
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
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
  },
  addGuestButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  addGuestButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.s,
  },
  guestListTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.m,
    color: Colors.light.text,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  guestInitials: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  initialsText: {
    color: Colors.light.primaryContrastText,
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
    color: Colors.light.text,
  },
  guestDetails: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
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
    color: Colors.light.primary,
  },
  taskProgressLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
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
    color: Colors.light.text,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  taskCompleted: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.m,
    textDecorationLine: 'line-through',
  },
  taskIncomplete: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
    marginLeft: Spacing.m,
  },
  addTaskButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskButtonText: {
    color: Colors.light.primaryContrastText,
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
    // backgroundColor: Colors.light.backgroundPaper, // Optional
  },
  extraButtonText: {
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    width: '60%',
    alignItems: 'stretch',
    shadowColor: Colors.light.text,
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
    borderBottomColor: Colors.light.divider,
  },
  popoverButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.primary,
  },
  lastPopoverButton: {
    borderBottomWidth: 0,
  },
});
