import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const createNewChatStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
  backButton: {
    padding: Spacing.s,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    flex: 1,
    textAlign: 'center',
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
  list: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    backgroundColor: theme.backgroundPaper,
  },
  avatar: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.m,
    backgroundColor: theme.divider,
  },
  avatarPlaceholder: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.buttonPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  userEmail: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyListText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createNewChatStyles(Colors.light);