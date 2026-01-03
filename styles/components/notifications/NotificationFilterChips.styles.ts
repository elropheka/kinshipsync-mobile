import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const createNotificationFilterChipsStyles = (theme: typeof Colors.light) => StyleSheet.create({
  filterScrollContainer: {
    maxHeight: moderateScale(50),
  },
  filterContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
    justifyContent: 'center',
    height: moderateScale(36),
  },
  activeFilterChip: {
    backgroundColor: theme.buttonPrimary,
  },
  filterText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  activeFilterText: {
    color: theme.primaryContrastText,
    fontWeight: Fonts.weights.medium,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createNotificationFilterChipsStyles(Colors.light);