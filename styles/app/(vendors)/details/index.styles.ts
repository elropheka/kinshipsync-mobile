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

export const createIndexStyles = (theme: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.l,
    backgroundColor: theme.background,
    zIndex: 10,
  },
  backButton: {
    padding: Spacing.s,
  },
  headerTitle: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: theme.text,
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
    backgroundColor: theme.background + '80',
    marginHorizontal: Spacing.xs,
  },
  activePaginationDot: {
    backgroundColor: theme.background,
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
    color: theme.text,
    flexShrink: 1,
  },
  vendorCategory: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    fontFamily: Fonts.bodyRegular,
    marginTop: Spacing.xxs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  ratingText: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    fontWeight: Fonts.weights.semiBold,
    color: theme.text,
  },
  contactButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Spacing.m,
    paddingVertical: Spacing.s,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.divider,
  },
  contactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.s,
  },
  contactButtonText: {
    marginTop: Spacing.xs,
    fontSize: ResponsiveFontSizes.caption,
    color: theme.buttonPrimary,
    fontFamily: Fonts.bodyMedium,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
    paddingHorizontal: Spacing.m,
  },
  sectionTitle: {
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: theme.text,
  },
  sectionContent: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
  },
  descriptionText: {
    fontSize: ResponsiveFontSizes.body,
    lineHeight: ResponsiveFontSizes.body * 1.5,
    color: theme.textSecondary,
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
    color: theme.textSecondary,
    marginLeft: Spacing.xs,
    flex: 1,
    fontFamily: Fonts.bodyRegular,
  },
  serviceItem: {
    marginBottom: Spacing.m,
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
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
    color: theme.text,
  },
  servicePrice: {
    fontSize: ResponsiveFontSizes.subtitle - 1,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: theme.buttonPrimary,
  },
  serviceDescription: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    lineHeight: ResponsiveFontSizes.body * 1.4,
    fontFamily: Fonts.bodyRegular,
  },
  reviewItem: {
    marginBottom: Spacing.m,
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.divider,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  reviewAuthor: {
    fontSize: ResponsiveFontSizes.subtitle - 1,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
    color: theme.text,
  },
  reviewDate: {
    fontSize: ResponsiveFontSizes.caption,
    color: theme.textSecondary,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.bodyRegular,
  },
  reviewComment: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
    lineHeight: ResponsiveFontSizes.body * 1.4,
    fontFamily: Fonts.bodyRegular,
    marginTop: Spacing.xs,
  },
  writeReviewButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
    backgroundColor: theme.backgroundPaper,
    marginTop: Spacing.s,
  },
  writeReviewText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.buttonPrimary,
    fontFamily: Fonts.bodyMedium,
  },
  bookButtonContainer: {
    padding: Spacing.m,
    backgroundColor: theme.background,
    borderTopWidth: 1,
    borderTopColor: theme.divider,
  },
  bookButton: {
    backgroundColor: theme.buttonPrimary,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  bookButtonText: {
    color: theme.primaryContrastText,
    fontSize: ResponsiveFontSizes.subtitle,
    fontWeight: Fonts.weights.semiBold,
    fontFamily: Fonts.headerSemiBold,
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createIndexStyles(Colors.light);