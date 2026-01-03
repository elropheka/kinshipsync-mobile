import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, Layout, isTablet } from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: isTablet() ? ResponsiveFontSizes.subtitle : ResponsiveFontSizes.body,
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet() ? Spacing.xl : Spacing.m,
    paddingVertical: isTablet() ? Spacing.m : Spacing.s,
    paddingTop: Platform.OS === 'ios' ? (isTablet() ? Spacing.xxl : Spacing.l) : (isTablet() ? Spacing.xl : Spacing.m),
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundPaper,
  },
  backButton: {
    padding: isTablet() ? Spacing.m : Spacing.s,
    marginRight: isTablet() ? Spacing.m : Spacing.s,
  },
  header: {
    fontSize: isTablet() ? ResponsiveFontSizes.header1 : ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: isTablet() ? Spacing.l : Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: Layout.SCREEN_WIDTH * 0.9,
    alignSelf: isTablet() ? 'center' : 'stretch',
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

  },
  optionTextContainer: {
    flex: 1,
    marginRight: Spacing.m,
  },
  optionText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  optionDescription: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
  },
  linkOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,

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
  button: {
    marginTop: Spacing.l,
    paddingVertical: Spacing.l,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.SCREEN_WIDTH * 0.9,
    alignSelf: isTablet() ? 'center' : 'stretch',
  },
  saveButton: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  logoutButton: {
    backgroundColor: Colors.light.error,
    marginTop: Spacing.m,
  },
  buttonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
  },
  logoutButtonText: {
     color: Colors.light.primaryContrastText,
  },
  deleteAccountButton: {
    backgroundColor: Colors.light.error,
    marginTop: Spacing.m,
    borderWidth: 2,
    borderColor: Colors.light.error,
  },
  deleteAccountButtonText: {
    color: Colors.light.primaryContrastText,
  },
});
