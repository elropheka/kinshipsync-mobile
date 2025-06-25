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
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
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
    color: Colors.light.text,
  },
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    margin: Spacing.m,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: moderateScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  title: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  detailHeaderImage: {
    width: '100%',
    height: moderateScale(180), // Using moderateScale for responsiveness
    borderRadius: BorderRadius.m, // Using predefined BorderRadius
    marginBottom: Spacing.m, // Using predefined Spacing
    backgroundColor: Colors.light.divider, // Placeholder color
    alignSelf: 'center', // Center if the container is wider
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
    borderColor: Colors.light.buttonPrimary,
  },
  icon: {
    marginRight: Spacing.s,
  },
  detailText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.textSecondary,
  },
  detailTextBold: { // Added
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text, // Bolder text might use primary text color
    fontWeight: Fonts.weights.semiBold,
  },
  descriptionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
    marginTop: Spacing.m,
    marginBottom: Spacing.xs,
  },
  descriptionText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.backgroundPaper,
  },
  deadlineTextDefault: {
    color: Colors.light.text,
    fontWeight: Fonts.weights.medium,
    fontSize: ResponsiveFontSizes.body,
  },
  deadlineTextUrgent: {
    color: Colors.light.error,
    fontWeight: Fonts.weights.bold,
    fontSize: ResponsiveFontSizes.body,
  },
  deadlineTextPassed: {
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    fontSize: ResponsiveFontSizes.body,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.title,
    color: Colors.light.error,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  backButtonInline: {
    marginTop: Spacing.l,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.s,
    alignSelf: 'center',
  },
  backButtonText: {
    color: Colors.light.primaryContrastText,
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
    shadowColor: Colors.light.text,
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
    color: Colors.light.primaryContrastText,
  },
  scheduleButton: {
    backgroundColor: Colors.light.success,
  },
  ideasButton: {
    backgroundColor: Colors.light.warning,
  },
  rsvpButton: {
    backgroundColor: Colors.light.info,
  },
  seatingButton: { // Added for the new button
    backgroundColor: Colors.light.tertiary, // Or any other distinct color
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
    color: Colors.light.text,
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
     backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.s,
  },
  taskTitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.text,
  },
  taskDescription: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
  },
  taskDueDate: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.warning, 
    marginTop: Spacing.xxs,
  },
  taskSeparator: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginLeft: Spacing.s, 
    marginRight: Spacing.s,
  },
  emptyListText: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    paddingVertical: Spacing.l,
    fontSize: ResponsiveFontSizes.body,
  },
  ideaItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.s,

  },
  ideaContent: {
    flex: 1,
    marginRight: Spacing.m,
  },
  ideaTitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
    marginBottom: Spacing.xxs,
  },
  ideaDescription: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  ideaSubmittedBy: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary, 
    fontStyle: 'italic',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCount: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.text,
    marginHorizontal: Spacing.s,
    minWidth: moderateScale(20), 
    textAlign: 'center',
  },
  teamItemContainer: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
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
    color: Colors.light.text,
  },
  teamMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.l, 
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  
  },
  teamMemberName: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
  },
  emptyListTextSmall: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.caption,
    fontStyle: 'italic',
  },
  // Styles for Member Management Modal
  modalSubtitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
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
    borderColor: Colors.light.buttonPrimary,
  },
  roleButtonSelected: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  roleButtonText: {
    color: Colors.light.buttonPrimary,
    fontSize: ResponsiveFontSizes.body,
  },
  roleButtonTextSelected: {
    color: Colors.light.primaryContrastText,
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
    color: Colors.light.buttonPrimary,
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
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  themeItem: {
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  themeItemSelected: {
    backgroundColor: Colors.light.tint + '30', // Light tint for selected
  },
  themeName: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: Spacing.m,
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.s,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
  },
  welcomeMessageContainer: {
    marginVertical: Spacing.m,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.s,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
  },
  sectionContainer: {
    marginTop: Spacing.m,
    paddingTop: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
});
