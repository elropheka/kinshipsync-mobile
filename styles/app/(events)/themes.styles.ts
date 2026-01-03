import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const createThemesStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl : Spacing.xl,
    paddingBottom: Spacing.l,
    backgroundColor: theme.backgroundLight,
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
    color: theme.text,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    backgroundColor: theme.backgroundLight,
  },
  tabItem: {
    flex: 1,
    marginRight: Spacing.xs,
    alignItems: 'center',
    paddingVertical: Spacing.s,
    borderBottomWidth: moderateScale(4),
    borderBottomColor: theme.divider,
  },
  lastTab: {
    marginRight: 0,
  },
  activeTab: {
    borderBottomColor: theme.buttonPrimary,
  },
  tabText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginBottom: Spacing.s,
  },
  activeTabText: {
    color: theme.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  scrollableContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    marginBottom: Spacing.m,
    marginTop: Spacing.l,
    color: theme.text,
  },
  themeCard: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.backgroundLight,
  },
  selectedThemeCard: {
    borderColor: theme.success,
    borderWidth: moderateScale(2),
    borderLeftWidth: moderateScale(8),
  },
  themeContent: {
    flex: 1,
  },
  themeName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.xs,
    color: theme.text,
  },
  themeDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  radioButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: BorderRadius.round,
    borderWidth: moderateScale(2),
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
  radioButtonSelected: {
    borderColor: theme.warning,
  },
  radioButtonInner: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.warning,
  },
  colorPaletteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: BorderRadius.round,
    margin: Spacing.xs,

    borderWidth: 1,
    borderColor: theme.divider,
  },
  selectedColorOption: {
    borderWidth: moderateScale(3),
    borderColor: theme.text,
  },
  fontStyleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  fontStyleOption: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.xl,
    backgroundColor: theme.backgroundPaper,
  },
  selectedFontStyle: {
    backgroundColor: theme.accent,
                                    
  },
  fontStyleText: {
    textAlign: 'center',
    color: theme.text,
    fontSize: ResponsiveFontSizes.body,
  },
  selectedFontStyleText: {
    color: theme.accentContrastText,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.l,
  },
  backNextButton: {
    flex: 1,
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  backNextButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.primaryContrastText,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.danger,
    textAlign: 'center',
    marginVertical: Spacing.m,
  },
  emptyMessage: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.m,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createThemesStyles(Colors.light);