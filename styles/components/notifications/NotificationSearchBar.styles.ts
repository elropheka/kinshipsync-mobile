import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors'; // Adjusted path
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  Layout,
} from 'constants/dimensions'; // Adjusted path

export const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.neutralBg,
    marginHorizontal: Spacing.l,
    marginBottom: Spacing.m,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    height: Layout.inputHeight,
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
  },
});
