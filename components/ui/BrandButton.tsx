import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import Fonts from '@/constants/fonts';
import { BorderRadius, Spacing } from '@/constants/dimensions';

type BrandButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline';

interface BrandButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: BrandButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

export class BrandButton extends React.Component<BrandButtonProps> {
  public render(): React.ReactNode {
    const {
      label,
      variant = 'primary',
      loading = false,
      fullWidth = false,
      disabled,
      style,
      ...rest
    } = this.props;

    return (
      <BrandButtonInner
        label={label}
        variant={variant}
        loading={loading}
        fullWidth={fullWidth}
        disabled={disabled}
        style={style}
        {...rest}
      />
    );
  }
}

const BrandButtonInner: React.FC<BrandButtonProps> = ({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);
  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle[] = [styles.base];
  if (fullWidth) buttonStyle.push(styles.fullWidth);
  if (variant === 'primary') buttonStyle.push(styles.primary);
  if (variant === 'secondary') buttonStyle.push(styles.secondary);
  if (variant === 'tertiary') buttonStyle.push(styles.tertiary);
  if (variant === 'outline') buttonStyle.push(styles.outline);
  if (isDisabled) buttonStyle.push(styles.disabled);
  if (style) buttonStyle.push(style as ViewStyle);

  const textStyle =
    variant === 'outline' || variant === 'tertiary'
      ? styles.outlineText
      : styles.label;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      style={buttonStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? currentColors.primary : currentColors.textLight} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    base: {
      minHeight: 48,
      paddingHorizontal: Spacing.l,
      paddingVertical: Spacing.s,
      borderRadius: BorderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullWidth: {
      alignSelf: 'stretch',
    },
    primary: {
      backgroundColor: theme.primary,
    },
    secondary: {
      backgroundColor: theme.accent,
    },
    tertiary: {
      backgroundColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    disabled: {
      opacity: 0.55,
    },
    label: {
      fontFamily: Fonts.buttonBold,
      fontSize: 16,
      color: theme.textLight,
    },
    outlineText: {
      fontFamily: Fonts.buttonBold,
      fontSize: 16,
      color: theme.primary,
    },
  });

export default BrandButton;
