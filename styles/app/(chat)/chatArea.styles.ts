import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background, // Or a specific chat background
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    // backgroundColor: Colors.light.backgroundLight,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    marginRight: Spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  centered: { // For loading/error/empty states
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  retryButton: { // Added for potential retry mechanism
    marginTop: Spacing.m,
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.s,
  },
  retryButtonText: { // Added
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  messageList: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.m,
    maxWidth: '80%', // Bubbles don't take full width
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse', // To have bubble first, then avatar (if shown for user)
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatar: { // Style for actual avatar image
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.s, // For other users
    marginLeft: Spacing.s, // For current user if avatar shown on right
    alignSelf: 'flex-end',
  },
  avatarPlaceholder: { // Style for placeholder if no avatarUrl
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.buttonPrimary, // Placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.s,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: BorderRadius.l,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  userMessage: {
    backgroundColor: Colors.light.buttonPrimary,
    borderBottomRightRadius: BorderRadius.xs, // Tail effect
  },
  otherMessage: {
    backgroundColor: Colors.light.backgroundPaper,
    borderBottomLeftRadius: BorderRadius.xs, // Tail effect
    elevation: 1, // Subtle shadow for other messages
  },
  senderName: {
    fontWeight: Fonts.weights.semiBold,
    fontSize: ResponsiveFontSizes.small,
    marginBottom: Spacing.xxs,
    color: Colors.light.textSecondary,
  },
  messageText: {
    fontSize: ResponsiveFontSizes.body,
  },
  userMessageText: {
    color: Colors.light.primaryContrastText,
  },
  otherMessageText: {
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: ResponsiveFontSizes.small,
    alignSelf: 'flex-end',
    marginTop: Spacing.xxs,
  },
  userTimestamp: {
    color: Colors.light.primaryContrastText + '99', // Lighter version for user
  },
  otherTimestamp: {
    color: Colors.light.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundPaper,
  },
  input: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(100),
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.m,
    paddingVertical: Platform.OS === 'ios' ? Spacing.s : Spacing.xs, // Adjust padding for platform
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
    marginRight: Spacing.m,
  },
  sendButton: {
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.round, // Make it circular
    width: moderateScale(44),
    height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: { // Added
    backgroundColor: Colors.light.textSecondary, // Or Colors.light.divider
  },
  emptyChatText: { // Added
    textAlign: 'center',
    color: Colors.light.textSecondary,
    marginTop: Spacing.xl,
    fontSize: ResponsiveFontSizes.body,
  },
  // New styles for attachments and emoji picker
  iconButton: {
    padding: Spacing.s,
    marginHorizontal: Spacing.xs,
  },
  uploadProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    backgroundColor: Colors.light.backgroundPaper,
  },
  uploadProgressText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
    marginRight: Spacing.s,
  },
  attachmentPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
    marginHorizontal: Spacing.m,
    marginBottom: Spacing.s,
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: Colors.light.divider,
  },
  attachmentPreviewIcon: {
    marginRight: Spacing.s,
  },
  attachmentPreviewText: {
    flex: 1,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  removeAttachmentButton: {
    padding: Spacing.xs,
  },
  emojiPickerContainer: {
    height: moderateScale(250), // Adjust height as needed
    backgroundColor: Colors.light.backgroundPaper,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    paddingVertical: Spacing.s,
  },
  emojiCategory: {
    marginBottom: Spacing.m, // Add some space between categories
  },
  emojiCategoryTitle: {
    fontSize: ResponsiveFontSizes.body, // Or small, adjust as needed
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.s,
    marginLeft: Spacing.m, // Align with emojiRow padding
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow emojis to wrap
    paddingHorizontal: Spacing.m,
    // justifyContent: 'space-around',
  },
  emojiButton: {
    padding: Spacing.s,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  emojiText: {
    fontSize: ResponsiveFontSizes.title, // Use title or another appropriate large size
  },
  // Styles for image and file messages in MessageBubble
  chatImage: {
    width: moderateScale(200), // Max width for chat images
    height: moderateScale(150), // Max height for chat images
    borderRadius: BorderRadius.m,
    marginTop: Spacing.xs,
    resizeMode: 'cover',
  },
  fileMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
    backgroundColor: Colors.light.background + '80', // Slightly different background for file bubble
    borderRadius: BorderRadius.s,
    marginTop: Spacing.xs,
  },
  fileIcon: {
    marginRight: Spacing.s,
  },
  fileName: {
    flex: 1,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text, // Or primary for user, text for other
  },
  fileSize: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.s,
  },
  captionText: { // Style for captions under images/files
    fontSize: ResponsiveFontSizes.small,
    fontStyle: 'italic',
    // color is inherited from userMessageText or otherMessageText
  },
  // RSVP Styles
  rsvpButtonContainer: {
    flexDirection: 'row',
    marginTop: Spacing.s,
    justifyContent: 'flex-start', // Align to start for otherUser messages
  },
  rsvpButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    marginRight: Spacing.s,
    minWidth: moderateScale(80),
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: Colors.light.success,
  },
  declineButton: {
    backgroundColor: Colors.light.error,
  },
  rsvpButtonText: {
    color: Colors.dark.text, // Assuming dark text for contrast on colored buttons
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.semiBold,
  },
  rsvpStatusText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  // Styles for Header Menu and Search Bar
  headerRightContainer: { // To wrap header icons if needed, e.g. for multiple icons
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent background
    justifyContent: 'flex-start', // Align menu to top
    alignItems: 'flex-end', // Align menu to right
  },
  dropdownMenu: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    paddingVertical: Spacing.s,
    marginTop: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(60), // Adjust based on header height
    marginRight: Spacing.m,
    minWidth: moderateScale(180),
    elevation: 5, // Android shadow
    shadowColor: Colors.dark.text, // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: BorderRadius.s,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
  },
  dropdownMenuItemIcon: {
    marginRight: Spacing.m,
  },
  dropdownMenuItemText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  searchInput: {
    flex: 1,
    height: moderateScale(40),
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.s,
    paddingHorizontal: Spacing.m,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
    marginRight: Spacing.s,
  },
  searchBarCloseButton: {
    padding: Spacing.xs,
  },
});
