import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
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
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.xl,
    marginRight: Spacing.s,
    justifyContent: 'center',
    height: moderateScale(36),
  },
  activeFilterChip: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  filterText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
  activeFilterText: {
    color: Colors.light.primaryContrastText,
    fontWeight: Fonts.weights.medium,
  },
});
