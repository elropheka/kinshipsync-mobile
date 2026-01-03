import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';

export const createVendorDetailsStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    color: theme.error,
    margin: 16,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
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
    backgroundColor: theme.backgroundPaper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
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
    color: theme.text,
    marginLeft: 4,
  },
  numberOfReviews: {
    fontSize: 16,
    color: theme.textSecondary,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: theme.border,
    paddingBottom: 4,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.textSecondary,
  },
  infoText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  linkText: {
    color: theme.tint,
    textDecorationLine: 'underline',
  },
  listItem: {
    fontSize: 16,
    color: theme.textSecondary,
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
    backgroundColor: theme.backgroundPaper,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
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
    color: theme.text,
  },
  ratingContainer: { // Re-used from category screen, ensure consistency or make specific
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: { // Re-used
    marginLeft: 4,
    fontSize: 14,
    color: theme.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  // Styles for Vendor Item Cards within Vendor Details
  itemCard: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundPaper,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
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
    backgroundColor: theme.backgroundSecondary, // Slightly different placeholder bg
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  itemPriceText: {
    fontSize: 14,
    color: theme.primary,
    marginTop: 4,
  },
  itemCategoryText: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createVendorDetailsStyles(Colors.light);
