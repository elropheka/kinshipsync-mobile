import React, { useState } from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordReset } from '../../services/authService';
import { createForgotPasswordStyles } from '../../styles/app/(auth)/forgotPassword.styles';
import { useAlert } from '@/context/AlertContext';
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send password reset email. Please try again.';
      showError('Password Reset Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        <BrandText variant="h2" style={styles.title}>Forgot Password</BrandText>
        <BrandText variant="body" color="secondary" style={styles.subtitle}>
          Enter your email and we&apos;ll send you a link to reset your password.
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
          label={loading ? 'SENDING...' : 'SEND RESET LINK'}
          onPress={handlePasswordReset}
          disabled={loading}
          loading={loading}
          fullWidth
          style={styles.button}
        />
        <BrandButton
          label="Back to Sign In"
          variant="outline"
          onPress={() => router.replace('/(auth)/signIn')}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
