import { TextStyle } from 'react-native';
import { Colors } from './Colors';
import Fonts from './fonts';
import { FontSizes, LineHeights } from './fonts';

export const BaseTextStyles = {
  header1: {
    fontFamily: Fonts.headerBold,
    fontSize: FontSizes.header1,
    lineHeight: FontSizes.header1 * LineHeights.header,
    color: Colors.light.text,
  } as TextStyle,
  
  header2: {
    fontFamily: Fonts.headerBold,
    fontSize: FontSizes.header2,
    lineHeight: FontSizes.header2 * LineHeights.header,
    color: Colors.light.text,
  } as TextStyle,
  
  header3: {
    fontFamily: Fonts.headerSemiBold,
    fontSize: FontSizes.header3,
    lineHeight: FontSizes.header3 * LineHeights.header,
    color: Colors.light.text,
  } as TextStyle,

  title: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: FontSizes.title,
    lineHeight: FontSizes.title * LineHeights.header,
    color: Colors.light.text,
  } as TextStyle,
  
  subtitle: {
    fontFamily: Fonts.titleRegular,
    fontSize: FontSizes.subtitle,
    lineHeight: FontSizes.subtitle * LineHeights.header,
    color: Colors.light.text,
  } as TextStyle,

  body: {
    fontFamily: Fonts.bodyRegular,
    fontSize: FontSizes.body,
    lineHeight: FontSizes.body * LineHeights.body,
    color: Colors.light.text,
  } as TextStyle,
  
  bodyMedium: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSizes.body,
    lineHeight: FontSizes.body * LineHeights.body,
    color: Colors.light.text,
  } as TextStyle,
  
  bodyLight: {
    fontFamily: Fonts.bodyLight,
    fontSize: FontSizes.body,
    lineHeight: FontSizes.body * LineHeights.body,
    color: Colors.light.text,
  } as TextStyle,

  caption: {
    fontFamily: Fonts.captionRegular,
    fontSize: FontSizes.caption,
    lineHeight: FontSizes.caption * LineHeights.tight,
    color: Colors.light.textSecondary,
  } as TextStyle,
  
  captionMedium: {
    fontFamily: Fonts.captionMedium,
    fontSize: FontSizes.caption,
    lineHeight: FontSizes.caption * LineHeights.tight,
    color: Colors.light.textSecondary,
  } as TextStyle,

  button: {
    fontFamily: Fonts.buttonMedium,
    fontSize: FontSizes.body,
    lineHeight: FontSizes.body * LineHeights.tight,
    color: Colors.light.textLight,
  } as TextStyle,
  
  buttonBold: {
    fontFamily: Fonts.buttonBold,
    fontSize: FontSizes.body,
    lineHeight: FontSizes.body * LineHeights.tight,
    color: Colors.light.textLight,
  } as TextStyle,

  display: {
    fontFamily: Fonts.displayBold,
    fontSize: FontSizes.display,
    lineHeight: FontSizes.display * LineHeights.display,
    color: Colors.light.text,
  } as TextStyle,
  
  displayLight: {
    fontFamily: Fonts.displayLight,
    fontSize: FontSizes.display,
    lineHeight: FontSizes.display * LineHeights.display,
    color: Colors.light.text,
  } as TextStyle,
};

export const TextColors = {
  primary: { color: Colors.light.text },
  secondary: { color: Colors.light.textSecondary },
  light: { color: Colors.light.textLight },
  darkContrast: { color: Colors.light.textDarkContrast },
  success: { color: Colors.light.success },
  error: { color: Colors.light.error },
  warning: { color: Colors.light.warning },
  info: { color: Colors.light.info },
  primaryColor: { color: Colors.light.primary },
  accent: { color: Colors.light.accent },
} as const;

export const TextAlign = {
  left: { textAlign: 'left' as const },
  center: { textAlign: 'center' as const },
  right: { textAlign: 'right' as const },
  justify: { textAlign: 'justify' as const },
} as const;

export const TextWeight = {
  light: { fontWeight: Fonts.weights.light as any },
  regular: { fontWeight: Fonts.weights.regular as any },
  medium: { fontWeight: Fonts.weights.medium as any },
  semiBold: { fontWeight: Fonts.weights.semiBold as any },
  bold: { fontWeight: Fonts.weights.bold as any },
} as const;

export const combineTextStyles = (...styles: (TextStyle | undefined)[]): TextStyle => {
  return styles.reduce((combined, style) => {
    if (style) {
      return { ...combined, ...style };
    }
    return combined;
  }, {} as TextStyle) as TextStyle;
};

export const CommonTextStyles = {
  sectionHeader: combineTextStyles(BaseTextStyles.subtitle, TextWeight.semiBold),
  formLabel: combineTextStyles(BaseTextStyles.bodyMedium, TextWeight.medium),
  inputText: combineTextStyles(BaseTextStyles.body, TextWeight.regular),
  buttonText: combineTextStyles(BaseTextStyles.button, TextWeight.medium),
  errorText: combineTextStyles(BaseTextStyles.body, TextColors.error),
  successText: combineTextStyles(BaseTextStyles.body, TextColors.success),
  captionText: combineTextStyles(BaseTextStyles.caption, TextColors.secondary),
  navTitle: combineTextStyles(BaseTextStyles.title, TextWeight.semiBold, TextAlign.center),
} as const;

export default {
  BaseTextStyles,
  TextColors,
  TextAlign,
  TextWeight,
  CommonTextStyles,
  combineTextStyles,
};
