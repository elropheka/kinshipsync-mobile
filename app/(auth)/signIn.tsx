import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Removed FontAwesome since we're using custom GoogleIcon
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { IconSizes } from '../../constants/dimensions';
import { styles } from '../../styles/app/(auth)/signIn.styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import GoogleIcon from '../../components/common/GoogleIcon';
import CustomAlert, { AlertType } from '../../components/common/alert';


interface FormData {
  email: string;
  password: string;
}

const SignInScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Added for password visibility
  const [isLoading, setIsLoading] = useState(false); // General loading state for email/password
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // For Google loading state
  const [isAppleLoading, setIsAppleLoading] = useState(false); // For Apple loading state
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
  const { signIn, signInWithGoogle, signInWithApple } = useAuth(); // Get signIn and signInWithGoogle from AuthContext

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

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      showAlert('error', 'Missing Fields', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await signIn({ email: formData.email, pass: formData.password });
      // Navigation is handled by AuthContext on success
    } catch (error: any) {
      console.error('Sign-In failed on screen:', error);
      const errorMessage = error.message || 'Sign-in failed. Please check your credentials and try again.';
      showAlert('error', 'Sign-In Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Navigation is handled within signInWithGoogle on success
    } catch (error: any) {
      console.error('Google Sign-In failed on screen:', error);
      const errorMessage = error.message || 'Google sign-in failed. Please try again.';
      showAlert('error', 'Google Sign-In Failed', errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      console.error('Apple Sign In failed:', error);
      const errorMessage = error.message || 'Apple sign-in failed. Please try again.';
      showAlert('error', 'Apple Sign-In Failed', errorMessage);
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleSignUp = () => {
    // Navigate to sign up screen
    router.push('/createAccount');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    router.push({ pathname: '/(auth)/ForgotPasswordScreen' });
  };

  const handleBackPress = () => {
    // Navigate back to previous screen
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent}/>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>
              Hello, kindly fill in the required information below to continue
            </Text>

            {/* Toggle between Sign In and Sign Up */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <Text style={styles.toggleTextActive}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButtonInactive} onPress={handleSignUp}>
                <Text style={styles.toggleTextInactive}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
                <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
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
                    color="#888" 
                    style={styles.inputIcon} // Re-using inputIcon style for now, might need specific style
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity 
                style={[styles.signInButton, isLoading && styles.disabledButton]} 
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <Text style={styles.signInButtonText}>{isLoading ? 'SIGNING IN...' : 'SIGN IN'}</Text>
              </TouchableOpacity>
            </View>

            {/* Or sign up with */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Sign In Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[styles.googleButton, isGoogleLoading && styles.disabledButton]} // Optional: style for disabled state
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading} // Disable button when loading
              >
                <GoogleIcon size={IconSizes.m} style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>{isGoogleLoading ? 'Signing In...' : 'Google'}</Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  style={[styles.appleButton, isAppleLoading && styles.disabledButton]} 
                  onPress={handleAppleSignIn}
                  disabled={isAppleLoading}
                >
                  <Ionicons name="logo-apple" size={20} color="black" />
                  <Text style={styles.socialButtonText}>{isAppleLoading ? 'Signing In...' : 'Apple'}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Need an account */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Need an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};

export default SignInScreen;
