import React, { useState } from 'react';
import { useAppTheme } from '@/context/AppThemeContext';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { IconSizes } from '@/constants/dimensions';
import { createSignInStyles } from '@/styles/app/(auth)/signIn.styles';
import GoogleIcon from '@/components/common/GoogleIcon';
import { useAlert } from '@/context/AlertContext';
import { BrandButton, BrandCard, BrandInput, BrandText } from '@/components/ui';

interface FormData {
  email: string;
  password: string;
}

const SignInScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createSignInStyles(currentColors);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const { showError } = useAlert();

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      showError('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    await signIn({ email: formData.email, pass: formData.password });
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
    setIsGoogleLoading(false);
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    await signInWithApple();
    setIsAppleLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace('/(auth)/landingScreen')}
              accessibilityRole="button"
              accessibilityLabel="Back to landing"
            >
              <Ionicons name="chevron-back" size={24} color={currentColors.text} />
            </TouchableOpacity>
            <Image
              source={require('@/assets/branding/rusty-brown-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <BrandText variant="h2" style={styles.title}>Welcome!</BrandText>
            <BrandText variant="body" color="secondary" style={styles.subtitle}>
              Hello, kindly fill in the required information below to continue
            </BrandText>

            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <BrandText variant="button" style={styles.toggleTextActive}>Sign In</BrandText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButtonInactive} onPress={() => router.push('/createAccount')}>
                <BrandText variant="button" color="secondary" style={styles.toggleTextInactive}>Sign Up</BrandText>
              </TouchableOpacity>
            </View>

            <BrandCard style={styles.formCard}>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <BrandInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                  <Ionicons name="mail-outline" size={20} color={currentColors.icon} style={styles.inputIcon} />
                </View>

                <View style={styles.inputContainer}>
                  <BrandInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!isPasswordVisible}
                    autoCapitalize="none"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={styles.passwordVisibilityToggle}
                  >
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={currentColors.icon}
                      style={styles.inputIcon}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity onPress={() => router.push('/(auth)/ForgotPasswordScreen')}>
                    <BrandText variant="body" color="secondary" style={styles.forgotPasswordText}>
                      Forgot Password
                    </BrandText>
                  </TouchableOpacity>
                </View>

                <BrandButton
                  label={isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                  onPress={handleSignIn}
                  disabled={isLoading}
                  loading={isLoading}
                  fullWidth
                  style={styles.signInButton}
                />
              </View>
            </BrandCard>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <BrandText variant="body" color="secondary" style={styles.dividerText}>or sign up with</BrandText>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.googleButton, isGoogleLoading && styles.disabledButton]}
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                <GoogleIcon size={IconSizes.m} style={styles.socialIcon} />
                <BrandText variant="body" style={styles.socialButtonText}>
                  {isGoogleLoading ? 'Signing In...' : 'Google'}
                </BrandText>
              </TouchableOpacity>

              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  style={[styles.appleButton, isAppleLoading && styles.disabledButton]}
                  onPress={handleAppleSignIn}
                  disabled={isAppleLoading}
                >
                  <Ionicons name="logo-apple" size={20} color={currentColors.text} />
                  <BrandText variant="body" style={styles.socialButtonText}>
                    {isAppleLoading ? 'Signing In...' : 'Apple'}
                  </BrandText>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.signUpContainer}>
              <BrandText variant="body" color="secondary" style={styles.signUpText}>Need an account? </BrandText>
              <TouchableOpacity onPress={() => router.push('/createAccount')}>
                <BrandText variant="body" style={styles.signUpLink}>Sign up</BrandText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
