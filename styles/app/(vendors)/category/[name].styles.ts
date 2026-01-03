import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const createCategoryStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center', // Remove, content will fill
    // alignItems: 'center', // Remove, content will fill
    backgroundColor: theme.background,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  vendorCard: {
    backgroundColor: theme.background, // Or theme.backgroundPaper for contrast
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderColor: theme.border, // Use a defined border color
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorImageContainer: { // Renamed from vendorIconContainer for clarity if using images
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: theme.backgroundPaper, // Changed from backgroundMuted
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vendorContent: {
    flex: 1,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  vendorCategoryName: { // Specific for this screen if needed, or reuse vendorCategory style
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.textSecondary,
  },
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: theme.error, // Use a defined error color
    margin: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
    fontSize: 16,
  },
  itemPrice: { // Added style for item price
    fontSize: 14, // Slightly smaller than vendor name
    fontWeight: '600', // Semi-bold
    color: theme.primary, // Use primary color for price, or theme.text
    marginTop: 4,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createCategoryStyles(Colors.light);
