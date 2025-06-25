import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import { Spacing, BorderRadius, ResponsiveFontSizes, moderateScale } from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    marginBottom: Spacing.m,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: Colors.light.backgroundPaper,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.s,
    borderWidth: 1,
    borderColor: Colors.light.buttonPrimary,
  },
  saveButton: {
    backgroundColor: Colors.light.buttonPrimary,
  },
  controlButtonText: {
    marginLeft: Spacing.s,
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.buttonPrimary,
    fontWeight: Fonts.weights.medium,
  },
  scrollContent: {
    padding: Spacing.m,
  },
  tableContainer: {
    backgroundColor: Colors.light.backgroundPaper,
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
    borderBottomColor: Colors.light.divider,
  },
  tableName: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
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
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.success,
  },
  chairOccupied: {
    backgroundColor: Colors.light.tint + '30', // Light tint for occupied
    borderColor: Colors.light.tint,
  },
  chairText: {
    fontSize: ResponsiveFontSizes.small,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
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
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    width: '80%',
    maxHeight: '60%', // Adjust as needed
  },
  modalTitle: {
    fontSize: ResponsiveFontSizes.header3,
    fontWeight: Fonts.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  guestPickerItem: {
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  guestPickerItemText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.text,
  },
  guestPickerSeparator: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  modalCloseButton: {
    marginTop: Spacing.m,
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.s,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.bold,
  },
});
