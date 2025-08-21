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
import Toast from 'react-native-toast-message'; 
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
  const { signUp, signInWithGoogle, signInWithApple } = useAuth(); 

  const handleSignUp = async () => {
   
    if (!formData.fullName || !formData.email || !formData.password) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill in all required fields.', position: 'bottom' });
      return;
    }
    if (!formData.acceptTerms) {
      Toast.show({ type: 'error', text1: 'Terms Not Accepted', text2: 'Please accept the terms and conditions.', position: 'bottom' });
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
    } catch (error: any) {
      console.error('Sign-Up failed on screen:', error);
      Toast.show({ type: 'error', text1: 'Sign Up Failed', text2: error.message || 'An unexpected error occurred.', position: 'bottom' });
      if (router.canGoBack()) {
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({ type: 'error', text1: 'Permission Required', text2: 'Permission to access camera roll is required to set your avatar.', position: 'bottom' });
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
    } catch (error) {
      console.error('Google Sign-Up failed on screen:', error);
      if (router.canGoBack()) {
        router.back();
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    try {
      await signInWithApple();
    } catch (error) {
      console.error('Apple Sign Up failed:', error);
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
              Sign up to unlock exclusive features and a seamless experience on Kinship. Profile picture, phone number, and location are optional.
            </Text>

           
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarLabel}>Profile Picture (Optional)</Text>
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
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  autoCapitalize="words"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                />
                <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
              </View>

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
                  placeholder="Phone Number (Optional)"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                />
                <Text style={styles.inputIcon}>#</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Location (Optional) - e.g., City, Country"
                  autoCapitalize="sentences"
                  value={formData.location}
                  onChangeText={(text) => setFormData({ ...formData, location: text })}
                />
                <Ionicons name="location-outline" size={20} color="#888" style={styles.inputIcon} />
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
                    style={styles.inputIcon} 
                  />
                </TouchableOpacity>
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
    </SafeAreaView>
  );
};

export default CreateAccountScreen;
