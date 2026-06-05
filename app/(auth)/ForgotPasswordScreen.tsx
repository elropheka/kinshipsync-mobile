import React, { useState } from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordReset } from '../../services/authService';
import { createForgotPasswordStyles } from '../../styles/app/(auth)/forgotPassword.styles';
import { useAlert } from '@/context/AlertContext';

const ForgotPasswordScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createForgotPasswordStyles(currentColors);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showError } = useAlert();

  const handlePasswordReset = async () => {
    if (!email) {
      showError('Missing Email', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(email);
      router.push({ pathname: '/PasswordResetEmailSentScreen' });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email. Please try again.';
      showError('Password Reset Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address below and we&apos;ll send you a link to reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
