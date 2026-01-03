import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';

const LoadingScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentColors.backgroundPrimary,
    },
    text: {
      fontSize: 18,
      fontFamily: 'Poppins-Regular',
      color: currentColors.text,
    },
  }), [currentColors]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
