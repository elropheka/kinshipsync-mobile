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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Added for password visibility
  const [isLoading, setIsLoading] = useState(false); // General loading state for email/password
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // For Google loading state
  const [isAppleLoading, setIsAppleLoading] = useState(false); // For Apple loading state
  const { signIn, signInWithGoogle, signInWithApple } = useAuth(); // Get signIn and signInWithGoogle from AuthContext
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

  const handleSignUp = () => {
  
    router.push('/createAccount');
  };

  const handleForgotPassword = () => {
   
    router.push({ pathname: '/(auth)/ForgotPasswordScreen' });
  };

  const handleBackPress = () => {
    
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Image
              source={require('@/assets/branding/rusty-brown-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <BrandText variant="h2" style={styles.title}>
              Welcome!
            </BrandText>
            <BrandText variant="body" color="secondary" style={styles.subtitle}>
              Hello, kindly fill in the required information below to continue
            </BrandText>

           
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <BrandText variant="button" style={styles.toggleTextActive}>Sign In</BrandText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButtonInactive} onPress={handleSignUp}>
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
                  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.passwordVisibilityToggle}>
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={currentColors.icon}
                      style={styles.inputIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <View style={styles.forgotPasswordContainer}>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <BrandText variant="body" color="secondary" style={styles.forgotPasswordText}>Forgot Password</BrandText>
                  </TouchableOpacity>
                </View>

                {/* Sign In Button */}
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

            {/* Or sign up with */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <BrandText variant="body" color="secondary" style={styles.dividerText}>or sign up with</BrandText>
              <View style={styles.divider} />
            </View>

           
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[styles.googleButton, isGoogleLoading && styles.disabledButton]} // Optional: style for disabled state
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                <GoogleIcon size={IconSizes.m} style={styles.socialIcon} />
                <BrandText variant="body" style={styles.socialButtonText}>
                  {isGoogleLoading ? 'Signing In...' : 'Google'}
                </BrandText>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
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
              )}
            </View>

            
            <View style={styles.signUpContainer}>
              <BrandText variant="body" color="secondary" style={styles.signUpText}>Need an account? </BrandText>
              <TouchableOpacity onPress={handleSignUp}>
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
