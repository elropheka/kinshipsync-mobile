import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts'; // Import Fonts
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
    // paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    paddingHorizontal: 30, // Increased padding for better spacing
    marginBottom: 24,
    backgroundColor: Colors.light.backgroundLight,
    paddingVertical: 10,
  },
  scrollableContent: {
    flex: 1,
  },
  tabItem: {
    flex: 1, // Distribute space equally
    marginRight: 6, // Small margin between tabs
    alignItems: 'center',
    paddingTop: 8, // Padding inside tab
    paddingBottom: 8, // Padding inside tab
    borderTopWidth: 4,
    borderTopColor: Colors.light.icon,
  },
  activeTab: {
    borderTopColor: Colors.light.accent,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 8, // Space below text
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
    height: 120, // Fixed height for multiline
    textAlignVertical: 'top', // Align text to top
  },
  datePickerContainer: { // For styling the TouchableOpacity acting as Date/Time picker input
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: { // Placeholder text for date/time picker
    color: Colors.light.icon,
  },
  datePickerTextSelected: { // Text when date/time is selected
    color: Colors.light.textDarkContrast,
  },
  dropdownContainer: { // For styling the TouchableOpacity acting as dropdown input
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: { // Placeholder text for dropdown
    color: Colors.light.icon,
  },
  nextButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 30, // Space above the button
    width: '100%',
    height: 50,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.neutralBg,
  },
  modalOverlay: { // For Venue and EventType modals
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: { // For Venue and EventType modals
    backgroundColor: Colors.light.neutralBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20, // Space at the bottom
    maxHeight: '80%', // Limit modal height
  },
  modalHeader: { // For Venue and EventType modals
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.icon,
  },
  modalTitle: { // For Venue and EventType modals
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textDarkContrast,
  },
  optionItem: { // For items in Venue/EventType modals
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundLight,
  },
  optionText: { // For text in Venue/EventType modal items
    fontSize: 16,
    color: Colors.light.textDarkContrast,
  },
  // Styles for iOS DateTimePicker Modal
  iosPickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  iosPickerModalContent: {
    backgroundColor: Colors.light.neutralBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20, // Add some vertical padding
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10, // Space below header items
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
    // Color is set dynamically in the component
  },
  requiredStar: {
    color: Colors.light.error, // Or your preferred color for required indicators
    marginLeft: Spacing.xxs,
  },
  disabledButton: {
    backgroundColor: Colors.light.textSecondary, // Fallback to textSecondary
  },
  // Visibility Picker Styles
  visibilitySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Or 'flex-start' and add margin to buttons
    marginBottom: Spacing.m,
  },
  visibilityOptionButton: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
    alignItems: 'center',
    flex: 1, // Make buttons take equal width if space-around
    marginHorizontal: Spacing.xs, // Add some space between buttons
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
  // Theme Picker Styles (Step 2)
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
    backgroundColor: Colors.light.buttonPrimary + '20', // Light primary background
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
  // Previous Button Style
  previousButton: {
    backgroundColor: Colors.light.backgroundPaper, // Different background for previous
    borderColor: Colors.light.buttonPrimary,
    borderWidth: 1,
    marginRight: Spacing.m, // If next button is also present
    flex: 1, // If in a row with next button
  },
  previousButtonText: {
    color: Colors.light.buttonPrimary, // Text color matching border
    fontSize: 16,
    fontWeight: 'bold',
  },
});
