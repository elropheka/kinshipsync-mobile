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

export const createCreateAccountStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.s,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet() ? Spacing.xxl : Spacing.xl,
    paddingTop: Spacing.s,
    maxWidth: isTablet() ? 600 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
    width: '100%',
  },
  logo: {
    width: isTablet() ? 190 : 170,
    height: isTablet() ? 58 : 52,
    alignSelf: isTablet() ? 'center' : 'flex-start',
    marginBottom: Spacing.m,
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
    backgroundColor: theme.backgroundSecondary,
    borderRadius: BorderRadius.xl,
    marginVertical: Spacing.m,
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
  formCard: {
    marginTop: Spacing.s,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
  },
  formNote: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginBottom: Spacing.m,
    fontStyle: 'italic',
  },
  inputWrapper: {
    marginBottom: Spacing.m,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  requiredLabel: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.text,
    marginBottom: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    paddingRight: moderateScale(44),
  },
  inputIcon: {
    position: 'absolute',
    right: Spacing.m,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.l,
    marginTop: Spacing.xs,
  },
  checkbox: {
    marginRight: Spacing.s,
  },
  uncheckedBox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: BorderRadius.s,
  },
  checkedBox: {
    width: moderateScale(20),
    height: moderateScale(20),
    backgroundColor: theme.primary,
    borderRadius: BorderRadius.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    color: theme.textSecondary,
    fontSize: ResponsiveFontSizes.body,
    flexShrink: 1,
  },
  termsLink: {
    color: theme.primary,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.l,
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
    gap: Spacing.s,
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
    flex: Platform.OS === 'android' ? 1 : 0.48,
  },
  appleButton: {
    display: Platform.OS === 'ios' ? 'flex' : 'none',
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.l,
    marginBottom: Spacing.m,
  },
  signInText: {
    color: theme.textSecondary,
    fontSize: ResponsiveFontSizes.body,
  },
  signInLink: {
    color: theme.primary,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
  },
  passwordVisibilityToggle: {
    position: 'absolute',
    right: Spacing.s,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
});

export const styles = createCreateAccountStyles(Colors.light);
