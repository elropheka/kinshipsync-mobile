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

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Standard overlay, keep as is or add to Colors
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
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
    borderBottomColor: Colors.light.divider,
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
  },
  eventNameText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.textSecondary,
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
    color: Colors.light.text,
    marginBottom: Spacing.s,
    fontWeight: Fonts.weights.medium,
  },
  input: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
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
    borderColor: Colors.light.buttonPrimary,
  },
  statusButtonSelected: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  statusButtonText: {
    color: Colors.light.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  statusButtonTextSelected: {
    color: Colors.light.primaryContrastText,
  },
  dietaryOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Keep as is
  },
  dietaryOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.l,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    marginRight: Spacing.s,
    marginBottom: Spacing.s,
  },
  dietaryOptionButtonSelected: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  dietaryOptionText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  dietaryOptionTextSelected: {
    color: Colors.light.primaryContrastText,
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
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.m,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  submitButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.primaryContrastText,
  },
});
