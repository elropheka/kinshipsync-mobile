import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  moderateScale,
  isTablet,
} from 'constants/dimensions';

export const createSignInStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: isTablet() ? Spacing.xl : Spacing.l,
    paddingTop: Platform.OS === 'ios' ? Spacing.m : Spacing.s,
  },
  backButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet() ? Spacing.xxl : Spacing.xl,
    paddingTop: Spacing.s,
    maxWidth: isTablet() ? 600 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
    width: '100%',
  },
  title: {
    fontSize: isTablet() ? ResponsiveFontSizes.header1 : ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.s,
    color: theme.text,
    textAlign: isTablet() ? 'center' : 'left',
  },
  subtitle: {
    fontSize: isTablet() ? ResponsiveFontSizes.subtitle : ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginBottom: Spacing.l,
    lineHeight: isTablet() ? ResponsiveFontSizes.subtitle * 1.4 : ResponsiveFontSizes.body * 1.4,
    textAlign: isTablet() ? 'center' : 'left',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.xl,
    marginVertical: Spacing.l,
    padding: Spacing.xs,
    maxWidth: isTablet() ? 400 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
  },
  toggleButtonActive: {
    flex: 1,
    backgroundColor: theme.background,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(1),
    elevation: 1,
  },
  toggleButtonInactive: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  toggleTextActive: {
    fontWeight: Fonts.weights.semiBold,
    color: theme.buttonPrimary,
  },
  toggleTextInactive: {
    color: theme.textSecondary,
  },
  form: {
    marginTop: Spacing.s,
  },
  inputContainer: {
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: BorderRadius.m,
    backgroundColor: theme.background,
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.text,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
  },
  inputIcon: {
    paddingRight: Spacing.m,
    color: theme.icon,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.l,
  },
  forgotPasswordText: {
    color: theme.textSecondary,
    fontSize: ResponsiveFontSizes.body,
  },
  signInButton: {
    backgroundColor: theme.backgroundPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginTop: Spacing.s,
    shadowColor: theme.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.20,
    shadowRadius: moderateScale(2.62),
    elevation: 4,
  },
  signInButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.buttonPrimary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.divider,
  },
  dividerText: {
    paddingHorizontal: Spacing.m,
    color: theme.textSecondary,
    fontSize: ResponsiveFontSizes.body,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: BorderRadius.xl,
    backgroundColor: theme.background,
    flex: Platform.OS === 'android'? 1 : 0.48,
  },
  appleButton: {
    display: Platform.OS === 'android'? 'none': 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: BorderRadius.xl,
    backgroundColor: theme.background,
    flex: 0.48,
  },
  socialIcon: {
    width: IconSizes.m,
    height: IconSizes.m,
    marginRight: Spacing.s,
  },
  socialButtonText: {
    fontWeight: Fonts.weights.medium,
    color: theme.text,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  signUpText: {
    color: theme.textSecondary,
  },
  signUpLink: {
    color: theme.success,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.xs,
  },
  disabledButton: {
    opacity: 0.5,
  },
  passwordVisibilityToggle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.s,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createSignInStyles(Colors.light);
