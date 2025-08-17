import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(main)/profile.styles';
import { useCurrentUser } from '../../hooks/useUser';
import { UpdateUserProfilePayload, UserProfile } from '../../types/userTypes';
import { Colors } from 'constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { uploadUserAvatar } from '../../services/storageService';
import { useAppAuth } from '../../hooks/useAppAuth';
import CustomAlert from '../../components/common/alert';


type EditableProfileFields = {
  displayName: string;
  phoneNumber: string;
  city: string;
  bio: string;
  avatarUrl: string;
};

const ProfileScreen = () => {
  const router = useRouter();
  const { 
    profile: currentUserProfile, 
    updateProfile, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useCurrentUser();
  const { user: authUser } = useAppAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditableProfileFields>({
    displayName: '',
    phoneNumber: '',
    city: '',
    bio: '',
    avatarUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (currentUserProfile) {
      setEditableProfile(prev => ({
        ...prev,
        displayName: currentUserProfile.displayName || '',
        phoneNumber: currentUserProfile.phoneNumber || '',
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
    const payload: UpdateUserProfilePayload = {
      displayName: editableProfile.displayName.trim(),
      phoneNumber: editableProfile.phoneNumber.trim() || null,
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
      showAlert("success", "Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showAlert("error", "Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleEditAvatar = async () => {
    if (!authUser?.uid) {
      showAlert("error", "Error", "User not authenticated.");
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      showAlert("info", "Permission Required", "Permission to access camera roll is required to change your avatar.");
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
      const imageUri = pickerResult.assets[0].uri;
      setIsSaving(true);
      try {
        const uploadResult = await uploadUserAvatar(imageUri, authUser.uid, (progress) => {
          console.log(`Avatar Upload Progress: ${progress}%`); 
        });
        handleInputChange('avatarUrl', uploadResult.avatarUrl);
        showAlert("success", "Avatar Selected", "New avatar image is ready. Click 'Save Changes' to apply.");
      } catch (uploadError: any) {
        console.error("Avatar upload failed:", uploadError);
        showAlert("error", "Upload Failed", `Could not upload image: ${uploadError.message}`);
      } finally {
        setIsSaving(false);
      }
    }
  };


  if (isLoadingUser && !currentUserProfile) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  if (userError) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
        <Text style={styles.errorText}>Error loading profile: {userError.message}</Text>
      </SafeAreaView>
    );
  }
  
  if (!currentUserProfile) {
     return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
        <Text>No profile data found.</Text>
         <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/signIn')}>
            <Text style={styles.buttonText}>Go to Sign In</Text>
          </TouchableOpacity>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: editableProfile.avatarUrl || 'https://via.placeholder.com/150' }} 
            style={styles.profileImage} 
          />
          {isEditing && (
            <TouchableOpacity style={styles.editImageButton} onPress={handleEditAvatar}>
              <Ionicons name="camera-outline" size={20} color={Colors.light.primaryContrastText} />
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
            <TextInput
              style={styles.input}
              value={editableProfile.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              editable={isEditing}
              keyboardType="phone-pad"
              placeholder="Your Phone Number"
            />
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
                  phoneNumber: currentUserProfile.phoneNumber || '',
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
      
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={hideAlert}
        position="top"
        showIcon={true}
        closable={true}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
