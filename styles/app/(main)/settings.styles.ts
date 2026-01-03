import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, Layout, isTablet } from 'constants/dimensions';

export const createStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: isTablet() ? ResponsiveFontSizes.subtitle : ResponsiveFontSizes.body,
    color: theme.error,
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
    borderBottomColor: theme.divider,
    backgroundColor: theme.backgroundPaper,
  },
  backButton: {
    padding: isTablet() ? Spacing.m : Spacing.s,
    marginRight: isTablet() ? Spacing.m : Spacing.s,
  },
  header: {
    fontSize: isTablet() ? ResponsiveFontSizes.header1 : ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    flex: 1,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: Spacing.l,
    marginBottom: Spacing.s,
    backgroundColor: theme.backgroundPaper,
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
    color: theme.text,
    marginBottom: Spacing.m,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
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
    color: theme.text,
  },
  optionDescription: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
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
    borderColor: theme.buttonPrimary,
    marginHorizontal: Spacing.xs,
  },
  themeButtonSelected: {
    backgroundColor: theme.buttonPrimary,
  },
  themeButtonText: {
    color: theme.buttonPrimary,
    fontSize: ResponsiveFontSizes.caption,
  },
  themeButtonTextSelected: {
    color: theme.primaryContrastText,
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
    backgroundColor: theme.buttonPrimary,
  },
  logoutButton: {
    backgroundColor: theme.error,
    marginTop: Spacing.m,
  },
  buttonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
  },
  logoutButtonText: {
     color: theme.primaryContrastText,
  },
  deleteAccountButton: {
    backgroundColor: theme.error,
    marginTop: Spacing.m,
    borderWidth: 2,
    borderColor: theme.error,
  },
  deleteAccountButtonText: {
    color: theme.primaryContrastText,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createCreateAccountStyles(Colors.light);
