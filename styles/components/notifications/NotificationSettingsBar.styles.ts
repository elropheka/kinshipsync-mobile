import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  ResponsiveFontSizes,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  notificationSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  settingsText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.text,
  },
});
