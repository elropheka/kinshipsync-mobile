import React, { useState } from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordReset } from '../../services/authService';
import { createForgotPasswordStyles } from '../../styles/app/(auth)/forgotPassword.styles';
import { useAlert } from '@/context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { BrandButton, BrandInput, BrandText } from '@/components/ui';

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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={currentColors.text} />
      </TouchableOpacity>
      <BrandText variant="h2" style={styles.title}>Forgot Password</BrandText>
      <BrandText variant="body" color="secondary" style={styles.subtitle}>
        Enter your email address below and we&apos;ll send you a link to reset your password.
      </BrandText>
      <BrandInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <BrandButton
        label={loading ? 'Sending...' : 'Send Reset Link'}
        loading={loading}
        fullWidth
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handlePasswordReset}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => router.back()}>
        <BrandText variant="body" style={styles.backLink}>Back to Sign In</BrandText>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
