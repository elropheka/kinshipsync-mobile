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

export const createScheduleItemFormStyles = (theme: typeof Colors.light) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.dark.background + '80', // Standard overlay with 50% opacity
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.background,
    borderTopLeftRadius: BorderRadius.l,
    borderTopRightRadius: BorderRadius.l,
    paddingTop: Spacing.s,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    maxHeight: '90%',
    minHeight: '60%', // Consider Layout.SCREEN_HEIGHT * 0.6
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  inputContainer: {
    marginBottom: Spacing.m,
  },
  inputLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
    marginBottom: Spacing.xs,
    fontWeight: Fonts.weights.medium,
  },
  input: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
  },
  multilineInput: {
    minHeight: moderateScale(80),
    textAlignVertical: 'top',
  },
  datePickerInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    color: theme.text,
    fontSize: ResponsiveFontSizes.subtitle,
  },
  submitButton: {
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.m,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  submitButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.primaryContrastText,
  },
  iosPickerModalOverlay: {
    flex: 1,
    backgroundColor: Colors.dark.background + '66', // Standard overlay with 40% opacity
    justifyContent: 'flex-end',
  },
  iosPickerModalContent: {
    backgroundColor: theme.background,
    borderTopLeftRadius: BorderRadius.l,
    borderTopRightRadius: BorderRadius.l,
    paddingVertical: Spacing.s,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  iosPickerTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  iosPickerButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.buttonPrimary,
    paddingVertical: Spacing.xs,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createScheduleItemFormStyles(Colors.light);