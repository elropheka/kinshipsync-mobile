import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Or a slightly different chat background
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.error,
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.m,
    borderRadius: BorderRadius.l,
    marginBottom: Spacing.m,
  },
  myMessageBubble: {
    backgroundColor: Colors.light.buttonPrimary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: BorderRadius.xs, // Chat bubble tail effect
  },
  otherMessageBubble: {
    backgroundColor: Colors.light.backgroundPaper, // Or Colors.light.secondary for contrast
    alignSelf: 'flex-start',
    borderBottomLeftRadius: BorderRadius.xs, // Chat bubble tail effect
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  announcementBubble: {
    backgroundColor: Colors.light.warning + '30', // Light warning background for announcements
    borderColor: Colors.light.warning,
    borderWidth: 1,
    alignSelf: 'stretch', // Make announcements take full width available
    maxWidth: '100%',
  },
  senderNameText: {
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.textSecondary, // Or a distinct color for sender name
    marginBottom: Spacing.xxs,
  },
  messageText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text, // Default for other messages
    // For my messages, color should contrast with primary
    // This can be handled by adding a specific style for myMessageText if needed
  },
  myMessageText: { // Example if specific color needed for own messages
     color: Colors.light.primaryContrastText,
  },
  timestampText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary, // Default for other messages
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },
  myTimestampText: { // Example for own messages
     color: Colors.light.primaryContrastText + 'aa', // Lighter version of contrast text
  },
  announcementText: {
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.warning,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  emptyMessagesText: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    marginTop: Spacing.xl,
    fontSize: ResponsiveFontSizes.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundPaper,
  },
  textInput: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(120), // Allow for multi-line input
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
    marginRight: Spacing.m,
  },
  sendButton: {
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.round,
    padding: Spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
