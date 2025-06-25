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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center', // This will vertically center the dot, avatar, and content block
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.l, // Increased vertical padding
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1, // Added bottom border
    borderBottomColor: Colors.light.border, // Using a defined border color
  },
  unreadItem: {
    backgroundColor: Colors.light.primary + '15', // Subtle primary color for unread background
    // For a more distinct unread item, you could also add a left border:
    // borderLeftWidth: 3,
    // borderLeftColor: Colors.light.primary,
  },
  avatarContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.m,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    // Size and color are set by Ionicons props directly in the component
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'column', // To stack header, message, and time
    justifyContent: 'space-between', // Pushes time to bottom if content has height
    marginLeft: Spacing.m, // Added margin to separate from avatar if dot is outside
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Keeps sender and (original) time position
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  senderName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.bold, // Made sender name bolder
    color: Colors.light.text,
  },
  notificationTime: { // This will now be for the time at the bottom-left
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.s, // Space above the time
    alignSelf: 'flex-start', // Align to the left
  },
  notificationText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text, // Changed to primary text color for better readability
    lineHeight: ResponsiveFontSizes.body * 1.4,
    // Removed marginBottom to allow time to sit closer if message is short
  },
  unreadIndicator: { 
    width: moderateScale(10), // Made dot slightly larger for visibility
    height: moderateScale(10),
    borderRadius: moderateScale(5), // Ensure it's a circle
    backgroundColor: Colors.light.primary, 
    marginRight: Spacing.m, // Space between dot and avatar
    // alignSelf: 'center' is implicitly handled by parent's alignItems: 'center'
  },
});
