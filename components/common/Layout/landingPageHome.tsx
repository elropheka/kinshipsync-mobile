import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/AppThemeContext';
import { createLandingPageHomeStyles } from '@/styles/components/common/Layout/landingPageHome.styles';
import { BrandText } from '@/components/ui/BrandText';
import { BrandButton } from '@/components/ui/BrandButton';
import { FeaturedEventCard } from '@/components/home/FeaturedEventCard';
import { AttendingMembersRow } from '@/components/home/AttendingMembersRow';
import { PhotoGalleryStrip } from '@/components/home/PhotoGalleryStrip';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import { mockUpcomingEvents } from '@/constants/mock/homeDashboard';
import { ResponsiveContainer } from '@/components/common/Layout/ResponsiveContainer';

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
    <SafeAreaView style={styles.pageContainer} edges={['top', 'left', 'right']}>
      <ResponsiveContainer>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoRow}>
            <Image
              source={require('@/assets/branding/rusty-brown-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <BrandText variant="h2" style={styles.welcomeTitle}>
            Welcome to Kinship Sync!
          </BrandText>

          <FeaturedEventCard preview />
          <UpcomingEvents
            events={mockUpcomingEvents}
            onSeeAllPress={() => {}}
            horizontal
            preview
          />
          <AttendingMembersRow />
          <PhotoGalleryStrip />
          <FeatureGrid preview />
        </ScrollView>
      </ResponsiveContainer>

      <View style={styles.authButtonsContainer}>
        <BrandButton label="Login" variant="outline" onPress={onLoginPress} fullWidth />
        <BrandButton label="Create Account" variant="primary" onPress={onCreateAccountPress} fullWidth />
      </View>
    </SafeAreaView>
  );
};

export default LandingPageHome;
