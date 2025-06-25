import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContentContainer: {
    paddingBottom: 20, // Ensure space for content at the bottom
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: Colors.light.error,
    margin: 16,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    margin: 16,
    fontSize: 16,
  },
  logoImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  logoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: Colors.light.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 4,
  },
  numberOfReviews: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    paddingBottom: 4,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.textSecondary,
  },
  infoText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  linkText: {
    color: Colors.light.tint,
    textDecorationLine: 'underline',
  },
  listItem: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginLeft: 8, // For bullet point effect
    marginBottom: 2,
  },
  portfolioScrollView: {
    marginVertical: 8,
  },
  portfolioImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  reviewCard: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  ratingContainer: { // Re-used from category screen, ensure consistency or make specific
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: { // Re-used
    marginLeft: 4,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  // Styles for Vendor Item Cards within Vendor Details
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: Colors.light.backgroundSecondary, // Slightly different placeholder bg
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  itemPriceText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginTop: 4,
  },
  itemCategoryText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
