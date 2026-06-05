import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { createSplashScreenStyles } from '../../styles/app/(auth)/splashScreen.styles';
import { BrandText } from '@/components/ui/BrandText';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';

const SplashScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createSplashScreenStyles(currentColors);

  return (
    <View style={styles.outerContainer}>
      <BrandLoadingSpinner size="large" />
      <BrandText variant="caption" color="secondary" style={styles.tagline}>
        Bringing families together
      </BrandText>
    </View>
  );
};

export default SplashScreen;
