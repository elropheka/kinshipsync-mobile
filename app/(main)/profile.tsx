import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createProfileStyles } from '../../styles/app/(main)/profile.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useCurrentUser } from '../../hooks/useUser';
import { UpdateUserProfilePayload} from '../../types/userTypes';
import { Colors } from 'constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { uploadUserAvatar } from '../../services/storageService';
import { useAppAuth } from '../../hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import LoadingScreen from '@/components/common/LoadingScreen';
import PhoneInputLibrary from '@perttu/react-native-phone-number-input';
import { isValidE164Format } from '../../utils/phoneUtils';
import { Avatar } from '../../components/common/Avatar';

// Type assertion to fix React 19 compatibility issue with class components
const PhoneInput = PhoneInputLibrary as any as React.ComponentType<any>;


type EditableProfileFields = {
  displayName: string;
  phoneNumber: string;
  city: string;
  bio: string;
  avatarUrl: string;
};

const ProfileScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createProfileStyles(currentColors);


  const router = useRouter();
  const { 
    profile: currentUserProfile, 
    updateProfile, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useCurrentUser();
  const { user: authUser } = useAppAuth();
  const { showSuccess, showError, showInfo } = useAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditableProfileFields>({
    displayName: '',
    phoneNumber: '',
    city: '',
    bio: '',
    avatarUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [defaultCountryCode, setDefaultCountryCode] = useState<string>('US');
  const phoneInputRef = useRef<any>(null);

  useEffect(() => {
    if (currentUserProfile) {
      // Explicitly handle phoneNumber - it may be undefined, null, or a string
      const phoneNumber = currentUserProfile.phoneNumber ?? '';
      // Extract country code from existing E164 phone number if available
      if (phoneNumber && isValidE164Format(phoneNumber)) {
        // PhoneInput will handle parsing the E164 number
        // For defaultCountryCode, we'll use US as fallback
        setDefaultCountryCode('US');
      }
      setEditableProfile(prev => ({
        ...prev,
        displayName: currentUserProfile.displayName || '',
        phoneNumber: phoneNumber,
        city: currentUserProfile.address?.city || '',
        bio: currentUserProfile.bio || '',
        avatarUrl: isEditing ? prev.avatarUrl : currentUserProfile.avatarUrl || '',
      }));
    }
  }, [currentUserProfile, isEditing]);

  const handleInputChange = (field: keyof EditableProfileFields, value: string) => {
    setEditableProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentUserProfile) return;
    setIsSaving(true);
    
    // Validate phone number - ensure it's in E164 format if provided
    let phoneNumberToSave: string | null = null;
    const trimmedPhone = editableProfile.phoneNumber.trim();
    if (trimmedPhone) {
      if (isValidE164Format(trimmedPhone)) {
        phoneNumberToSave = trimmedPhone;
      } else {
        // If phone number is provided but not in E164 format, show error
        showError("Invalid Phone Number", "Please enter a valid phone number in international format.");
        setIsSaving(false);
        return;
      }
    }
    
    const payload: UpdateUserProfilePayload = {
      displayName: editableProfile.displayName.trim(),
      phoneNumber: phoneNumberToSave,
      bio: editableProfile.bio.trim() || null,
      avatarUrl: editableProfile.avatarUrl.trim() || null,
      address: {
        ...currentUserProfile.address,
        city: editableProfile.city.trim() || null,
      }
    };
    if (payload.address && Object.values(payload.address).every(val => val === null || val === undefined)) {
        delete payload.address;
    }


    try {
      const cleanedPayload: UpdateUserProfilePayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      ) as UpdateUserProfilePayload;

      await updateProfile(cleanedPayload);
      setIsEditing(false);
      showSuccess("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showError("Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleEditAvatar = async () => {
    console.log('handleEditAvatar called');
    if (!authUser?.uid) {
      showError("Error", "User not authenticated.");
      return;
    }

    try {
      console.log('Requesting media library permissions...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission result:', permissionResult);
      if (permissionResult.granted === false) {
        showInfo("Permission Required", "Permission to access camera roll is required to change your avatar.");
        return;
      }

      console.log('Launching image picker...');
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      console.log('Image picker result:', { canceled: pickerResult.canceled, hasAssets: !!pickerResult.assets?.length });

      if (pickerResult.canceled === true) {
        console.log('User canceled image picker');
        return;
      }

      if (pickerResult.assets && pickerResult.assets.length > 0) {
        const imageUri = pickerResult.assets[0].uri;
        console.log('Image selected, starting upload...', imageUri);
        setIsSaving(true);
        try {
          const uploadResult = await uploadUserAvatar(imageUri, authUser.uid, (progress) => {
            console.log(`Avatar Upload Progress: ${progress}%`); 
          });
          handleInputChange('avatarUrl', uploadResult.avatarUrl);
          showInfo("Avatar Selected", "New avatar image is ready. Click 'Save Changes' to apply.");
        } catch (uploadError: any) {
          console.error("Avatar upload failed:", uploadError);
          showError("Upload Failed", `Could not upload image: ${uploadError.message}`);
        } finally {
          setIsSaving(false);
        }
      } else {
        console.warn('Image picker returned no assets');
        showError("Error", "No image was selected.");
      }
    } catch (error: any) {
      console.error("Error in handleEditAvatar:", error);
      showError("Error", `Failed to open image picker: ${error.message || 'Unknown error'}`);
    }
  };


  if (isLoadingUser && !currentUserProfile) {
    return <LoadingScreen />;
  }

  if (userError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
        <Text style={styles.errorText}>Error loading profile: {userError.message}</Text>
      </SafeAreaView>
    );
  }
  
  if (!currentUserProfile) {
     return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
        <Text>No profile data found.</Text>
         <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/signIn')}>
            <Text style={styles.buttonText}>Go to Sign In</Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Avatar
            name={currentUserProfile?.displayName || authUser?.email || 'User'}
            avatarUrls={[
              editableProfile.avatarUrl,
              currentUserProfile?.avatarUrl,
              authUser?.photoURL
            ].filter(url => url && url.trim()) as string[]}
            size={120}
          />
          {isEditing && (
            <TouchableOpacity style={styles.editImageButton} onPress={handleEditAvatar}>
              <Ionicons name="camera-outline" size={20} color={currentColors.primaryContrastText} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={editableProfile.displayName}
              onChangeText={(text) => handleInputChange('displayName', text)}
              editable={isEditing}
              placeholder="Your Name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={currentUserProfile.email}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            {isEditing ? (
              <PhoneInput
                ref={phoneInputRef}
                defaultValue={editableProfile.phoneNumber}
                defaultCode={defaultCountryCode}
                layout="first"
                onChangeText={(text: string) => handleInputChange('phoneNumber', text)}
                onChangeFormattedText={(formattedText: string) => {
                  handleInputChange('phoneNumber', formattedText);
                }}
                containerStyle={styles.phoneInputContainer}
                textContainerStyle={styles.phoneInputTextContainer}
                textInputStyle={styles.phoneInputText}
                codeTextStyle={styles.phoneInputCodeText}
                flagButtonStyle={styles.phoneInputFlagButton}
                countryPickerButtonStyle={styles.phoneInputCountryPicker}
                textInputProps={{
                  placeholder: "Your Phone Number",
                  placeholderTextColor: currentColors.textSecondary,
                }}
              />
            ) : (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={editableProfile.phoneNumber || 'Not set'}
                editable={false}
                selectTextOnFocus={false}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.input}
              value={editableProfile.city}
              onChangeText={(text) => handleInputChange('city', text)}
              editable={isEditing}
              placeholder="Your City"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editableProfile.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              editable={isEditing}
              multiline={true}
              numberOfLines={4}
              placeholder="Tell us about yourself..."
            />
          </View>
          


          {isEditing ? (
            <TouchableOpacity 
              style={[styles.primaryButton, isSaving && styles.disabledButton]} 
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SAVE CHANGES</Text>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>EDIT PROFILE</Text>
            </TouchableOpacity>
          )}
          {isEditing && (
            <TouchableOpacity style={[styles.secondaryButton, {marginTop: 10}]} onPress={() => {
              setIsEditing(false);
              if(currentUserProfile) {
                setEditableProfile({
                  displayName: currentUserProfile.displayName || '',
                  phoneNumber: currentUserProfile.phoneNumber ?? '',
                  city: currentUserProfile.address?.city || '',
                  bio: currentUserProfile.bio || '',
                  avatarUrl: currentUserProfile.avatarUrl || '',
                });
              }
            }}>
              <Text style={styles.secondaryButtonText}>CANCEL</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
