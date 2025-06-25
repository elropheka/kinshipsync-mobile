import { StyleSheet, Platform } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  Layout,
  moderateScale,
} from 'constants/dimensions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: Colors.light.background,
    zIndex: 10, // Keep zIndex for potential overlapping elements
  },
  backButton: {
    padding: Spacing.s,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold, // Keep existing font family
    color: Colors.light.text,
  },
  favoriteButton: {
    padding: Spacing.s,
  },
  imageContainer: {
    width: Layout.SCREEN_WIDTH,
    height: Layout.SCREEN_WIDTH * 0.7,
    position: 'relative',
  },
  vendorImage: {
    width: Layout.SCREEN_WIDTH,
    height: Layout.SCREEN_WIDTH * 0.7,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: Spacing.m,
    alignSelf: 'center',
  },
  paginationDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.light.background + '80',
    marginHorizontal: Spacing.xs,
  },
  activePaginationDot: {
    backgroundColor: Colors.light.background,
  },
  infoContainer: {
    padding: Spacing.m,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.s,
  },
  vendorName: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    fontFamily: Fonts.headerBold,
    color: Colors.light.text,
    flexShrink: 1, // Allow name to wrap if long
  },
  vendorCategory: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    fontFamily: Fonts.bodyRegular,
    marginTop: Spacing.xxs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Removed marginTop as it's part of titleRow spacing or can be added to vendorCategory
  },
  ratingText: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.light.text,
  },
  contactButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Spacing.m,
    paddingVertical: Spacing.s,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.divider,
  },
  contactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.s, // Added padding for better touch area
  },
  contactButtonText: {
    marginTop: Spacing.xs,
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.buttonPrimary,
    fontFamily: Fonts.bodyMedium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    paddingHorizontal: Spacing.m, // Added horizontal padding for consistency
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: Colors.light.text,
  },
  sectionContent: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m, // Added horizontal padding for consistency
  },
  descriptionText: {
    fontSize: ResponsiveFontSizes.body,
    lineHeight: ResponsiveFontSizes.body * 1.5,
    color: Colors.light.textSecondary,
    fontFamily: Fonts.bodyRegular,
    marginBottom: Spacing.s,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  addressText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
    flex: 1,
    fontFamily: Fonts.bodyRegular,
  },
  serviceItem: {
    marginBottom: Spacing.m,
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  serviceName: {
    fontSize: ResponsiveFontSizes.subtitle - 1,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: Colors.light.text,
  },
  servicePrice: {
    fontSize: ResponsiveFontSizes.subtitle - 1,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: Colors.light.buttonPrimary,
  },
  serviceDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    lineHeight: ResponsiveFontSizes.body * 1.4,
    fontFamily: Fonts.bodyRegular,
  },
  reviewItem: {
    marginBottom: Spacing.m,
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: Spacing.xs, // Added for spacing
  },
  reviewAuthor: {
    fontSize: ResponsiveFontSizes.subtitle - 1,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: Colors.light.text,
  },
  reviewDate: {
    fontSize: ResponsiveFontSizes.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.bodyRegular,
  },
  reviewComment: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.textSecondary,
    lineHeight: ResponsiveFontSizes.body * 1.4,
    fontFamily: Fonts.bodyRegular,
    marginTop: Spacing.xs, // Added margin top
  },
  writeReviewButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.backgroundPaper,
    marginTop: Spacing.s,
  },
  writeReviewText: {
    fontSize: ResponsiveFontSizes.body,
    color: Colors.light.buttonPrimary,
    fontFamily: Fonts.bodyMedium,
  },
  bookButtonContainer: {
    padding: Spacing.m,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
  },
  bookButton: {
    backgroundColor: Colors.light.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  bookButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
  },
});
