import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from '@/constants/dimensions';
import Fonts from '@/constants/fonts';

export const createVendorItemFormStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: Colors.dark.background + '80',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: BorderRadius.l,
      borderTopRightRadius: BorderRadius.l,
      paddingTop: Spacing.s,
      paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
      maxHeight: '92%',
      minHeight: '55%',
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
      flex: 1,
      paddingRight: Spacing.s,
    },
    stepText: {
      fontSize: ResponsiveFontSizes.caption,
      color: theme.textSecondary,
      marginTop: 2,
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
      minHeight: moderateScale(96),
      textAlignVertical: 'top',
    },
    pickerButton: {
      backgroundColor: theme.backgroundPaper,
      borderRadius: BorderRadius.m,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: Spacing.m,
      paddingHorizontal: Spacing.m,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickerButtonText: {
      fontSize: ResponsiveFontSizes.subtitle,
      color: theme.text,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: Spacing.s,
      paddingHorizontal: Spacing.l,
      paddingTop: Spacing.s,
    },
    secondaryButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: BorderRadius.m,
      paddingVertical: Spacing.m,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: theme.text,
      fontSize: ResponsiveFontSizes.body,
      fontWeight: Fonts.weights.medium,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: theme.accent,
      borderRadius: BorderRadius.m,
      paddingVertical: Spacing.m,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: '#fff',
      fontSize: ResponsiveFontSizes.body,
      fontWeight: Fonts.weights.semiBold,
    },
    disabledButton: {
      opacity: 0.6,
    },
    pickerModalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: Colors.dark.background + '80',
    },
    pickerModalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: BorderRadius.l,
      borderTopRightRadius: BorderRadius.l,
      paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    },
    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.l,
      paddingVertical: Spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    pickerDoneText: {
      color: theme.accent,
      fontSize: ResponsiveFontSizes.body,
      fontWeight: Fonts.weights.semiBold,
    },
  });
