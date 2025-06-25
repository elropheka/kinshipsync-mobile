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
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? Spacing.s : Spacing.s + Spacing.xs,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.background,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    flex: 1,
    color: Colors.light.text,
  },
  headerSpacer: { // To balance the back button if title is truly centered
    width: IconSizes.xl,
    height: IconSizes.xl,
  },
  container: { // For ScrollView
    flex: 1,
  },
  contentContainer: { // For ScrollView's contentContainerStyle
    padding: Spacing.l,
  },
  input: {
    width: '100%',
    height: Layout.inputHeight,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.l,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    alignSelf: 'flex-start',
    marginBottom: Spacing.m,
    color: Colors.light.text,
  },
  contactSelectorPlaceholder: {
    width: '100%',
    minHeight: moderateScale(150),
    borderColor: Colors.light.divider,
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
  },
  contactSelectorText: {
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.m,
    fontSize: ResponsiveFontSizes.body,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.l,
  },
  // Note: Specific button styles (like saveButton, cancelButton) would go here if they were in the original JSX
  // For example:
  // saveButton: {
  //   backgroundColor: Colors.light.primary,
  //   paddingVertical: Spacing.m,
  //   paddingHorizontal: Spacing.xl,
  //   borderRadius: BorderRadius.m,
  //   alignItems: 'center',
  //   flex: 1, // If they share space
  //   marginHorizontal: Spacing.s,
  // },
  // saveButtonText: {
  //   color: Colors.light.primaryContrastText,
  //   fontSize: ResponsiveFontSizes.subtitle,
  //   fontWeight: Fonts.weights.semiBold,
  // },
  pickerInputContainer: { // New style for the touchable area
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: Layout.inputHeight,
    borderColor: Colors.light.border,
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.l,
    backgroundColor: Colors.light.background,
  },
  pickerInputText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  pickerInputIcon: {
    marginLeft: Spacing.s,
  },
  picker: { // Style for the Picker component itself, potentially within a Modal
    width: '100%',
    // height: Platform.OS === 'ios' ? 200 : undefined, // iOS needs explicit height for wheel picker
    backgroundColor: Colors.light.backgroundPaper, // Or Colors.light.background for consistency
  },
  iconPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.l, // Consistent spacing
    // Removed background color, let parent handle or make it transparent
    paddingVertical: Spacing.s, // Added some vertical padding
    paddingHorizontal: Spacing.xs,
    borderColor: Colors.light.border, // Added border for consistency
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    width: '100%',
    height: Layout.inputHeight, // Consistent height
    backgroundColor: Colors.light.background,
  },
  selectedIconPreview: {
    marginRight: Spacing.m, // Consistent spacing
    padding: Spacing.xs,
    // Removed background color
  },
  errorText: {
    color: Colors.light.error, // Use theme color for error
    textAlign: 'center',
    marginVertical: Spacing.m,
    fontSize: ResponsiveFontSizes.body, // Consistent font size
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Position picker at the bottom
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.backgroundPaper,
    borderTopLeftRadius: BorderRadius.l,
    borderTopRightRadius: BorderRadius.l,
    padding: Spacing.m,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
  },
  modalDoneButton: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.primary,
    fontWeight: Fonts.weights.medium,
  },
});
