import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import { BrandText } from './BrandText';
import { BrandButton } from './BrandButton';

interface BrandEmptyStateProps extends ViewProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export class BrandEmptyState extends React.Component<BrandEmptyStateProps> {
  public render(): React.ReactNode {
    return <BrandEmptyStateInner {...this.props} />;
  }
}

const BrandEmptyStateInner: React.FC<BrandEmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onActionPress,
  iconName = 'leaf-outline',
  style,
  ...rest
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconName} size={32} color={currentColors.textLight} />
      </View>
      <BrandText variant="h4" style={styles.title}>
        {title}
      </BrandText>
      {message ? (
        <BrandText variant="body" color="secondary" style={styles.message}>
          {message}
        </BrandText>
      ) : null}
      {actionLabel && onActionPress ? (
        <BrandButton label={actionLabel} onPress={onActionPress} style={styles.button} />
      ) : null}
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.xl,
      backgroundColor: theme.neutralBg,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: theme.border,
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: BorderRadius.round,
      backgroundColor: theme.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.m,
    },
    title: {
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    message: {
      textAlign: 'center',
      marginBottom: Spacing.m,
    },
    button: {
      marginTop: Spacing.s,
      minWidth: 160,
    },
  });

export default BrandEmptyState;
