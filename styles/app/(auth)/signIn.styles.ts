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
  isTablet,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
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
    color: Colors.light.text,
    textAlign: isTablet() ? 'center' : 'left',
  },
  subtitle: {
    fontSize: isTablet() ? ResponsiveFontSizes.subtitle : ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.l,
    lineHeight: isTablet() ? ResponsiveFontSizes.subtitle * 1.4 : ResponsiveFontSizes.body * 1.4,
    textAlign: isTablet() ? 'center' : 'left',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.xl,
    marginVertical: Spacing.l,
    padding: Spacing.xs,
    maxWidth: isTablet() ? 400 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
  },
  toggleButtonActive: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    shadowColor: Colors.light.text,
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
    color: Colors.light.buttonPrimary,
  },
  toggleTextInactive: {
    color: Colors.light.textSecondary,
  },
  form: {
    marginTop: Spacing.s,
  },
  inputContainer: {
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.m,
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    alignItems: 'center',
    color: Colors.light.text,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
  },
  inputIcon: {
    paddingRight: Spacing.m,
    color: Colors.light.icon,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.l,
  },
  forgotPasswordText: {
    color: Colors.light.textSecondary,
    fontSize: ResponsiveFontSizes.body,
  },
  signInButton: {
    backgroundColor: Colors.light.backgroundPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginTop: Spacing.s,
    shadowColor: Colors.light.text,
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
    color: Colors.light.buttonPrimary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  dividerText: {
    paddingHorizontal: Spacing.m,
    color: Colors.light.textSecondary,
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
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.background,
    flex: Platform.OS === 'android'? 1 : 0.48,
  },
  appleButton: {
    display: Platform.OS === 'android'? 'none': 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.background,
    flex: 0.48,
  },
  socialIcon: {
    width: IconSizes.m,
    height: IconSizes.m,
    marginRight: Spacing.s,
  },
  socialButtonText: {
    fontWeight: Fonts.weights.medium,
    color: Colors.light.text,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  signUpText: {
    color: Colors.light.textSecondary,
  },
  signUpLink: {
    color: Colors.light.success,
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
