import React, { useState, useRef } from 'react';
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
import { createCreateAccountStyles } from '@/styles/app/(auth)/createAccount.styles';
import { useAlert } from '@/context/AlertContext';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '@/context/AppThemeContext';
import { IconSizes } from '@/constants/dimensions';
import GoogleIcon from '@/components/common/GoogleIcon';
import PhoneInputLibrary from '@perttu/react-native-phone-number-input';
import { isValidE164Format } from '@/utils/phoneUtils';
import { BrandButton, BrandCard, BrandInput, BrandText } from '@/components/ui';

// Type assertion to fix React 19 compatibility issue with class components
const PhoneInput = PhoneInputLibrary as any as React.ComponentType<any>;

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
  const { currentColors } = useAppTheme();
  const styles = createCreateAccountStyles(currentColors);
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
  const phoneInputRef = useRef<any>(null);
  const defaultCountryCode = 'US';
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const { showError } = useAlert();

  const handleSignUp = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      showError('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (!formData.acceptTerms) {
      showError('Terms Not Accepted', 'Please accept the terms and conditions.');
      return;
    }

    setIsLoading(true);
    
    const nameParts = formData.fullName.trim().split(' ');
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    // Validate phone number if provided - ensure it's in E164 format
    let phoneToSave: string | undefined = undefined;
    const trimmedPhone = formData.phoneNumber?.trim();
    if (trimmedPhone) {
      if (isValidE164Format(trimmedPhone)) {
        phoneToSave = trimmedPhone;
      } else {
        showError('Invalid Phone Number', 'Please enter a valid phone number in international format, or leave it empty.');
        setIsLoading(false);
        return;
      }
    }

    await signUp({
      email: formData.email.trim(),
      pass: formData.password, 
      first_name,
      last_name,
      phone: phoneToSave,
      location: formData.location?.trim() || undefined,
      avatarUri: formData.avatarUri, 
    });
    
    setIsLoading(false);
  };

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      showError('Permission Required', 'Permission to access camera roll is required to set your avatar.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
    await signInWithGoogle();
    setIsGoogleLoading(false);
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    await signInWithApple();
    setIsAppleLoading(false);
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
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
         
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

         
          <View style={styles.content}>
            <Image
              source={require('@/assets/branding/rusty-brown-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <BrandText variant="h2" style={styles.title}>Create an Account</BrandText>
            <BrandText variant="body" color="secondary" style={styles.subtitle}>
              Sign up to unlock exclusive features and a seamless experience on Kinship.
            </BrandText>

           
            <View style={styles.avatarContainer}>
              <BrandText variant="caption" color="secondary" style={styles.optionalLabel}>
                Profile Picture (Optional)
              </BrandText>
              <TouchableOpacity onPress={handlePickAvatar}>
                {formData.avatarUri ? (
                  <Image source={{ uri: formData.avatarUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person-outline" size={40} color={currentColors.background} />
                  </View>
                )}
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={20} color={currentColors.primaryContrastText} />
                </View>
              </TouchableOpacity>
            </View>

           
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}>
                <BrandText variant="button" style={styles.toggleTextActive}>Sign Up</BrandText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toggleButtonInactive} onPress={handleSignIn}>
                <BrandText variant="button" color="secondary" style={styles.toggleTextInactive}>Sign In</BrandText>
              </TouchableOpacity>
            </View>

            <BrandCard style={styles.formCard}>
              <View style={styles.form}>
                <BrandText variant="caption" color="secondary" style={styles.formNote}>Fields marked with * are required</BrandText>
              
                <View style={styles.inputWrapper}>
                  <BrandText variant="body" style={styles.requiredLabel}>Full name *</BrandText>
                  <View style={styles.inputContainer}>
                    <BrandInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      autoCapitalize="words"
                      value={formData.fullName}
                      onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    />
                    <Ionicons name="person-outline" size={20} color={currentColors.icon} style={styles.inputIcon} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <BrandText variant="body" style={styles.requiredLabel}>Email *</BrandText>
                  <View style={styles.inputContainer}>
                    <BrandInput
                      style={styles.input}
                      placeholder="Enter your email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                    />
                    <Ionicons name="mail-outline" size={20} color={currentColors.icon} style={styles.inputIcon} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <BrandText variant="body" color="secondary" style={styles.optionalLabel}>Phone Number (Optional)</BrandText>
                  <PhoneInput
                    ref={phoneInputRef}
                    defaultValue={formData.phoneNumber}
                    defaultCode={defaultCountryCode}
                    layout="first"
                    onChangeText={(text: string) => setFormData({ ...formData, phoneNumber: text })}
                    onChangeFormattedText={(formattedText: string) => {
                      setFormData({ ...formData, phoneNumber: formattedText });
                    }}
                    containerStyle={styles.phoneInputContainer}
                    textContainerStyle={styles.phoneInputTextContainer}
                    textInputStyle={styles.phoneInputText}
                    codeTextStyle={styles.phoneInputCodeText}
                    flagButtonStyle={styles.phoneInputFlagButton}
                    countryPickerButtonStyle={styles.phoneInputCountryPicker}
                    textInputProps={{
                      placeholder: 'Enter your phone number',
                      placeholderTextColor: currentColors.textSecondary,
                    }}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <BrandText variant="body" color="secondary" style={styles.optionalLabel}>Location (Optional)</BrandText>
                  <View style={styles.inputContainer}>
                    <BrandInput
                      style={styles.input}
                      placeholder="e.g., City, Country"
                      autoCapitalize="sentences"
                      value={formData.location}
                      onChangeText={(text) => setFormData({ ...formData, location: text })}
                    />
                    <Ionicons name="location-outline" size={20} color={currentColors.icon} style={styles.inputIcon} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <BrandText variant="body" style={styles.requiredLabel}>Password *</BrandText>
                  <View style={styles.inputContainer}>
                    <BrandInput
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
                        color={currentColors.icon}
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
                        <Ionicons name="checkmark" size={12} color={currentColors.primaryContrastText} />
                      </View>
                    ) : (
                      <View style={styles.uncheckedBox} />
                    )}
                  </TouchableOpacity>
                  <BrandText variant="body" color="secondary" style={styles.termsText}>
                    Accept{' '}
                    <BrandText variant="body" style={styles.termsLink}>Terms & Conditions</BrandText>
                  </BrandText>
                </View>

        
                <BrandButton
                  label={isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                  onPress={handleSignUp}
                  disabled={isLoading}
                  loading={isLoading}
                  fullWidth
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
                onPress={handleGoogleSignUp}
                disabled={isGoogleLoading}
              >
                <GoogleIcon size={IconSizes.m} style={styles.socialIcon} />
                <BrandText variant="body" style={styles.socialButtonText}>
                  {isGoogleLoading ? 'Signing Up...' : 'Google'}
                </BrandText>
              </TouchableOpacity>
              
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  style={[styles.appleButton, isAppleLoading && styles.disabledButton]} 
                  onPress={handleAppleSignUp}
                  disabled={isAppleLoading}
                >
                  <Ionicons name="logo-apple" size={20} color={currentColors.text} />
                  <BrandText variant="body" style={styles.socialButtonText}>
                    {isAppleLoading ? 'Signing Up...' : 'Apple'}
                  </BrandText>
                </TouchableOpacity>
              )}
            </View>

           
            <View style={styles.signInContainer}>
              <BrandText variant="body" color="secondary" style={styles.signInText}>Already have an account? </BrandText>
              <TouchableOpacity onPress={handleSignIn}>
                <BrandText variant="body" style={styles.signInLink}>Sign in</BrandText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAccountScreen;
