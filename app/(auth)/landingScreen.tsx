import React from 'react';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LandingPageHome from 'components/common/Layout/landingPageHome';
import { createLandingScreenStyles } from '@/styles/app/(auth)/landingScreen.styles';

const LandingScreen: React.FC = () => {
    const styles = createLandingScreenStyles(Colors.light);

  const handleLoginPress = () => {
    router.push('/signIn');
  };

  const handleCreateAccountPress = () => {
    router.push('/createAccount');
  };

  return (
    <SafeAreaView style={styles.container} >
      <LandingPageHome 
        onLoginPress={handleLoginPress}
        onCreateAccountPress={handleCreateAccountPress}
      />
    </SafeAreaView>
  );
};

export default LandingScreen;
