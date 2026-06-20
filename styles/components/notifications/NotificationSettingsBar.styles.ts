import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  ResponsiveFontSizes,
} from 'constants/dimensions';

export const createNotificationSettingsBarStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  notificationSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.s,
  },
  settingsText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    color: theme.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
  },
  markAllReadButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.s,
  },
  markAllReadButtonDisabled: {
    opacity: 0.5,
  },
  markAllReadText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.accent,
  },
  markAllReadTextDisabled: {
    color: theme.textSecondary,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createNotificationSettingsBarStyles(Colors.light);