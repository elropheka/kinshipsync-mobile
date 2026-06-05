import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';

type BrandCardVariant = 'default' | 'cream' | 'orange' | 'green' | 'rust';

interface BrandCardProps extends ViewProps {
  variant?: BrandCardVariant;
}

export class BrandCard extends React.Component<BrandCardProps> {
  public render(): React.ReactNode {
    return <BrandCardInner {...this.props} />;
  }
}

const BrandCardInner: React.FC<BrandCardProps> = ({
  variant = 'default',
  style,
  children,
  ...rest
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  const variantStyle =
    variant === 'cream'
      ? styles.cream
      : variant === 'orange'
        ? styles.orange
        : variant === 'green'
          ? styles.green
          : variant === 'rust'
            ? styles.rust
            : styles.default;

  return (
    <View style={[styles.base, variantStyle, style]} {...rest}>
      {children}
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    base: {
      borderRadius: BorderRadius.xl,
      padding: Spacing.m,
      overflow: 'hidden',
    },
    default: {
      backgroundColor: theme.backgroundPaper,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cream: {
      backgroundColor: theme.background,
    },
    orange: {
      backgroundColor: theme.accent,
    },
    green: {
      backgroundColor: theme.primary,
    },
    rust: {
      backgroundColor: theme.secondary,
    },
  });

export default BrandCard;
