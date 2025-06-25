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
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl : Spacing.xl,
    paddingBottom: Spacing.s,
    backgroundColor: Colors.light.background,
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
    marginRight: Spacing.xl, // To balance back button
    color: Colors.light.text,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.background,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.buttonPrimary,
  },
  tabText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
  activeTabText: {
    color: Colors.light.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  createTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundLight,
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
    color: Colors.light.buttonPrimary,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.s,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.medium,
    color: Colors.light.text,
  },
  teamsList: {},
  teamsListContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  teamCard: {
    backgroundColor: Colors.light.backgroundLight,
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
    backgroundColor: Colors.light.backgroundSecondary,
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
    color: Colors.light.text,
  },
  teamMembers: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
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
    color: Colors.light.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.light.background,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.m,
    flex: 1,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionButtonText: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.buttonPrimary,
  },
  suggestedTeamsList: {},
  suggestedTeamsListContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  suggestedTeamCard: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    marginBottom: Spacing.m,
  },
  suggestedTeamTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    marginBottom: Spacing.s,
    color: Colors.light.text,
  },
  suggestedTeamDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.m,
    lineHeight: ResponsiveFontSizes.body * 1.4,
  },
  createSuggestedTeamButton: {
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  createSuggestedTeamButtonText: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.primaryContrastText,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: ResponsiveFontSizes.body, // Using existing responsive font size
  },
  emptyListText: {
    textAlign: 'center',
    marginVertical: Spacing.xl,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.l,
  },
  debugInfoText: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.s,
    textAlign: 'center',
  },
});
