import { StyleSheet} from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const createEventDetailsStyles = (theme: typeof Colors.light) => StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.m,
    backgroundColor: theme.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.xs,
    color: theme.text,
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.backgroundLight,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    margin: Spacing.m,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  title: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.s,
    backgroundColor: theme.backgroundPaper,
    borderColor: theme.primary,
  },
  detailHeaderImage: {
    width: '100%',
    height: moderateScale(180), // Using moderateScale for responsiveness
    borderRadius: BorderRadius.m, // Using predefined BorderRadius
    marginBottom: Spacing.m, // Using predefined Spacing
    backgroundColor: theme.divider, // Placeholder color
    alignSelf: 'center', // Center if the container is wider
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
    borderColor: theme.buttonPrimary,
  },
  icon: {
    marginRight: Spacing.s,
  },
  detailText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
  },
  detailTextBold: { // Added
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text, // Bolder text might use primary text color
    fontWeight: Fonts.weights.semiBold,
  },
  descriptionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
    marginTop: Spacing.m,
    marginBottom: Spacing.xs,
  },
  descriptionText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
    lineHeight: ResponsiveFontSizes.subtitle * 1.5,
    marginBottom: Spacing.m,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.s,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    backgroundColor: theme.backgroundPaper,
  },
  deadlineTextDefault: {
    color: theme.text,
    fontWeight: Fonts.weights.medium,
    fontSize: ResponsiveFontSizes.body,
  },
  deadlineTextUrgent: {
    color: theme.error,
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.body,
  },
  deadlineTextPassed: {
    color: theme.textSecondary,
    fontStyle: 'italic',
    fontSize: ResponsiveFontSizes.body,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.title,
    color: theme.error,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  backButtonInline: {
    marginTop: Spacing.l,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.s,
    alignSelf: 'center',
  },
  backButtonText: {
    color: theme.primaryContrastText,
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.m,
    marginHorizontal: Spacing.m,
    marginBottom: Spacing.s,
    elevation: 2,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(2),
  },
  navButtonIcon: {
    marginRight: Spacing.m,
  },
  navButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    // Color is set inline in component to use appropriate contrast for each button
  },
  scheduleButton: {
    backgroundColor: theme.success,
  },
  ideasButton: {
    backgroundColor: theme.warning,
  },
  rsvpButton: {
    backgroundColor: theme.info,
  },
  seatingButton: { // Added for the new button
    backgroundColor: theme.tertiary, // Or any other distinct color
  },
  centerContent: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.l,
    marginBottom: Spacing.m,
    paddingHorizontal: Spacing.xs, 
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    marginLeft: Spacing.m,
    padding: Spacing.xs,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s, 
     backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
    borderRadius: BorderRadius.s,
  },
  taskTitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.text,
  },
  taskDescription: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
  },
  taskDueDate: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.warning, 
    marginTop: Spacing.xxs,
  },
  taskAssignedTo: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.info,
    marginTop: Spacing.xxs,
    fontStyle: 'italic',
  },
  taskSeparator: {
    height: 1,
    backgroundColor: theme.divider,
    marginLeft: Spacing.s, 
    marginRight: Spacing.s,
  },
  emptyListText: {
    textAlign: 'center',
    color: theme.textSecondary,
    paddingVertical: Spacing.l,
    fontSize: ResponsiveFontSizes.body,
  },
  ideaItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
    borderRadius: BorderRadius.s,

  },
  ideaContent: {
    flex: 1,
    marginRight: Spacing.m,
  },
  ideaTitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
    marginBottom: Spacing.xxs,
  },
  ideaDescription: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginBottom: Spacing.xs,
  },
  ideaSubmittedBy: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary, 
    fontStyle: 'italic',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCount: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.text,
    marginHorizontal: Spacing.s,
    minWidth: moderateScale(20), 
    textAlign: 'center',
  },
  teamItemContainer: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
    borderRadius: BorderRadius.s,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  teamName: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  teamMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.l, 
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  
  },
  teamMemberName: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  emptyListTextSmall: {
    textAlign: 'center',
    color: theme.textSecondary,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.caption,
    fontStyle: 'italic',
  },
  // Styles for Member Management Modal
  modalSubtitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
    paddingHorizontal: Spacing.l,
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
  },
  roleSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.m,
    marginVertical: Spacing.m,
  },
  roleButton: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
  },
  roleButtonSelected: {
    backgroundColor: theme.buttonPrimary,
  },
  roleButtonText: {
    color: theme.buttonPrimary,
    fontSize: ResponsiveFontSizes.body,
  },
  roleButtonTextSelected: {
    color: theme.primaryContrastText,
    fontWeight: Fonts.weights.bold,
  },
  // Re-add headerButton and headerButtonText if they were specific to the modal
  // and not the main screen header, assuming they are used in the member picker modal.
  // If the modal uses the same styles.header and styles.headerTitle, these are not needed.
  // However, the error messages suggest they might be used in the modal header.
  headerButton: { // Copied from EventTeamForm for consistency if used in modal
    padding: 5,
  },
  headerButtonText: { // Copied from EventTeamForm
    fontSize: 16,
    color: theme.buttonPrimary,
    fontWeight: '600',
  },
  // Styles for Member Management Modal are already defined above.
  // Styles for Theme Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  themeItem: {
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  themeItemSelected: {
    backgroundColor: theme.tint + '30', // Light tint for selected
  },
  themeName: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: Spacing.m,
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.s,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
  },
  welcomeMessageContainer: {
    marginVertical: Spacing.m,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.s,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
  },
  sectionContainer: {
    marginTop: Spacing.m,
    paddingTop: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createEventDetailsStyles(Colors.light);
