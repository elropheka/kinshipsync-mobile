import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const createIndexStyles = (theme: typeof Colors.light) => StyleSheet.create({
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
  },
  emptyText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
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
    marginHorizontal: Spacing.s, // Ensure title doesn't overlap buttons if too long
  },
  // Event Selection View
  eventItemSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.m,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  eventItemSelectText: {
    fontSize: ResponsiveFontSizes.title,
    color: theme.text,
  },
  // Budget Management View
  scrollContainer: {
    flex: 1,
    padding: Spacing.m,
  },
  section: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    marginBottom: Spacing.l,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    marginBottom: Spacing.m,
  },
  overallBudgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  overallBudgetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: BorderRadius.s,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
    marginRight: Spacing.m,
    color: theme.text,
  },
  saveOverallBudgetButton: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.s + 2, // Adjust for alignment with input
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.s,
    justifyContent: 'center',
  },
  saveOverallBudgetButtonText: {
    color: theme.primaryContrastText,
    fontWeight: Fonts.weights.semiBold,
    fontSize: ResponsiveFontSizes.body,
  },
  disabledButton: {
    backgroundColor: theme.textSecondary,
    opacity: 0.7,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  summaryLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  summaryValue: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  summaryRemainingLabel: {
    fontWeight: Fonts.weights.bold,
  },
  summaryValueNegative: {
    color: theme.error,
  },
  sectionHeaderAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs, // Smaller padding for action button
  },
  addButtonText: {
    marginLeft: Spacing.xs,
    color: theme.buttonPrimary,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.medium,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  budgetItemPressed: {
    backgroundColor: theme.border, // This is gray-300 (#D1D5DB)
  },
  budgetItemInfo: {
    flex: 1,
  },
  budgetItemName: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  budgetItemCategory: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
  },
  budgetItemCosts: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginTop: Spacing.xxs,
  },
  budgetItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: theme.divider,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createIndexStyles(Colors.light);