import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

export const scale = (size: number): number => (SCREEN_WIDTH / guidelineBaseWidth) * size;

export const verticalScale = (size: number): number => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

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
  screenHorizontalPadding: moderateScale(16),
  screenVerticalPadding: moderateScale(16),
};

export const BorderRadius = {
  xs: moderateScale(2),
  s: moderateScale(4),
  m: moderateScale(8),
  l: moderateScale(12),
  xl: moderateScale(16),
  xxl: moderateScale(24),
  round: 999,
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
