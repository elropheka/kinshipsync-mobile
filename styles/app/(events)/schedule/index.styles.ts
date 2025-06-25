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
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.xxl,
    paddingBottom: Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    flex: 1,
    color: Colors.light.text,
    // marginRight: Spacing.xl, // Add if there's an addButton to balance
  },
  addButton: {
    padding: Spacing.xs,
  },
  listContentContainer: {
    padding: Spacing.s,
  },
  itemContainer: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    flexDirection: 'row',
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(1.41),
    elevation: 2,
  },
  itemTiming: {
    alignItems: 'center',
    marginRight: Spacing.m,
    width: moderateScale(70),
  },
  itemTimeText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
  },
  itemTimeTextSmall: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: Colors.light.text,
  },
  itemSubtitle: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xxs,
  },
  itemActions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xxl,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.textSecondary,
  },
});
