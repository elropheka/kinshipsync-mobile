import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  ResponsiveFontSizes,
} from 'constants/dimensions';

export const createNotificationSettingsBarStyles = (theme: typeof Colors.light) => StyleSheet.create({
  notificationSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  settingsText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.text,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createNotificationSettingsBarStyles(Colors.light);