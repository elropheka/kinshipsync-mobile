import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Changed to a more neutral background
  },
  centered: { // For loading/error states
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: { // For error messages
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s, // Reduced padding
    paddingTop: Platform.OS === 'ios' ? Spacing.l : Spacing.m, // Adjusted for status bar
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundPaper, // Header distinct background
  },
  backButton: { // Added for consistency
    padding: Spacing.s,
    marginRight: Spacing.s,
  },
  header: { // Renamed from headerTitle for clarity
    fontSize: ResponsiveFontSizes.header2, // Adjusted size
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    flex: 1, // Allow title to take space
    textAlign: 'center', // Center title if no right element
  },
  sectionContainer: {
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
    marginHorizontal: Spacing.m,
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
    marginBottom: Spacing.m,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    // Removed bottom border, will be handled by section or last item
  },
  optionTextContainer: { // Added for better text layout
    flex: 1,
    marginRight: Spacing.m,
  },
  optionText: {
    fontSize: ResponsiveFontSizes.body, // Adjusted size
    color: Colors.light.text,
  },
  optionDescription: { // Added for descriptions under options
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
  },
  linkOptionContainer: { // For navigation links like "Subscription Plans"
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    // borderTopWidth: 1, // Add separator if needed within a section
    // borderTopColor: Colors.light.divider,
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
    marginHorizontal: Spacing.xs,
  },
  themeButtonSelected: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  themeButtonText: {
    color: Colors.light.buttonPrimary,
    fontSize: ResponsiveFontSizes.caption,
  },
  themeButtonTextSelected: {
    color: Colors.light.primaryContrastText,
    fontWeight: Fonts.weights.bold,
  },
  button: { // General button style
    marginHorizontal: Spacing.m,
    marginTop: Spacing.l,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: { // Specific for save
    backgroundColor: Colors.light.buttonPrimary,
  },
  logoutButton: { // Specific for logout
    backgroundColor: Colors.light.error, // Use error color for logout
    marginTop: Spacing.m, // Less margin if it's the last button
  },
  buttonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
  },
  logoutButtonText: { // If different color needed for logout text
     color: Colors.light.primaryContrastText, // Or Colors.dark.text for contrast on error bg
  },
});
