import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const createChatAreaStyles = (theme: typeof Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,

  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    marginRight: Spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: theme.divider,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  errorText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.error,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  retryButton: {
    marginTop: Spacing.m,
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.s,
  },
  retryButtonText: {
    color: theme.primaryContrastText,
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
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.s,
    marginLeft: Spacing.s,
    alignSelf: 'flex-end',
  },
  avatarPlaceholder: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.buttonPrimary,
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
    backgroundColor: theme.buttonPrimary,
    borderBottomRightRadius: BorderRadius.xs,
  },
  otherMessage: {
    backgroundColor: theme.backgroundPaper,
    borderBottomLeftRadius: BorderRadius.xs,
    elevation: 1,
  },
  senderName: {
    fontWeight: Fonts.weights.semiBold,
    fontSize: ResponsiveFontSizes.small,
    marginBottom: Spacing.xxs,
    color: theme.textSecondary,
  },
  messageText: {
    fontSize: ResponsiveFontSizes.body,
  },
  userMessageText: {
    color: theme.primaryContrastText,
  },
  otherMessageText: {
    color: theme.text,
  },
  timestamp: {
    fontSize: ResponsiveFontSizes.small,
    alignSelf: 'flex-end',
    marginTop: Spacing.xxs,
  },
  userTimestamp: {
    color: theme.primaryContrastText + '99',
  },
  otherTimestamp: {
    color: theme.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
    backgroundColor: theme.backgroundPaper,
  },
  input: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(100),
    backgroundColor: theme.background,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.m,
    paddingVertical: Platform.OS === 'ios' ? Spacing.s : Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
    marginRight: Spacing.m,
  },
  sendButton: {
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.round,
    width: moderateScale(44),
    height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: theme.textSecondary,
  },
  emptyChatText: {
    textAlign: 'center',
    color: theme.textSecondary,
    marginTop: Spacing.xl,
    fontSize: ResponsiveFontSizes.body,
  },

  iconButton: {
    padding: Spacing.s,
    marginHorizontal: Spacing.xs,
  },
  uploadProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    backgroundColor: theme.backgroundPaper,
  },
  uploadProgressText: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary,
    marginRight: Spacing.s,
  },
  attachmentPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
    marginHorizontal: Spacing.m,
    marginBottom: Spacing.s,
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: theme.divider,
  },
  attachmentPreviewIcon: {
    marginRight: Spacing.s,
  },
  attachmentPreviewText: {
    flex: 1,
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
  },
  removeAttachmentButton: {
    padding: Spacing.xs,
  },
  emojiPickerContainer: {
    height: moderateScale(250),
    backgroundColor: theme.backgroundPaper,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
    paddingVertical: Spacing.s,
  },
  emojiCategory: {
    marginBottom: Spacing.m,
  },
  emojiCategoryTitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.textSecondary,
    marginBottom: Spacing.s,
    marginLeft: Spacing.m,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.m,

  },
  emojiButton: {
    padding: Spacing.s,

  },
  emojiText: {
    fontSize: ResponsiveFontSizes.title,
  },

  chatImage: {
    width: moderateScale(200),
    height: moderateScale(150),
    borderRadius: BorderRadius.m,
    marginTop: Spacing.xs,
    resizeMode: 'cover',
  },
  fileMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
    backgroundColor: theme.background + '80',
    borderRadius: BorderRadius.s,
    marginTop: Spacing.xs,
  },
  fileIcon: {
    marginRight: Spacing.s,
  },
  fileName: {
    flex: 1,
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
  },
  fileSize: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary,
    marginLeft: Spacing.s,
  },
  captionText: {
    fontSize: ResponsiveFontSizes.small,
    fontStyle: 'italic',

  },

  rsvpButtonContainer: {
    flexDirection: 'row',
    marginTop: Spacing.s,
    justifyContent: 'flex-start',
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
    backgroundColor: theme.success,
  },
  declineButton: {
    backgroundColor: theme.error,
  },
  rsvpButtonText: {
    color: Colors.dark.text,
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.semiBold,
  },
  rsvpStatusText: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary,
    fontStyle: 'italic',
  },

  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    paddingVertical: Spacing.s,
    marginTop: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(60),
    marginRight: Spacing.m,
    minWidth: moderateScale(180),
    elevation: 5,
    shadowColor: Colors.dark.text,
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
    color: theme.text,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  searchInput: {
    flex: 1,
    height: moderateScale(40),
    backgroundColor: theme.background,
    borderRadius: BorderRadius.s,
    paddingHorizontal: Spacing.m,
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
    marginRight: Spacing.s,
  },
  searchBarCloseButton: {
    padding: Spacing.xs,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createChatAreaStyles(Colors.light);