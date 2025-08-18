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
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,

    paddingBottom: 20,
    backgroundColor: Colors.light.backgroundLight,
  },
  backButton: {

  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textDarkContrast,
    marginRight: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 24,
    backgroundColor: Colors.light.backgroundLight,
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
    borderTopColor: Colors.light.icon,
  },
  activeTab: {
    borderTopColor: Colors.light.accent,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  activeTabText: {
    color: Colors.light.accent,
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.light.textDarkContrast,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.light.neutralBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    padding: 16,
    fontSize: 16,
    color: Colors.light.textDarkContrast,
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
    color: Colors.light.icon,
  },
  datePickerTextSelected: {
    color: Colors.light.textDarkContrast,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: Colors.light.icon,
  },
  nextButton: {
    backgroundColor: Colors.light.accent,
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
    color: Colors.light.neutralBg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.neutralBg,
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
    borderBottomColor: Colors.light.icon,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textDarkContrast,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundLight,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.textDarkContrast,
  },

  iosPickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  iosPickerModalContent: {
    backgroundColor: Colors.light.neutralBg,
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
    borderBottomColor: Colors.light.icon,
  },
  iosPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textDarkContrast,
  },
  iosPickerButtonText: {
    fontSize: 16,

  },
  requiredStar: {
    color: Colors.light.error,
    marginLeft: Spacing.xxs,
  },
  disabledButton: {
    backgroundColor: Colors.light.textSecondary,
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
    borderColor: Colors.light.buttonPrimary,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  visibilityOptionButtonSelected: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  visibilityOptionText: {
    color: Colors.light.buttonPrimary,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  visibilityOptionTextSelected: {
    color: Colors.light.primaryContrastText,
    fontWeight: Fonts.weights.bold,
  },

  themeItemButton: {
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.light.divider,
    borderRadius: BorderRadius.s,
    marginBottom: Spacing.s,
    alignItems: 'center',
  },
  themeItemButtonSelected: {
    borderColor: Colors.light.buttonPrimary,
    backgroundColor: Colors.light.buttonPrimary + '20',
  },
  themeItemText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  themeItemTextSelected: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.buttonPrimary,
    fontWeight: Fonts.weights.bold,
  },

  previousButton: {
    backgroundColor: Colors.light.backgroundPaper,
    borderColor: Colors.light.buttonPrimary,
    borderWidth: 1,
    marginRight: Spacing.m,
    flex: 1,
  },
  previousButtonText: {
    color: Colors.light.buttonPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
