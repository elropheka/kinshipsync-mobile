import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    color: Colors.light.text,
    marginRight: Spacing.xl,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
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
    marginBottom: Spacing.m,
  },
  retryButton: {
    marginTop: Spacing.m,
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.s,
  },
  retryButtonText: {
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
    backgroundColor: Colors.light.buttonPrimary,
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
    borderBottomRightRadius: BorderRadius.xs,
  },
  otherMessage: {
    backgroundColor: Colors.light.backgroundPaper,
    borderBottomLeftRadius: BorderRadius.xs,
    elevation: 1,
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
    color: Colors.light.primaryContrastText + '99',
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
    paddingVertical: Platform.OS === 'ios' ? Spacing.s : Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
    marginRight: Spacing.m,
  },
  sendButton: {
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.round,
    width: moderateScale(44),
    height: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: Colors.light.textSecondary,
  },
  emptyChatText: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
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
    height: moderateScale(250),
    backgroundColor: Colors.light.backgroundPaper,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    paddingVertical: Spacing.s,
  },
  emojiCategory: {
    marginBottom: Spacing.m,
  },
  emojiCategoryTitle: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.background + '80',
    borderRadius: BorderRadius.s,
    marginTop: Spacing.xs,
  },
  fileIcon: {
    marginRight: Spacing.s,
  },
  fileName: {
    flex: 1,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  fileSize: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.success,
  },
  declineButton: {
    backgroundColor: Colors.light.error,
  },
  rsvpButtonText: {
    color: Colors.dark.text,
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.semiBold,
  },
  rsvpStatusText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.backgroundPaper,
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
