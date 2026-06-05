import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import Fonts, { FontSizes } from '@/constants/fonts';

type BrandTextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'title'
  | 'body'
  | 'bodyLg'
  | 'caption'
  | 'button';

interface BrandTextProps extends TextProps {
  variant?: BrandTextVariant;
  color?: 'primary' | 'secondary' | 'light' | 'accent';
}

export class BrandText extends React.Component<BrandTextProps> {
  public render(): React.ReactNode {
    return <BrandTextInner {...this.props} />;
  }
}

const BrandTextInner: React.FC<BrandTextProps> = ({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...rest
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  const variantStyle = styles[variant];
  const colorStyle =
    color === 'secondary'
      ? styles.colorSecondary
      : color === 'light'
        ? styles.colorLight
        : color === 'accent'
          ? styles.colorAccent
          : styles.colorPrimary;

  return (
    <Text style={[variantStyle, colorStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    display: {
      fontFamily: Fonts.displayBold,
      fontSize: FontSizes.display,
      lineHeight: FontSizes.display * 1.3,
    },
    h1: {
      fontFamily: Fonts.headerBold,
      fontSize: FontSizes.header1,
      lineHeight: FontSizes.header1 * 1.3,
    },
    h2: {
      fontFamily: Fonts.headerBold,
      fontSize: FontSizes.header2,
      lineHeight: FontSizes.header2 * 1.3,
    },
    h3: {
      fontFamily: Fonts.headerSemiBold,
      fontSize: FontSizes.header3,
      lineHeight: FontSizes.header3 * 1.3,
    },
    h4: {
      fontFamily: Fonts.headerSemiBold,
      fontSize: FontSizes.header4,
      lineHeight: FontSizes.header4 * 1.3,
    },
    title: {
      fontFamily: Fonts.titleSemiBold,
      fontSize: FontSizes.title,
      lineHeight: FontSizes.title * 1.3,
    },
    body: {
      fontFamily: Fonts.bodyRegular,
      fontSize: FontSizes.body,
      lineHeight: FontSizes.body * 1.5,
    },
    bodyLg: {
      fontFamily: Fonts.bodyRegular,
      fontSize: FontSizes.bodyLg,
      lineHeight: FontSizes.bodyLg * 1.5,
    },
    caption: {
      fontFamily: Fonts.captionRegular,
      fontSize: FontSizes.caption,
      lineHeight: FontSizes.caption * 1.2,
    },
    button: {
      fontFamily: Fonts.buttonBold,
      fontSize: FontSizes.body,
      lineHeight: FontSizes.body * 1.2,
    },
    colorPrimary: { color: theme.text },
    colorSecondary: { color: theme.textSecondary },
    colorLight: { color: theme.textLight },
    colorAccent: { color: theme.accent },
  });

export default BrandText;
