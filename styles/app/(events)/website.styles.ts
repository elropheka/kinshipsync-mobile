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
    paddingTop: Platform.OS === 'ios' ? Spacing.s : Spacing.m,
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
    paddingTop: Spacing.s,
    paddingBottom: Spacing.s,
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
  previewTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    marginLeft: Spacing.l,
    marginBottom: Spacing.m,
    color: Colors.light.text,
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xl,
  },
  websitePreview: {
    flex: 1,
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    backgroundColor: Colors.light.backgroundPrimary,
  },
  websiteHeader: {
    backgroundColor: Colors.light.backgroundPrimary,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  weddingTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 2,
    color: Colors.light.buttonPrimary,
  },
  weddingImage: {
    width: '100%',
    height: '60%',

  },
  websiteFooter: {
    flex: 1,
    backgroundColor: Colors.light.backgroundPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.l,
  },
  coupleNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s,
  },
  coupleName: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 2,
    color: Colors.light.buttonPrimary,
  },
  ampersand: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    paddingHorizontal: Spacing.m,
    color: Colors.light.buttonPrimary,
  },
  weddingDate: {
    fontSize: ResponsiveFontSizes.subtitle,
    letterSpacing: 1,
    color: Colors.light.textDarkContrast,
  },
  doneButton: {
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.l,
    marginHorizontal: Spacing.l,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.l,
  },
  doneButtonText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.primaryContrastText,
  },
});
