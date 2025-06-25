import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors'; // Adjusted path
import Fonts from 'constants/fonts'; // Adjusted path
import {
  Spacing,
  ResponsiveFontSizes,
} from 'constants/dimensions'; // Adjusted path

export const styles = StyleSheet.create({
  notificationSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider, // Ensure Colors.light is used
  },
  settingsText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.text, // Ensure Colors.light is used
  },
  // Switch track and thumb colors are set inline in the component
  // but you could define them here if preferred, e.g.:
  // switchTrackColor: { false: Colors.light.grey, true: Colors.light.primaryLight },
  // switchThumbColor: Colors.light.background,
});
