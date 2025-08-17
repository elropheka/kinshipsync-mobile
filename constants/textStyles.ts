import { TextStyle } from 'react-native';
import { Colors } from './Colors';
import Fonts from './fonts';
import { FontSizes, LineHeights } from './fonts';

// Base text styles that can be extended
export const BaseTextStyles = {
  // Headers
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

  // Titles
  title: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: FontSizes.title,
    lineHeight: FontSizes.title * LineHeights.header,
    color: Colors.light.text,
  } as TextStyle,
  
  subtitle: {
    fontFamily: Fonts.titleMedium,
    fontSize: FontSizes.subtitle,
    lineHeight: FontSizes.subtitle * LineHeights.header,
    color: Colors.light.text,
  } as TextStyle,

  // Body text
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

  // Captions
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

  // Buttons
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

  // Display text
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

// Text color variants
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

// Text alignment variants
export const TextAlign = {
  left: { textAlign: 'left' as const },
  center: { textAlign: 'center' as const },
  right: { textAlign: 'right' as const },
  justify: { textAlign: 'justify' as const },
} as const;

// Text weight variants
export const TextWeight = {
  light: { fontWeight: Fonts.weights.light as any },
  regular: { fontWeight: Fonts.weights.regular as any },
  medium: { fontWeight: Fonts.weights.medium as any },
  semiBold: { fontWeight: Fonts.weights.semiBold as any },
  bold: { fontWeight: Fonts.weights.bold as any },
} as const;

// Utility function to combine text styles
export const combineTextStyles = (...styles: (TextStyle | undefined)[]): TextStyle => {
  return styles.reduce((combined, style) => {
    if (style) {
      return { ...combined, ...style };
    }
    return combined;
  }, {} as TextStyle);
};

// Predefined combinations for common use cases
export const CommonTextStyles = {
  // Section headers
  sectionHeader: combineTextStyles(BaseTextStyles.subtitle, TextWeight.semiBold),
  
  // Form labels
  formLabel: combineTextStyles(BaseTextStyles.bodyMedium, TextWeight.medium),
  
  // Input text
  inputText: combineTextStyles(BaseTextStyles.body, TextWeight.regular),
  
  // Button text
  buttonText: combineTextStyles(BaseTextStyles.button, TextWeight.medium),
  
  // Error text
  errorText: combineTextStyles(BaseTextStyles.body, TextColors.error),
  
  // Success text
  successText: combineTextStyles(BaseTextStyles.body, TextColors.success),
  
  // Caption text
  captionText: combineTextStyles(BaseTextStyles.caption, TextColors.secondary),
  
  // Navigation title
  navTitle: combineTextStyles(BaseTextStyles.title, TextWeight.semiBold, TextAlign.center),
} as const;

// Export everything for easy access
export default {
  BaseTextStyles,
  TextColors,
  TextAlign,
  TextWeight,
  CommonTextStyles,
  combineTextStyles,
};
