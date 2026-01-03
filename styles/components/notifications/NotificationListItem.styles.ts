import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  moderateScale,
} from 'constants/dimensions';

export const createNotificationListItemStyles = (theme: typeof Colors.light) => StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.l,
    backgroundColor: theme.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  unreadItem: {
    backgroundColor: theme.primary + '15',
  },
  avatarContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.m,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: Spacing.m,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  senderName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  notificationTime: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.s,
    alignSelf: 'flex-start',
  },
  notificationText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  unreadIndicator: { 
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: theme.primary, 
    marginRight: Spacing.m,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createNotificationListItemStyles(Colors.light);