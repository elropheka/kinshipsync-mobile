import { StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import Fonts from 'constants/fonts';
import {
  Layout,
  Spacing,
  BorderRadius,
  ResponsiveFontSizes,
  IconSizes,
  moderateScale,
} from 'constants/dimensions';

const CARD_WIDTH = Layout.SCREEN_WIDTH * 0.7;
const CARD_HEIGHT = CARD_WIDTH * 1;
export const ITEM_WIDTH = CARD_WIDTH + Spacing.m * 2;

export const createVendorScreenStyles = (theme: typeof Colors.light) => StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  header: {
    marginTop: Spacing.l,
    paddingHorizontal: Spacing.l,
    alignItems: 'center',
  },
  heading: {
    fontSize: ResponsiveFontSizes.header2,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  subheading: {
    marginTop: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    textAlign: 'center',
    color: theme.textSecondary,
  },
  carouselContainer: {
    width: '100%',
    height: CARD_HEIGHT + Spacing.xl,
    marginVertical: Spacing.l,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: Spacing.m,
    backgroundColor: theme.background,
    borderRadius: BorderRadius.l,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: theme.text,
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(6),
    shadowOffset: { width: 0, height: moderateScale(2) },
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: moderateScale(180), // consider CARD_HEIGHT * 0.6 or similar
  },
  imagePlaceholder: { // Added style for placeholder
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundPaper, // Or another suitable placeholder background
  },
  heartIcon: {
    position: 'absolute',
    top: Spacing.m,
    right: Spacing.m,
    backgroundColor: theme.background,
    padding: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  info: {
    padding: Spacing.m,
  },
  category: {
    fontSize: ResponsiveFontSizes.caption,
    fontWeight: Fonts.weights.semiBold,
    color: theme.textSecondary,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: Spacing.xs,
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: theme.text,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  ratingText: {
    marginLeft: Spacing.xs,
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: BorderRadius.round,
    backgroundColor: theme.divider,
    marginHorizontal: Spacing.xs,
  },
  activeDot: {
    backgroundColor: theme.buttonPrimary,
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: BorderRadius.round,
  },
  signupButton: {
    marginTop: Spacing.xl,
    width: Layout.SCREEN_WIDTH * 0.8,
    paddingVertical: Spacing.m,
    backgroundColor: theme.background,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.text,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: theme.buttonPrimary,
  },
  signupText: {
    fontSize: ResponsiveFontSizes.title,
    fontWeight: Fonts.weights.bold,
    color: theme.buttonPrimary, // Themed for primary action
  },
  footer: {
    flexDirection: 'row',
    marginTop: Spacing.m,
  },
  footerText: {
    fontSize: ResponsiveFontSizes.body,
    color: theme.textSecondary,
  },
  loginText: {
    textDecorationLine: 'underline',
    fontWeight: Fonts.weights.semiBold,
    color: theme.buttonPrimary, // Themed for link
  },
});

// For backwards compatibility, export the light theme styles
export const styles = createVendorScreenStyles(Colors.light);