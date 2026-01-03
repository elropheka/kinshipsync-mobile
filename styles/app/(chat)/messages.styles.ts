import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const createMessagesStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    paddingTop: Platform.OS === 'ios' ? Spacing.l : Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    backgroundColor: theme.backgroundPaper,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  newMessageButton: {
    padding: Spacing.s,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper,
    marginHorizontal: Spacing.m,
    marginVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    height: moderateScale(44),
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.s,
    color: theme.text,
    fontSize: ResponsiveFontSizes.body,
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    backgroundColor: theme.backgroundPaper,
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.m,
    backgroundColor: theme.divider,
  },
  avatarPlaceholder: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxs,
  },
  senderName: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  messageTime: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  lastMessage: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  unreadBadge: {
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    minWidth: moderateScale(22),
    height: moderateScale(22),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.s,
  },
  unreadText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.small,
    fontWeight: Fonts.weights.bold,
  },
  separator: {
    height: 1,
    backgroundColor: theme.divider,
    marginLeft: Spacing.m + moderateScale(50) + Spacing.m,
  },
  emptyListText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  emptyListButton: {
    marginTop: Spacing.m,
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.s,
    alignSelf: 'center',
  },
  emptyListButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  fab: {
    position: 'absolute',
    right: Spacing.l,
    bottom: Spacing.l,
    backgroundColor: theme.primary,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createMessagesStyles(Colors.light);