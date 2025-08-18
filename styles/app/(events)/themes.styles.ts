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
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl : Spacing.xl,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.light.backgroundLight,
  },
  tabItem: {
    flex: 1,
    marginRight: Spacing.xs,
    alignItems: 'center',
    paddingVertical: Spacing.s,
    borderBottomWidth: moderateScale(4),
    borderBottomColor: Colors.light.divider,
  },
  lastTab: {
    marginRight: 0,
  },
  activeTab: {
    borderBottomColor: Colors.light.buttonPrimary,
  },
  tabText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.s,
  },
  activeTabText: {
    color: Colors.light.buttonPrimary,
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
    color: Colors.light.text,
  },
  themeCard: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundLight,
  },
  selectedThemeCard: {
    borderColor: Colors.light.success,
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
    color: Colors.light.text,
  },
  themeDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
  radioButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: BorderRadius.round,
    borderWidth: moderateScale(2),
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
  radioButtonSelected: {
    borderColor: Colors.light.warning,
  },
  radioButtonInner: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.warning,
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
    borderColor: Colors.light.divider,
  },
  selectedColorOption: {
    borderWidth: moderateScale(3),
    borderColor: Colors.light.text,
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
    backgroundColor: Colors.light.backgroundPaper,
  },
  selectedFontStyle: {
    backgroundColor: Colors.light.accent,
                                    
  },
  fontStyleText: {
    textAlign: 'center',
    color: Colors.light.text,
    fontSize: ResponsiveFontSizes.body,
  },
  selectedFontStyleText: {
    color: Colors.light.accentContrastText,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.l,
  },
  backNextButton: {
    flex: 1,
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  backNextButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.primaryContrastText,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.danger,
    textAlign: 'center',
    marginVertical: Spacing.m,
  },
  emptyMessage: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.m,
  },
});
