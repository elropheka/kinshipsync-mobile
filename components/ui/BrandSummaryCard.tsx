import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import { BrandText } from './BrandText';

type BrandSummaryCardVariant = 'sand' | 'golden' | 'green';

interface BrandSummaryCardProps extends ViewProps {
  value: number | string;
  label: string;
  variant?: BrandSummaryCardVariant;
}

export class BrandSummaryCard extends React.Component<BrandSummaryCardProps> {
  public render(): React.ReactNode {
    return <BrandSummaryCardInner {...this.props} />;
  }
}

const BrandSummaryCardInner: React.FC<BrandSummaryCardProps> = ({
  value,
  label,
  variant = 'sand',
  style,
  ...rest
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors, variant);

  return (
    <View style={[styles.card, style]} {...rest}>
      <BrandText variant="h3" style={styles.value}>
        {value}
      </BrandText>
      <BrandText variant="caption" color="secondary" style={styles.label}>
        {label}
      </BrandText>
    </View>
  );
};

const createStyles = (theme: typeof Colors.light, variant: BrandSummaryCardVariant) => {
  const backgroundColor =
    variant === 'golden'
      ? theme.accentHighlight
      : variant === 'green'
        ? theme.neutralBg
        : theme.backgroundSecondary;

  const valueColor =
    variant === 'golden' ? theme.secondary : variant === 'green' ? theme.primary : theme.text;

  return StyleSheet.create({
    card: {
      width: '31%',
      padding: Spacing.m,
      borderRadius: BorderRadius.l,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
      borderWidth: 1,
      borderColor: theme.border,
    },
    value: {
      color: valueColor,
    },
    label: {
      marginTop: Spacing.xs,
      textAlign: 'center',
    },
  });
};

export default BrandSummaryCard;
