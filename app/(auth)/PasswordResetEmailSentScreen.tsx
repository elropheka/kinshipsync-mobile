import React from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { createPasswordResetEmailSentStyles } from '../../styles/app/(auth)/passwordResetEmailSent.styles';
import { BrandButton, BrandEmptyState } from '@/components/ui';

const PasswordResetEmailSentScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createPasswordResetEmailSentStyles(currentColors);

  const router = useRouter();

  return (
    <View style={styles.container}>
      <BrandEmptyState
        title="Check Your Email"
        message="We&apos;ve sent a password reset link to your email address. Please check your inbox (and spam folder) to continue."
        iconName="mail-open-outline"
        style={styles.emptyState}
      />
      <BrandButton
        label="Back to Sign In"
        fullWidth
        style={styles.button}
        onPress={() => router.replace('/(auth)/signIn')}
      />
    </View>
  );
};

export default PasswordResetEmailSentScreen;
