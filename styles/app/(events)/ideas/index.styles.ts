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

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.xxl,
    paddingBottom: Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    flex: 1,
    textAlign: 'center',
    color: Colors.light.text,
    // marginRight: Spacing.xl, // To balance back button if it was on the left
  },
  newIdeaContainer: {
    backgroundColor: Colors.light.backgroundLight,
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  newIdeaInput: {
    backgroundColor: Colors.light.neutralBg,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.subtitle,
    minHeight: moderateScale(60),
    textAlignVertical: 'top',
    marginBottom: Spacing.s,
    color: Colors.light.text,
  },
  postIdeaButton: {
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  postIdeaButtonText: {
    color: Colors.light.primaryContrastText,
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
    color: Colors.light.textSecondary,
  },
  ideaItemContainer: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.s,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: 2,
  },
  ideaAuthor: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  ideaTitle: {
    fontSize: ResponsiveFontSizes.title, // Use existing 'title' size
    fontWeight: Fonts.weights.semiBold, // Bolder
    color: Colors.light.text,
    marginBottom: Spacing.xxs, // Less margin than description
  },
  ideaText: {
    fontSize: ResponsiveFontSizes.subtitle,
    color: Colors.light.text,
    marginBottom: Spacing.s,
    lineHeight: ResponsiveFontSizes.subtitle * 1.375,
  },
  ideaActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  voteCount: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  commentToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xs,
  },
  commentToggleText: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
  commentsSection: {
    marginTop: Spacing.s,
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.light.backgroundPaper,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.s,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
    marginRight: Spacing.s,
    color: Colors.light.text,
  },
  postCommentButtonSmall: {
    backgroundColor: Colors.light.buttonPrimary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  postCommentButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.medium,
  },
  commentContainer: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.s,
    padding: Spacing.s,
    marginTop: Spacing.s,
  },
  replyContainer: {
    marginLeft: Spacing.l,
    backgroundColor: Colors.light.backgroundLight,
  },
  commentAuthor: {
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
  },
  commentTimestamp: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
  },
  commentText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
    marginTop: Spacing.xxs,
    marginBottom: Spacing.xs,
  },
  replyButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xxs,
  },
  replyButtonText: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  noCommentsText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.s,
  },
});
