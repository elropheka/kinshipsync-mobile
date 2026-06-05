import { Dimensions, PixelRatio, Platform } from 'react-native';
import { brandRadius } from './brandTokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

export const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  return Math.max(width, height) >= 768;
};

export const scale = (size: number): number => {
  if (isTablet()) {
    return size * (SCREEN_WIDTH / 768);
  }
  return (SCREEN_WIDTH / guidelineBaseWidth) * size;
};

export const verticalScale = (size: number): number => {
  if (isTablet()) {
    return size * (SCREEN_HEIGHT / 1024);
  }
  return (SCREEN_HEIGHT / guidelineBaseHeight) * size;
};

export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

export const ResponsiveFontSizes = {
  display: PixelRatio.getFontScale() * moderateScale(32),
  header1: PixelRatio.getFontScale() * moderateScale(28),
  header2: PixelRatio.getFontScale() * moderateScale(24),
  header3: PixelRatio.getFontScale() * moderateScale(20),
  title: PixelRatio.getFontScale() * moderateScale(18),
  subtitle: PixelRatio.getFontScale() * moderateScale(16),
  body: PixelRatio.getFontScale() * moderateScale(14),
  caption: PixelRatio.getFontScale() * moderateScale(12),
  small: PixelRatio.getFontScale() * moderateScale(10),
};

export const Spacing = {
  xxs: moderateScale(2),
  xs: moderateScale(4),
  s: moderateScale(8),
  m: moderateScale(16),
  l: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
  xxxl: moderateScale(64),
  xxxxl: moderateScale(80), 
  screenHorizontalPadding: moderateScale(16),
  screenVerticalPadding: moderateScale(16),
};

export const BorderRadius = {
  xs: moderateScale(2),
  s: moderateScale(brandRadius.sm),
  m: moderateScale(brandRadius.md),
  l: moderateScale(brandRadius.lg),
  xl: moderateScale(brandRadius.xl),
  xxl: moderateScale(brandRadius['2xl']),
  round: brandRadius.full,
};

export const IconSizes = {
  xs: moderateScale(12),
  s: moderateScale(16),
  m: moderateScale(20),
  l: moderateScale(24),
  xl: moderateScale(30),
  xxl: moderateScale(36),
};

export const Layout = {
  inputHeight: moderateScale(48),
  buttonHeight: moderateScale(48),
  headerHeight: Platform.OS === 'ios' ? moderateScale(60) : moderateScale(56),
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};

export default {
  scale,
  verticalScale,
  moderateScale,
  ResponsiveFontSizes,
  Spacing,
  BorderRadius,
  IconSizes,
  Layout,
};
