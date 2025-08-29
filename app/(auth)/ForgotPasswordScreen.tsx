import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordReset } from '../../services/authService';
import { styles } from '../../styles/app/(auth)/forgotPassword.styles';
import CustomAlert, { AlertType } from '../../components/common/alert';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: AlertType;
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });
  const router = useRouter();

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlertConfig({
      ...alertConfig,
      visible: false,
    });
  };

  const handlePasswordReset = async () => {
    if (!email) {
      showAlert('error', 'Missing Email', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(email);
      router.push({ pathname: '/PasswordResetEmailSentScreen' });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email. Please try again.';
      showAlert('error', 'Password Reset Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address below and we'll send you a link to reset your password.
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
      
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={hideAlert}
      />
    </View>
  );
};

export default ForgotPasswordScreen;
