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
import { BOTTOM_NAV_HEIGHT } from '../Navigation/bottomNavigation.styles';

export const createTeamsStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl : Spacing.xl,
    paddingBottom: Spacing.s,
    backgroundColor: theme.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.s,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    marginRight: Spacing.xl,
    color: theme.text,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    backgroundColor: theme.background,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.buttonPrimary,
  },
  tabText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  activeTabText: {
    color: theme.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  createTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundLight,
    marginHorizontal: Spacing.l,
    marginTop: Spacing.m,
    marginBottom: Spacing.s,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.l,
  },
  createTeamIcon: {
    marginRight: Spacing.m,
  },
  createTeamText: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: theme.buttonPrimary,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.s,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    color: theme.text,
  },
  teamsList: {},
  teamsListContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: BOTTOM_NAV_HEIGHT + Spacing.l,
  },
  teamCard: {
    backgroundColor: theme.backgroundLight,
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    marginBottom: Spacing.m,
    padding: Spacing.m,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamIconContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
    marginLeft: Spacing.m,
  },
  teamName: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  teamMembers: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
  },
  chatButton: {
    width: IconSizes.xxl,
    height: IconSizes.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    marginTop: Spacing.m,
  },
  quickActionsLabel: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
    marginBottom: Spacing.s,
    color: theme.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: theme.background,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.m,
    flex: 1,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  actionButtonText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.buttonPrimary,
  },
  suggestedTeamsList: {},
  suggestedTeamsListContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  suggestedTeamCard: {
    backgroundColor: theme.backgroundLight,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    marginBottom: Spacing.m,
  },
  suggestedTeamTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.s,
    color: theme.text,
  },
  suggestedTeamDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    marginBottom: Spacing.m,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  createSuggestedTeamButton: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  createSuggestedTeamButtonText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.primaryContrastText,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: ResponsiveFontSizes.body,
  },
  emptyListText: {
    textAlign: 'center',
    marginVertical: Spacing.xl,
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  debugInfoText: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.s,
    textAlign: 'center',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createTeamsStyles(Colors.light);