import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    paddingTop: Platform.OS === 'ios' ? Spacing.l : Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundPaper,
  },
  backButton: {
    padding: Spacing.s,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
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
    color: Colors.light.text,
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
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundPaper,
  },
  avatar: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: BorderRadius.round,
    marginRight: Spacing.m,
    backgroundColor: Colors.light.divider,
  },
  avatarPlaceholder: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.buttonPrimary,
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
    color: Colors.light.text,
  },
  userEmail: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyListText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
