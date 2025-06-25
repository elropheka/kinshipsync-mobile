import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../../styles/app/(auth)/splashScreen.styles';

const SplashScreen: React.FC = () => {
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
