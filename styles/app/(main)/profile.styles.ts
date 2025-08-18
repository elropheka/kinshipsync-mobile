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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,

    paddingBottom: Spacing.l,
    backgroundColor: Colors.light.backgroundLight,
  },
  backButton: {
    padding: Spacing.s,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    marginRight: Spacing.xl,
    color: Colors.light.text,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: Spacing.l,
    position: 'relative',
    height: moderateScale(120),
    width: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.neutralBg,
    justifyContent: 'center',
    marginHorizontal: 'auto',
  },
  profileImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
  },
  editImageButton: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.light.buttonPrimary,
    width: moderateScale(40),
    height: moderateScale(40),
    bottom: 0,
    right: 0,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
  },
  editImageText: {
    color: Colors.light.buttonPrimary,
    fontSize: ResponsiveFontSizes.caption,

  },
  formContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
  inputContainer: {
    marginBottom: Spacing.m,
  },
  inputLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.s,
    fontWeight: Fonts.weights.medium,
  },
  input: {
    backgroundColor: Colors.light.neutralBg,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    borderWidth: 1,
    borderColor: Colors.light.border,
    color: Colors.light.text,
  },
  bioInput: {
    height: moderateScale(100),
    textAlignVertical: 'top',
  },
  gallerySection: {
    marginVertical: Spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
  },
  addImageText: {
    color: Colors.light.buttonPrimary,
    fontWeight: Fonts.weights.semiBold,
    fontSize: ResponsiveFontSizes.body,
  },
  imageGallery: {
    flexGrow: 0,
    marginBottom: Spacing.s,
  },
  imageContainer: {
    marginRight: Spacing.s,
    position: 'relative',
  },
  galleryImage: {
    width: moderateScale(120),
    height: moderateScale(160),
    borderRadius: BorderRadius.l,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.s,
    right: Spacing.s,
    backgroundColor: Colors.light.buttonPrimary,
    width: IconSizes.l,
    height: IconSizes.l,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: Colors.dark.text,
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.bold,
  },
  emptyGallery: {
    width: moderateScale(120),
    height: moderateScale(160),
    borderRadius: BorderRadius.l,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
  },
  emptyGalleryText: {
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.s,
    fontSize: ResponsiveFontSizes.caption,
  },
  primaryButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  buttonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.neutralBg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  scrollContainer: {
    paddingBottom: Spacing.xxl,
  },
  disabledInput: {
    backgroundColor: Colors.light.divider,
    color: Colors.light.textSecondary,
  },
  disabledButton: {
    backgroundColor: Colors.light.textSecondary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginTop: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
  },
  secondaryButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.buttonPrimary,
  },
});
