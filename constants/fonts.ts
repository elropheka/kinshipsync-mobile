type FontWeight = '300' | '400' | '500' | '600' | '700';

type FontFamily = 
  | 'Poppins-Bold'
  | 'Poppins-SemiBold'
  | 'Poppins-Medium'
  | 'Poppins-Regular'
  | 'Poppins-Light';

interface FontWeights {
  light: FontWeight;
  regular: FontWeight;
  medium: FontWeight;
  semiBold: FontWeight;
  bold: FontWeight;
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
  headerBold: 'Poppins-Bold',
  headerSemiBold: 'Poppins-SemiBold',
  headerMedium: 'Poppins-Medium',
  
  titleBold: 'Poppins-Bold',
  titleSemiBold: 'Poppins-SemiBold',
  titleRegular: 'Poppins-Regular',
  
  bodyRegular: 'Poppins-Regular',
  bodyMedium: 'Poppins-Medium',
  bodyLight: 'Poppins-Light',
  
  captionRegular: 'Poppins-Regular',
  captionMedium: 'Poppins-Medium',
  
  buttonBold: 'Poppins-Bold',
  buttonMedium: 'Poppins-Medium',
  
  displayBold: 'Poppins-Bold',
  displayLight: 'Poppins-Light',
  
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  }
};

interface FontSizeDefinition {
  display: number;
  header1: number;
  header2: number;
  header3: number;
  title: number;
  subtitle: number;
  body: number;
  caption: number;
  small: number;
}

export const FontSizes: FontSizeDefinition = {
  display: 32,
  header1: 28,
  header2: 24,
  header3: 20,
  title: 18,
  subtitle: 16,
  body: 14,
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
  display: 1.4,
  header: 1.3,
  body: 1.5,
  tight: 1.2,
};

export default Fonts;