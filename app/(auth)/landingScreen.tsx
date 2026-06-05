import React from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LandingPageHome from 'components/common/Layout/landingPageHome';
import { createLandingScreenStyles } from '@/styles/app/(auth)/landingScreen.styles';
import { useAppTheme } from '@/context/AppThemeContext';

const LandingScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createLandingScreenStyles(currentColors);

  const handleLoginPress = () => {
    router.push('/signIn');
  };

  const handleCreateAccountPress = () => {
    router.push('/createAccount');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LandingPageHome
        onLoginPress={handleLoginPress}
        onCreateAccountPress={handleCreateAccountPress}
      />
    </SafeAreaView>
  );
};

export default LandingScreen;
