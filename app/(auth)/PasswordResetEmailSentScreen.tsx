import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../styles/app/(auth)/passwordResetEmailSent.styles'; // Assuming styles will be created

const PasswordResetEmailSentScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Your Email</Text>
      <Text style={styles.subtitle}>
        We&apos;ve sent a password reset link to your email address. Please check your inbox (and spam folder) to continue.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(auth)/signIn')}
      >
        <Text style={styles.buttonText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordResetEmailSentScreen;
