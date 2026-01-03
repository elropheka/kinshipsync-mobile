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

export const createCreateNewTeamStyles = (theme: typeof Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? Spacing.s : Spacing.s + Spacing.xs,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    backgroundColor: theme.background,
  },
  backButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    flex: 1,
    color: theme.text,
  },
  headerSpacer: {
    width: IconSizes.xl,
    height: IconSizes.xl,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.l,
  },
  input: {
    width: '100%',
    height: Layout.inputHeight,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.l,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    backgroundColor: theme.backgroundLight,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    alignSelf: 'flex-start',
    marginBottom: Spacing.m,
    color: theme.text,
  },
  contactSelectorPlaceholder: {
    width: '100%',
    minHeight: moderateScale(150),
    borderColor: theme.divider,
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper,
  },
  contactSelectorText: {
    color: theme.textSecondary,
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

  pickerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: Layout.inputHeight,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.l,
    backgroundColor: 'white',
  },
  pickerInputText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
  },
  pickerInputIcon: {
    marginLeft: Spacing.s,
  },
  picker: {
    width: '100%',
    backgroundColor: theme.backgroundPaper,
    color: theme.text,
  },
  iconPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.l,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.xs,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: BorderRadius.m,
    width: '100%',
    height: Layout.inputHeight,
    backgroundColor: 'white',
  },
  selectedIconPreview: {
    marginRight: Spacing.m,
    padding: Spacing.xs,
  },
  errorText: {
    color: theme.error,
    textAlign: 'center',
    marginVertical: Spacing.m,
    fontSize: ResponsiveFontSizes.body,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: theme.backgroundPaper,
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
    borderBottomColor: theme.divider,
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  modalDoneButton: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.primary,
    fontWeight: Fonts.weights.medium,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createCreateNewTeamStyles(Colors.light);