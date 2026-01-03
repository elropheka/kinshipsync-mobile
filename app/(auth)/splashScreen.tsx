import React from 'react';
import { Colors } from '@/constants/Colors';
import { View, Image } from 'react-native';
import { createSplashScreenStyles } from '../../styles/app/(auth)/splashScreen.styles';

const SplashScreen: React.FC = () => {
    const styles = createSplashScreenStyles(Colors.light);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.logoViewContainer}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

export default SplashScreen;
