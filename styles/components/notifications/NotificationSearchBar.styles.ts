import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  Layout,
} from 'constants/dimensions';

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
