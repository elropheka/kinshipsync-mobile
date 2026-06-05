import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import { Spacing, BorderRadius, ResponsiveFontSizes } from 'constants/dimensions';

export const createDeleteAccountStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.textSecondary,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  logoWrap: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  logo: {
    width: 170,
    height: 52,
  },
  warningHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.error,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  warningSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  dataSection: {
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataItemText: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
  },
  noDataSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.success,
    marginTop: 16,
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  whatHappensSection: {
    padding: 20,
    marginBottom: 32,
  },
  whatHappensItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  whatHappensText: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 12,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  readOnlyInput: {
    opacity: 0.85,
  },
  deleteButton: {
    backgroundColor: theme.error,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationModal: {
    backgroundColor: theme.background,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.error,
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: theme.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelConfirmButton: {
    flex: 1,
    backgroundColor: theme.background,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelConfirmButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createDeleteAccountStyles(Colors.light);
