type FontWeight = '300' | '400' | '500' | '600' | '700' | '800';

type FontFamily =
  | 'Inter-ExtraBold'
  | 'Inter-Bold'
  | 'Inter-SemiBold'
  | 'Inter-Medium'
  | 'Inter-Regular'
  | 'Inter-Light';

interface FontWeights {
  light: FontWeight;
  regular: FontWeight;
  medium: FontWeight;
  semiBold: FontWeight;
  bold: FontWeight;
  extraBold: FontWeight;
}

interface FontDefinition {
  headerBold: FontFamily;
  headerSemiBold: FontFamily;
  headerMedium: FontFamily;
  titleBold: FontFamily;
  titleSemiBold: FontFamily;
  titleRegular: FontFamily;
  bodyRegular: FontFamily;
  bodyMedium: FontFamily;
  bodyLight: FontFamily;
  captionRegular: FontFamily;
  captionMedium: FontFamily;
  buttonBold: FontFamily;
  buttonMedium: FontFamily;
  displayBold: FontFamily;
  displayLight: FontFamily;
  weights: FontWeights;
}

const Fonts: FontDefinition = {
  headerBold: 'Inter-Bold',
  headerSemiBold: 'Inter-SemiBold',
  headerMedium: 'Inter-Medium',
  titleBold: 'Inter-Bold',
  titleSemiBold: 'Inter-SemiBold',
  titleRegular: 'Inter-Regular',
  bodyRegular: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodyLight: 'Inter-Light',
  captionRegular: 'Inter-Regular',
  captionMedium: 'Inter-Medium',
  buttonBold: 'Inter-Bold',
  buttonMedium: 'Inter-Medium',
  displayBold: 'Inter-ExtraBold',
  displayLight: 'Inter-Light',
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
};

interface FontSizeDefinition {
  display: number;
  header1: number;
  header2: number;
  header3: number;
  header4: number;
  title: number;
  subtitle: number;
  bodyLg: number;
  body: number;
  bodySm: number;
  caption: number;
  small: number;
}

/** Mobile type scale from docs/branding.md */
export const FontSizes: FontSizeDefinition = {
  display: 48,
  header1: 40,
  header2: 32,
  header3: 24,
  header4: 20,
  title: 18,
  subtitle: 16,
  bodyLg: 18,
  body: 16,
  bodySm: 14,
  caption: 12,
  small: 10,
};

interface LineHeightDefinition {
  display: number;
  header: number;
  body: number;
  tight: number;
}

export const LineHeights: LineHeightDefinition = {
  display: 1.3,
  header: 1.3,
  body: 1.5,
  tight: 1.2,
};

export default Fonts;
