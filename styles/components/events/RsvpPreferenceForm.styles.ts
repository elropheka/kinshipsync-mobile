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

export const createRsvpPreferenceFormStyles = (theme: typeof Colors.light) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Standard overlay, keep as is or add to Colors
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.background,
    borderTopLeftRadius: BorderRadius.l,
    borderTopRightRadius: BorderRadius.l,
    paddingTop: Spacing.s,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    maxHeight: '90%',
    minHeight: '60%', // Consider using Layout.SCREEN_HEIGHT * 0.6
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
  eventNameText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.m,
    fontWeight: Fonts.weights.medium,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  inputContainer: {
    marginBottom: Spacing.l,
  },
  inputLabel: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    marginBottom: Spacing.s,
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
  statusSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.s,
  },
  statusButton: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
  },
  statusButtonSelected: {
    backgroundColor: theme.buttonPrimary,
  },
  statusButtonText: {
    color: theme.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  statusButtonTextSelected: {
    color: theme.primaryContrastText,
  },
  dietaryOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Keep as is
  },
  dietaryOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.l,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    marginRight: Spacing.s,
    marginBottom: Spacing.s,
  },
  dietaryOptionButtonSelected: {
    backgroundColor: theme.buttonPrimary,
  },
  dietaryOptionText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
  },
  dietaryOptionTextSelected: {
    color: theme.primaryContrastText,
  },
  checkIcon: {
    marginLeft: Spacing.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
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
});

// For backwards compatibility, export the light theme styles
export const styles = createRsvpPreferenceFormStyles(Colors.light);