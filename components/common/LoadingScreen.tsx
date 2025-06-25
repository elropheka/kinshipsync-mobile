import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Optional: set a background color
  },
  text: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular', // Optional: if you want to use your custom font
    color: '#333333', // Optional: set a text color
  },
});

export default LoadingScreen;
