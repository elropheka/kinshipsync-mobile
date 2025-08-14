import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  moderateScale,
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
    paddingHorizontal: Spacing.l,
    paddingTop: Platform.OS === 'ios' ? Spacing.m : Spacing.s, // Consider Platform.OS for status bar
  },
  backButton: {
    padding: Spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.s,
  },
  title: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.s,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.l,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.xl,
    marginVertical: Spacing.l,
    padding: Spacing.xs,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.l,
    marginTop: Spacing.xs,
  },
  checkbox: { // This style seems to wrap the actual checkbox, might not need specific sizing if icon is used
    marginRight: Spacing.s,
  },
  uncheckedBox: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.s,
  },
  checkedBox: {
    width: moderateScale(20),
    height: moderateScale(20),
    backgroundColor: Colors.light.success,
    borderRadius: BorderRadius.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    color: Colors.light.textSecondary,
    fontSize: ResponsiveFontSizes.body,
    flexShrink: 1, // Allow text to wrap
  },
  termsLink: {
    color: Colors.light.success,
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: Colors.light.backgroundPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginTop: Spacing.s,
    elevation: 1,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(1),
  },
  signUpButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.buttonPrimary,
  },
  disabledButton: {
    opacity: 0.5,
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
    flex: Platform.OS === 'ios' ? 0.48 : 1,
  },
  appleButton: {
    display: Platform.OS === 'ios' ? 'flex' : 'none', 
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  signInText: {
    color: Colors.light.textSecondary,
    fontSize: ResponsiveFontSizes.body,
  },
  signInLink: {
    color: Colors.light.success,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
  },
  passwordVisibilityToggle: {
    // This style is for the TouchableOpacity around the eye icon
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.s, // Add some padding to make it easier to press
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: Spacing.l,
  },
  avatarPlaceholder: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: moderateScale(15),
    padding: moderateScale(5),
    borderWidth: 2,
    borderColor: Colors.light.backgroundLight,
  },
});
