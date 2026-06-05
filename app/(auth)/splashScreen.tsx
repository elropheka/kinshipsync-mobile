import React from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { createSplashScreenStyles } from '../../styles/app/(auth)/splashScreen.styles';
import { BrandText } from '@/components/ui/BrandText';

const SplashScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createSplashScreenStyles(currentColors);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.logoViewContainer}>
        <Image
          source={require('@/assets/branding/rusty-brown-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Kinship Sync"
        />
      </View>
      <ActivityIndicator size="large" color={currentColors.primary} style={styles.spinner} />
      <BrandText variant="caption" color="secondary">
        Bringing families together
      </BrandText>
    </View>
  );
};

export default SplashScreen;
