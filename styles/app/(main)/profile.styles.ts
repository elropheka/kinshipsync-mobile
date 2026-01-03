import { StyleSheet } from 'react-native';
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

export const createProfileStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet() ? Spacing.xl : Spacing.l,
    paddingBottom: isTablet() ? Spacing.xxl : Spacing.l,
    backgroundColor: theme.backgroundLight,
  },
  backButton: {
    padding: isTablet() ? Spacing.m : Spacing.s,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: isTablet() ? ResponsiveFontSizes.header2 : ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    marginRight: isTablet() ? Spacing.xxl : Spacing.xl,
    color: theme.text,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: isTablet() ? Spacing.xxl : Spacing.l,
    position: 'relative',
    height: isTablet() ? moderateScale(160) : moderateScale(120),
    width: isTablet() ? moderateScale(160) : moderateScale(120),
    borderRadius: isTablet() ? moderateScale(80) : moderateScale(60),
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.neutralBg,
    justifyContent: 'center',
    marginHorizontal: 'auto',
    overflow: 'visible',
  },
  profileImage: {
    width: isTablet() ? moderateScale(160) : moderateScale(120),
    height: isTablet() ? moderateScale(160) : moderateScale(120),
    borderRadius: isTablet() ? moderateScale(80) : moderateScale(60),
  },
  editImageButton: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.buttonPrimary,
    width: isTablet() ? moderateScale(50) : moderateScale(40),
    height: isTablet() ? moderateScale(50) : moderateScale(40),
    bottom: isTablet() ? -moderateScale(5) : -moderateScale(5),
    right: isTablet() ? -moderateScale(5) : -moderateScale(5),
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editImageText: {
    color: theme.buttonPrimary,
    fontSize: ResponsiveFontSizes.caption,

  },
  formContainer: {
    paddingHorizontal: isTablet() ? Spacing.xl : Spacing.xs,
    paddingBottom: isTablet() ? Spacing.xxl : Spacing.xxl,
    width: '100%',
    maxWidth: isTablet() ? 800 : '100%',
    alignSelf: isTablet() ? 'center' : 'stretch',
  },
  inputContainer: {
    marginBottom: Spacing.m,
  },
  inputLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginBottom: Spacing.s,
    fontWeight: Fonts.weights.medium,
  },
  input: {
    backgroundColor: theme.neutralBg,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    fontSize: ResponsiveFontSizes.subtitle,
    borderWidth: 1,
    borderColor: theme.border,
    color: theme.text,
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
    color: theme.text,
  },
  addImageText: {
    color: theme.buttonPrimary,
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
    backgroundColor: theme.buttonPrimary,
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
    borderColor: theme.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper,
  },
  emptyGalleryText: {
    color: theme.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.s,
    fontSize: ResponsiveFontSizes.caption,
  },
  primaryButton: {
    backgroundColor: theme.accent,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  buttonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.neutralBg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  scrollContainer: {
    paddingBottom: Spacing.xxl,
    paddingHorizontal: 0,
  },
  disabledInput: {
    backgroundColor: theme.divider,
    color: theme.textSecondary,
  },
  disabledButton: {
    backgroundColor: theme.textSecondary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginTop: Spacing.s,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
  },
  secondaryButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.buttonPrimary,
  },
  phoneInputContainer: {
    backgroundColor: theme.neutralBg,
    borderRadius: BorderRadius.l,
    borderWidth: 1,
    borderColor: theme.border,
    width: '100%',
  },
  phoneInputTextContainer: {
    backgroundColor: theme.neutralBg,
    paddingVertical: 0,
  },
  phoneInputText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    padding: Spacing.m,
  },
  phoneInputCodeText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
  },
  phoneInputFlagButton: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
  },
  phoneInputCountryPicker: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.s,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createProfileStyles(Colors.light);
