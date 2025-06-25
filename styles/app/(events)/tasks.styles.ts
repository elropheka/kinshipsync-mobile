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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l, // Adjust as needed for status bar
    paddingBottom: Spacing.s,
    backgroundColor: Colors.light.backgroundLight,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    // textAlign: 'center', // If you want it centered, ensure flex: 1 and adjust sibling spacing
    // marginLeft: Spacing.m, // Add margin if back button is present
  },
  addButton: { // Assuming this is for an icon button
    padding: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginBottom: Spacing.l,
  },
  listContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.l,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Spacing.m,
    // backgroundColor: Colors.light.backgroundPrimary, // Optional: if you want a slightly different bg for icon
    // padding: Spacing.s, // Optional
    // borderRadius: BorderRadius.m, // Optional
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  categoryDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  bottomBar: {
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    // borderTopWidth: 1,
    // borderTopColor: Colors.light.divider,
  },
  bottomBarIndicator: {
    width: moderateScale(80),
    height: moderateScale(5),
    backgroundColor: Colors.light.text,
    borderRadius: BorderRadius.s,
  },
});
