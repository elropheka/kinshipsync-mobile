import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { styles } from '@/styles/app/(auth)/createAccount.styles';
import CustomAlert, { AlertType } from '@/components/common/alert';
import * as ImagePicker from 'expo-image-picker'; 
import { Colors } from '@/constants/Colors'; 
import { IconSizes } from '@/constants/dimensions';
import GoogleIcon from '@/components/common/GoogleIcon';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  password: string;
  acceptTerms: boolean;
  avatarUri: string | null; 
}

const CreateAccountScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    password: '',
    acceptTerms: false,
    avatarUri: null, 
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); 
  const [isAppleLoading, setIsAppleLoading] = useState(false); 
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
  const { signUp, signInWithGoogle, signInWithApple } = useAuth(); 

  const showAlert = (type: AlertType, title: string, message: string) => {
    console.log('showAlert called:', { type, title, message });
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
    });
  };

  const hideAlert = () => {
    console.log('hideAlert called');
    setAlertConfig({
      ...alertConfig,
      visible: false,
    });
  };

  const handleSignUp = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      showAlert('error', 'Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (!formData.acceptTerms) {
      showAlert('error', 'Terms Not Accepted', 'Please accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    try {
      const nameParts = formData.fullName.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      await signUp({
        email: formData.email.trim(),
        pass: formData.password, 
        first_name,
        last_name,
        phone: formData.phoneNumber?.trim() || undefined,
        location: formData.location?.trim() || undefined,
        avatarUri: formData.avatarUri, 
      });
      
      // Show success message before navigation
      showAlert('success', 'Account Created!', 'Your account has been successfully created. Welcome to Kinship!');
      
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        hideAlert();
      }, 2000);
      
    } catch (error: any) {
      console.error('Sign-Up failed on screen:', error);
      const errorMessage = error.message || 'An unexpected error occurred during account creation.';
      showAlert('error', 'Sign Up Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      showAlert('error', 'Permission Required', 'Permission to access camera roll is required to set your avatar.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 0.7, 
    });

    if (pickerResult.canceled === true) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      setFormData({ ...formData, avatarUri: pickerResult.assets[0].uri });
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google Sign-Up failed on screen:', error);
      const errorMessage = error.message || 'Google sign-up failed. Please try again.';
      showAlert('error', 'Google Sign-Up Failed', errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    try {
      await signInWithApple();
    } catch (error: any) {
      console.error('Apple Sign Up failed:', error);
      const errorMessage = error.message || 'Apple sign-up failed. Please try again.';
      showAlert('error', 'Apple Sign-Up Failed', errorMessage);
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/signIn');
    console.log('Navigate to sign in');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
         
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

         
          <View style={styles.content}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subtitle}>
              Sign up to unlock exclusive features and a seamless experience on Kinship.
            </Text>

           
            <View style={styles.avatarContainer}>
              <Text style={styles.optionalLabel}>Profile Picture (Optional)</Text>
              <TouchableOpacity onPress={handlePickAvatar}>
                {formData.avatarUri ? (
                  <Image source={{ uri: formData.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person-outline" size={40} color={Colors.light.background} />
                  </View>
                )}
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={20} color={Colors.light.primaryContrastText} />
                </View>
              </TouchableOpacity>
            </View>

           
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <Text style={styles.toggleTextActive}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButtonInactive} onPress={handleSignIn}>
                <Text style={styles.toggleTextInactive}>Sign In</Text>
              </TouchableOpacity>
            </View>

           
            <View style={styles.form}>
              <Text style={styles.formNote}>Fields marked with * are required</Text>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.requiredLabel}>Full name *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                  />
                  <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.requiredLabel}>Email *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                  <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.optionalLabel}>Phone Number (Optional)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    value={formData.phoneNumber}
                    onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                  />
                  <Text style={styles.inputIcon}>#</Text>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.optionalLabel}>Location (Optional)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., City, Country"
                    autoCapitalize="sentences"
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                  />
                  <Ionicons name="location-outline" size={20} color="#888" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.requiredLabel}>Password *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a strong password"
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
                      style={styles.inputIcon} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

           
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
                >
                  {formData.acceptTerms ? (
                    <View style={styles.checkedBox}>
                      <Ionicons name="checkmark" size={12} color={Colors.light.primaryContrastText} />
                    </View>
                  ) : (
                    <View style={styles.uncheckedBox} />
                  )}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  Accept{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </View>

        
              <TouchableOpacity 
                style={[styles.signUpButton, isLoading && styles.disabledButton]} 
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.signUpButtonText}>{isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}</Text>
              </TouchableOpacity>
            </View>

          
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.divider} />
            </View>

                       
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[styles.googleButton, isGoogleLoading && styles.disabledButton]} 
                onPress={handleGoogleSignUp}
                disabled={isGoogleLoading}
              >
                <GoogleIcon size={IconSizes.m} style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>{isGoogleLoading ? 'Signing Up...' : 'Google'}</Text>
              </TouchableOpacity>
              
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  style={[styles.appleButton, isAppleLoading && styles.disabledButton]} 
                  onPress={handleAppleSignUp}
                  disabled={isAppleLoading}
                >
                  <Ionicons name="logo-apple" size={20} color="black" />
                  <Text style={styles.socialButtonText}>{isAppleLoading ? 'Signing Up...' : 'Apple'}</Text>
                </TouchableOpacity>
              )}
            </View>

           
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign in</Text>
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

export default CreateAccountScreen;
