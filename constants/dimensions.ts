import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

/**
 * Scales a size based on the screen width.
 * @param size The size to scale.
 * @returns The scaled size.
 */
export const scale = (size: number): number => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scales a size based on the screen height.
 * @param size The size to scale.
 * @returns The scaled size.
 */
export const verticalScale = (size: number): number => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Scales a size based on a moderate scaling factor, balancing width and height.
 * @param size The size to scale.
 * @param factor The scaling factor (default is 0.5).
 * @returns The scaled size.
 */
export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

/**
 * Responsive font sizes.
 * Uses PixelRatio.getFontScale() to respect user's font size preferences.
 */
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
  xxs: moderateScale(2),    // For very fine spacing
  xs: moderateScale(4),     // Extra small
  s: moderateScale(8),      // Small
  m: moderateScale(16),     // Medium (standard)
  l: moderateScale(24),     // Large
  xl: moderateScale(32),    // Extra large
  xxl: moderateScale(48),   // Extra extra large
  screenHorizontalPadding: moderateScale(16), // Standard horizontal padding for screens
  screenVerticalPadding: moderateScale(16),   // Standard vertical padding for screens
};

export const BorderRadius = {
  xs: moderateScale(2),
  s: moderateScale(4),      // Small radius, e.g., for tags, small buttons
  m: moderateScale(8),      // Medium radius, e.g., for cards, inputs
  l: moderateScale(12),     // Large radius, e.g., for modals, larger cards
  xl: moderateScale(16),    // Extra large radius
  xxl: moderateScale(24),   // Extra extra large radius
  round: 999,               // For circular elements
};

export const IconSizes = {
  xs: moderateScale(12),
  s: moderateScale(16),
  m: moderateScale(20),    // Standard icon size
  l: moderateScale(24),
  xl: moderateScale(30),
  xxl: moderateScale(36),
};

export const Layout = {
  // Common element heights
  inputHeight: moderateScale(48),
  buttonHeight: moderateScale(48),
  headerHeight: Platform.OS === 'ios' ? moderateScale(60) : moderateScale(56), // Adjusted for platform differences
  // Screen dimensions (can be used directly or for calculations)
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
