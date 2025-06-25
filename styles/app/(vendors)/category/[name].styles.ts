import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center', // Remove, content will fill
    // alignItems: 'center', // Remove, content will fill
    backgroundColor: Colors.light.background,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  vendorCard: {
    backgroundColor: Colors.light.background, // Or Colors.light.backgroundPaper for contrast
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderColor: Colors.light.border, // Use a defined border color
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorImageContainer: { // Renamed from vendorIconContainer for clarity if using images
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundPaper, // Changed from backgroundMuted
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
    color: Colors.light.text,
  },
  vendorCategoryName: { // Specific for this screen if needed, or reuse vendorCategory style
    fontSize: 14,
    color: Colors.light.textSecondary,
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
    color: Colors.light.textSecondary,
  },
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: Colors.light.error, // Use a defined error color
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
    color: Colors.light.textSecondary,
    fontSize: 16,
  },
  itemPrice: { // Added style for item price
    fontSize: 14, // Slightly smaller than vendor name
    fontWeight: '600', // Semi-bold
    color: Colors.light.primary, // Use primary color for price, or Colors.light.text
    marginTop: 4,
  },
});
