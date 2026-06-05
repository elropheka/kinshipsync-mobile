import React from 'react';
import { router } from 'expo-router';
import LandingPageHome from 'components/common/Layout/landingPageHome';

const LandingScreen: React.FC = () => {
  const handleLoginPress = () => {
    router.push('/signIn');
  };

  const handleCreateAccountPress = () => {
    router.push('/createAccount');
  };

  return (
    <LandingPageHome
      onLoginPress={handleLoginPress}
      onCreateAccountPress={handleCreateAccountPress}
    />
  );
};

export default LandingScreen;
