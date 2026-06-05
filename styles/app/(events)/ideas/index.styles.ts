import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  Layout,
  moderateScale,
} from 'constants/dimensions';

export const createIndexStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.xxl,
    paddingBottom: Spacing.m,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    color: theme.text,
    // marginRight: Spacing.xl, // To balance back button if it was on the left
  },
  newIdeaContainer: {
    backgroundColor: theme.background,
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  newIdeaInput: {
    backgroundColor: theme.neutralBg,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.subtitle,
    minHeight: moderateScale(60),
    textAlignVertical: 'top',
    marginBottom: Spacing.s,
    color: theme.text,
  },
  postIdeaButton: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  postIdeaButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
  },
  listContainer: {
    padding: Spacing.s,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: Spacing.xxl,
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.textSecondary,
  },
  ideaItemContainer: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: 2,
  },
  ideaAuthor: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginBottom: Spacing.xs,
  },
  ideaTitle: {
    fontSize: ResponsiveFontSizes.title, // Use existing 'title' size
    fontWeight: Fonts.weights.semiBold, // Bolder
    color: theme.text,
    marginBottom: Spacing.xxs, // Less margin than description
  },
  ideaText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: theme.text,
    marginBottom: Spacing.s,
    lineHeight: ResponsiveFontSizes.subtitle * 1.375,
  },
  ideaActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  voteCount: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
  },
  commentToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  commentToggleText: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  commentsSection: {
    marginTop: Spacing.s,
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: theme.backgroundPaper,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.s,
  },
  commentInput: {
    flex: 1,
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
    marginRight: Spacing.s,
    color: theme.text,
  },
  postCommentButtonSmall: {
    backgroundColor: theme.buttonPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  postCommentButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.medium,
  },
  commentContainer: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.s,
    padding: Spacing.s,
    marginTop: Spacing.s,
  },
  replyContainer: {
    marginLeft: Spacing.l,
    backgroundColor: theme.backgroundPaper,
  },
  commentAuthor: {
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  commentTimestamp: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary,
  },
  commentText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
    marginTop: Spacing.xxs,
    marginBottom: Spacing.xs,
  },
  replyButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xxs,
  },
  replyButtonText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  noCommentsText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.s,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createIndexStyles(Colors.light);