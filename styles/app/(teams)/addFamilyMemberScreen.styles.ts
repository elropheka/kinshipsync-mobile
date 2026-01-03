import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors'; // Assuming Colors is in constants

export const createAddFamilyMemberScreenStyles = (theme: typeof Colors.light) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: { // General container for padding, used for the non-form part
    flex: 1,
    padding: 20,
  },
  formContainer: { // Specific for scrollable forms, like the add root member form
    padding: 20,
    flexGrow: 1, 
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: { // Style for new member form inputs (name, image URL)
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: theme.backgroundPaper, // Consistent background for inputs
    color: theme.text, // Ensure text color is also from theme
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: { // For user search input
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: theme.backgroundPaper,
    color: theme.text,
  },
  searchButton: {
    padding: 10,
  },
  resultsList: {
    maxHeight: 250, 
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  selectedUserItem: {
    backgroundColor: theme.primaryLight, // A light shade of primary for selection
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: theme.divider, // Placeholder background
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    // Can add specific styles if the placeholder View needs more than just centering icons
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
  userEmail: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  noResultsText: {
    textAlign: 'center',
    color: theme.textSecondary,
    marginVertical: 10,
  },
  selectionConfirmation: {
    marginTop: 20,
    padding: 15,
    backgroundColor: theme.backgroundPaper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedUserInfo: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: theme.text,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.divider,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.backgroundSecondary, // Slightly different from divider
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  uploadButton: {
    backgroundColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20, // Space before the main action button
    alignSelf: 'center', // Center the button
    minWidth: 150, // Give it some minimum width
  },
  uploadButtonText: {
    color: theme.primaryContrastText,
    fontSize: 16,
    fontWeight: '500',
  }
});

// For backwards compatibility, export the light theme styles
export const styles = createAddFamilyMemberScreenStyles(Colors.light);