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

export const createIndexStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.xxl,
    paddingBottom: Spacing.m,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    flex: 1,
    color: theme.text,
    // marginRight: Spacing.xl, // Add if there's an addButton to balance
  },
  addButton: {
    padding: Spacing.xs,
  },
  listContentContainer: {
    padding: Spacing.s,
    paddingBottom: Spacing.xxl + Spacing.xxl,
  },
  fab: {
    position: 'absolute',
    right: Spacing.l,
    bottom: Spacing.l,
    backgroundColor: theme.primary,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemContainer: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    flexDirection: 'row',
    shadowColor: theme.text,
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
    color: theme.text,
  },
  itemTimeTextSmall: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.xs,
    color: theme.text,
  },
  itemSubtitle: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
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
    color: theme.textSecondary,
  },
  errorText: {
    color: theme.error,
    textAlign: 'center',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createIndexStyles(Colors.light);