import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(main)/profile.styles';
import { useCurrentUser } from '../../hooks/useUser'; // Corrected to useCurrentUser
import { UpdateUserProfilePayload, UserProfile } from '../../types/userTypes';
import { Colors } from 'constants/Colors';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { uploadUserAvatar } from '../../services/storageService'; // Import uploadUserAvatar
import { useAppAuth } from '../../hooks/useAppAuth'; // To get current user for upload path
import CustomAlert from '../../components/common/alert';


// Define a type for the editable fields in the form
type EditableProfileFields = {
  displayName: string;
  phoneNumber: string;
  city: string; // Simplified location to city
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
  const { user: authUser } = useAppAuth(); // Get authenticated user for userId

  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditableProfileFields>({
    displayName: '',
    phoneNumber: '',
    city: '',
    bio: '',
    avatarUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Custom alert state
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
        ...prev, // Keep existing editable changes
        displayName: currentUserProfile.displayName || '',
        phoneNumber: currentUserProfile.phoneNumber || '',
        city: currentUserProfile.address?.city || '',
        bio: currentUserProfile.bio || '',
        // Only update avatarUrl from currentUserProfile if not editing
        avatarUrl: isEditing ? prev.avatarUrl : currentUserProfile.avatarUrl || '',
      }));
    }
  }, [currentUserProfile, isEditing]); // Added isEditing dependency

  const handleInputChange = (field: keyof EditableProfileFields, value: string) => {
    setEditableProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!currentUserProfile) return;
    setIsSaving(true);
    const payload: UpdateUserProfilePayload = {
      displayName: editableProfile.displayName.trim(),
      phoneNumber: editableProfile.phoneNumber.trim() || null, // Convert undefined to null
      bio: editableProfile.bio.trim() || null, // Convert undefined to null
      avatarUrl: editableProfile.avatarUrl.trim() || null, // Convert undefined to null
      address: {
        ...currentUserProfile.address, // Preserve other address fields if they exist
        city: editableProfile.city.trim() || null, // Convert undefined to null
      }
    };
    // Remove address if all its subfields are null or undefined (though we are converting to null)
    if (payload.address && Object.values(payload.address).every(val => val === null || val === undefined)) {
        delete payload.address;
    }


    try {
      // Filter out any remaining undefined values just in case
      const cleanedPayload: UpdateUserProfilePayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      ) as UpdateUserProfilePayload;

      await updateProfile(cleanedPayload); // Correct function name
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
      aspect: [1, 1], // Square aspect ratio for avatars
      quality: 0.7, // Compress image slightly
    });

    if (pickerResult.canceled === true) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const imageUri = pickerResult.assets[0].uri;
      setIsSaving(true); // Show loading indicator while uploading
      try {
        // Use authUser.uid for the userId in storage path
        const uploadResult = await uploadUserAvatar(imageUri, authUser.uid, (progress) => {
          console.log(`Avatar Upload Progress: ${progress}%`); 
          // Optionally, update UI with progress
        });
        handleInputChange('avatarUrl', uploadResult.avatarUrl);
        // The avatarUrl is now in local state; it will be saved when the user clicks "SAVE CHANGES"
        showAlert("success", "Avatar Selected", "New avatar image is ready. Click 'Save Changes' to apply.");
      } catch (uploadError: any) {
        console.error("Avatar upload failed:", uploadError);
        showAlert("error", "Upload Failed", `Could not upload image: ${uploadError.message}`);
      } finally {
        setIsSaving(false);
      }
    }
  };


  if (isLoadingUser && !currentUserProfile) { // Show loading only on initial load
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
              style={[styles.input, !isEditing && styles.disabledInput]} // Style for disabled
              value={currentUserProfile.email} // Email is from auth, not directly editable here
              editable={false} // Email typically not editable directly in profile form
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
          
          {/* The TextInput for avatarUrl has been removed to enforce upload-only for avatars */}

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
              // Reset editableProfile to original currentUserProfile values
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
      
      {/* Custom Alert */}
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
