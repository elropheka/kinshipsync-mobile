import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors'; // Adjusted path
import Fonts from 'constants/fonts'; // Adjusted path
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions'; // Adjusted path

export const styles = StyleSheet.create({
  filterScrollContainer: {
    maxHeight: moderateScale(50), // Matches original style
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
    height: moderateScale(36), // Matches original style
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
