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

export const createCreateEventStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.neutralBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,

    paddingBottom: 20,
    backgroundColor: theme.background,
  },
  backButton: {

  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.textDarkContrast,
    marginRight: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 24,
    backgroundColor: theme.background,
    paddingVertical: 10,
  },
  scrollableContent: {
    flex: 1,
  },
  tabItem: {
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 4,
    borderTopColor: theme.icon,
  },
  activeTab: {
    borderTopColor: theme.accent,
  },
  tabText: {
    fontSize: 14,
    color: theme.icon,
    marginBottom: 8,
  },
  activeTabText: {
    color: theme.accent,
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: theme.neutralBg,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: theme.textDarkContrast,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.neutralBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.icon,
    padding: 16,
    fontSize: 16,
    color: theme.textDarkContrast,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    color: theme.icon,
  },
  datePickerTextSelected: {
    color: theme.textDarkContrast,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: theme.icon,
  },
  nextButton: {
    backgroundColor: theme.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
    height: 50,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.neutralBg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.neutralBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.icon,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textDarkContrast,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.backgroundLight,
  },
  optionText: {
    fontSize: 16,
    color: theme.textDarkContrast,
  },

  iosPickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  iosPickerModalContent: {
    backgroundColor: theme.neutralBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.icon,
  },
  iosPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textDarkContrast,
  },
  iosPickerButtonText: {
    fontSize: 16,

  },
  requiredStar: {
    color: theme.error,
    marginLeft: Spacing.xxs,
  },
  disabledButton: {
    backgroundColor: theme.textSecondary,
  },

  visibilitySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.m,
  },
  visibilityOptionButton: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  visibilityOptionButtonSelected: {
    backgroundColor: theme.buttonPrimary,
  },
  visibilityOptionText: {
    color: theme.buttonPrimary,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  visibilityOptionTextSelected: {
    color: theme.primaryContrastText,
    fontWeight: Fonts.weights.bold,
  },

  themeItemButton: {
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: theme.divider,
    borderRadius: BorderRadius.s,
    marginBottom: Spacing.s,
    alignItems: 'center',
  },
  themeItemButtonSelected: {
    borderColor: theme.buttonPrimary,
    backgroundColor: theme.buttonPrimary + '20',
  },
  themeItemText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
  },
  themeItemTextSelected: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.buttonPrimary,
    fontWeight: Fonts.weights.bold,
  },

  previousButton: {
    backgroundColor: theme.backgroundPaper,
    borderColor: theme.buttonPrimary,
    borderWidth: 1,
    marginRight: Spacing.m,
    flex: 1,
  },
  previousButtonText: {
    color: theme.buttonPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createCreateEventStyles(Colors.light);