import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight,
   
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
  },
  emptyText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
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
    marginHorizontal: Spacing.s, // Ensure title doesn't overlap buttons if too long
  },
  // Event Selection View
  eventItemSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.m,
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  eventItemSelectText: {
    fontSize: ResponsiveFontSizes.title,
    color: Colors.light.text,
  },
  // Budget Management View
  scrollContainer: {
    flex: 1,
    padding: Spacing.m,
  },
  section: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    marginBottom: Spacing.l,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
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
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.s,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
    marginRight: Spacing.m,
    color: Colors.light.text,
  },
  saveOverallBudgetButton: {
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.s + 2, // Adjust for alignment with input
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.s,
    justifyContent: 'center',
  },
  saveOverallBudgetButtonText: {
    color: Colors.light.primaryContrastText,
    fontWeight: Fonts.weights.semiBold,
    fontSize: ResponsiveFontSizes.body,
  },
  disabledButton: {
    backgroundColor: Colors.light.textSecondary,
    opacity: 0.7,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  summaryLabel: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
  },
  summaryRemainingLabel: {
    fontWeight: Fonts.weights.bold,
  },
  summaryValueNegative: {
    color: Colors.light.error,
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
    color: Colors.light.buttonPrimary,
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
    backgroundColor: Colors.light.border, // This is gray-300 (#D1D5DB)
  },
  budgetItemInfo: {
    flex: 1,
  },
  budgetItemName: {
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
  },
  budgetItemCategory: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
  },
  budgetItemCosts: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xxs,
  },
  budgetItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },
});
