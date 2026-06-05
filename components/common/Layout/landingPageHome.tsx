import React from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/AppThemeContext';
import { createLandingPageHomeStyles } from '@/styles/components/common/Layout/landingPageHome.styles';
import { BrandText } from '@/components/ui/BrandText';
import { BrandButton } from '@/components/ui/BrandButton';
import { landingBrandMessage, landingBrandName } from '@/constants/branding/landingContent';
import { LandingFeatureCarousel } from '@/components/common/Layout/LandingFeatureCarousel';

interface LandingPageHomeProps {
  onLoginPress: () => void;
  onCreateAccountPress: () => void;
}

const LandingPageHome: React.FC<LandingPageHomeProps> = ({
  onLoginPress,
  onCreateAccountPress,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createLandingPageHomeStyles(currentColors);

  return (
    <SafeAreaView style={styles.pageContainer} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.body}>
        <View style={styles.brandRow}>
          <Image
            source={require('@/assets/branding/rusty-brown-logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <View style={styles.brandNameBlock}>
            <BrandText variant="h3" style={styles.brandNameLine}>
              {landingBrandName.line1}
            </BrandText>
            <BrandText variant="h3" style={styles.brandNameLine}>
              {landingBrandName.line2}
            </BrandText>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.carouselSection}>
            <LandingFeatureCarousel />
          </View>

          <View style={styles.messageBlock}>
            <BrandText variant="h2" style={styles.headline}>
              {landingBrandMessage.headline}
            </BrandText>
            <BrandText variant="body" style={styles.tagline} numberOfLines={3}>
              {landingBrandMessage.tagline}
            </BrandText>
          </View>
        </View>

        <View style={styles.authButtonsContainer}>
          <BrandButton label="Login" variant="outline" onPress={onLoginPress} fullWidth />
          <BrandButton label="Create Account" variant="primary" onPress={onCreateAccountPress} fullWidth />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LandingPageHome;
