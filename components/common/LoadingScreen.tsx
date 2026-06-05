import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BrandText } from '@/components/ui/BrandText';
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
      <Image
        source={require('@/assets/branding/rusty-brown-logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Kinship Sync"
      />
      <ActivityIndicator
        size="large"
        color={currentColors.primary}
        style={styles.spinner}
      />
      <BrandText variant="body" color="secondary">
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
    logo: {
      width: 220,
      height: 72,
      marginBottom: Spacing.xl,
    },
    spinner: {
      marginBottom: Spacing.m,
    },
  });

