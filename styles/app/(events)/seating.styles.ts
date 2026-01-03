import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const createSeatingStyles = (theme: typeof Colors.light) => StyleSheet.create({
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
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    backgroundColor: theme.backgroundPaper,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
  },
  saveButton: {
    backgroundColor: theme.buttonPrimary,
  },
  controlButtonText: {
    marginLeft: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
    color: theme.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  scrollContent: {
    padding: Spacing.m,
  },
  tableContainer: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
    paddingBottom: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  tableName: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  chairsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow chairs to wrap to next line
    // justifyContent: 'center', // Or 'flex-start'
  },
  chair: {
    width: moderateScale(60), // Increased size for better touchability and text
    height: moderateScale(60),
    borderRadius: BorderRadius.s, // Slightly less rounded for a "seat" feel
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: Spacing.xs,
  },
  chairAvailable: {
    backgroundColor: theme.background,
    borderColor: theme.success,
  },
  chairOccupied: {
    backgroundColor: theme.tint + '30', // Light tint for occupied
    borderColor: theme.tint,
  },
  chairText: {
    fontSize: ResponsiveFontSizes.small,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    paddingVertical: Spacing.xl,
  },
  // Styles for Guest Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    width: '80%',
    maxHeight: '60%', // Adjust as needed
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  guestPickerItem: {
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  guestPickerItemText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.text,
  },
  guestPickerSeparator: {
    height: 1,
    backgroundColor: theme.divider,
  },
  modalCloseButton: {
    marginTop: Spacing.m,
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.s,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createSeatingStyles(Colors.light);