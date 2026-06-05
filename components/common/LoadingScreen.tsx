import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BrandText } from '@/components/ui/BrandText';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';
import { Spacing } from '@/constants/dimensions';

export class LoadingScreen extends React.Component {
  public render(): React.ReactNode {
    return <LoadingScreenInner />;
  }
}

const LoadingScreenInner: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  return (
    <View style={styles.container}>
      <BrandLoadingSpinner size="large" />
      <BrandText variant="body" color="secondary" style={styles.label}>
        Loading...
      </BrandText>
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      paddingHorizontal: Spacing.xl,
    },
    label: {
      marginTop: Spacing.m,
    },
  });
