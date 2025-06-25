
// components/SidebarComponent.tsx
// components/SidebarComponent.tsx
import React, { useRef, useEffect } from 'react'; // Removed useState
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
  Image, // Added Image for avatar
  ActivityIndicator, // Added ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SecondaryIcon from 'react-native-vector-icons/Ionicons';
// Removed Colors and Fonts imports as they are now in the styles file
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext'; // Import useAuth
import { useCurrentUser } from '../../../hooks/useUser'; // Import useCurrentUser
import { styles } from '../../../styles/components/common/Navigation/sideBar.styles'; // Import styles
import { SafeAreaView } from 'react-native-safe-area-context'; // Added for safe area view
import { Colors } from 'constants/Colors'; // Import Colors

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;
const SIDEBAR_HEIGHT = height * 1;

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { signOut } = useAuth(); // Get signOut from AuthContext
  const { profile: currentUserProfile, isLoading: isLoadingUser } = useCurrentUser(); // Get profile and loading state from useCurrentUser

  useEffect(() => {
    if (isVisible) {
      // Open the sidebar
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close the sidebar
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // Show loading indicator if user profile is loading
  if (isLoadingUser) {
    return (
      <Modal
        transparent={true}
        visible={isVisible}
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </Modal>
    );
  }


  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none" // Using "none" as custom animations are handled by Animated.View
      onRequestClose={onClose} // Handles Android back button
    >
      <>
        {/* Overlay */}
        {/* The isVisible check for rendering the overlay might seem redundant
            as the Modal itself is controlled by isVisible, but it ensures
            the overlay is only part of the tree when the sidebar is meant to be open,
            which can be good for performance and aligns with the animation logic. */}
        {isVisible && (
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View
              style={[
                styles.overlay,
                {
                  opacity: opacityAnim,
                },
              ]}
            />
          </TouchableWithoutFeedback>
        )}

        {/* Sidebar */}
        {/* Similarly, rendering the sidebar panel conditionally based on isVisible
            inside the Modal can be kept, though the Modal's visibility is the primary control.
            The animations rely on isVisible to trigger. */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
            <View style={styles.container}>
              {/* Header with close button */}
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Kinship</Text>
                {/* <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity> */}
              </View>

              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                {currentUserProfile ? ( // Use currentUserProfile
                  <TouchableOpacity 
                    style={styles.profileSection}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/profile'); // Navigate to full profile screen
                    }}
                  >
                    {currentUserProfile.avatarUrl ? ( // Use currentUserProfile.avatarUrl
                      <Image source={{ uri: currentUserProfile.avatarUrl }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {currentUserProfile.displayName ? currentUserProfile.displayName.substring(0, 2).toUpperCase() : (currentUserProfile.email ? currentUserProfile.email.substring(0, 2).toUpperCase() : '??')}
                        </Text>
                      </View>
                    )}
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
                        {currentUserProfile.displayName || 'User'}
                      </Text>
                      <Text style={styles.profileEmail} numberOfLines={1} ellipsizeMode="tail">
                        {currentUserProfile.email || 'No email'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                   // Optionally show a placeholder or loading state if profile is null/loading
                   <View style={styles.profileSection}>
                      <View style={styles.avatar}>
                         <Text style={styles.avatarText}>??</Text>
                      </View>
                      <View style={styles.profileInfo}>
                         <Text style={styles.profileName}>Loading...</Text>
                         <Text style={styles.profileEmail}>Loading...</Text>
                      </View>
                   </View>
                )}
                {/* End Profile Section */}

                {/* Account Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>ACCOUNT</Text>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/profile'); // Corrected path
                    }}
                  >
                    <SecondaryIcon name="person-outline" size={22} color="#333" />
                    <Text style={styles.menuText}>Profile</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/settings'); // Corrected path
                    }}
                  >
                    <Icon name="settings" size={22} color="#333" />
                    <Text style={styles.menuText}>Settings</Text>
                  </TouchableOpacity>
                  
                  {/* <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/subscriptionPlans'); // Corrected path
                    }}
                  >
                    <Icon name="card-membership" size={22} color="#333" />
                    <Text style={styles.menuText}>Subscription Plan</Text>
                  </TouchableOpacity> */}
                </View>
              </ScrollView>

              {/* Logout */}
              <View style={styles.logoutContainer}>
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={async () => {
                    onClose();
                    try {
                      await signOut();
                      router.replace('/(auth)/signIn'); // Redirect to sign-in screen
                    } catch (error) {
                      console.error("Logout failed:", error);
                      // Optionally, show a toast or alert to the user
                    }
                  }}
                >
                  <Icon name="logout" size={22} color="#FF3B30" />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </>
    </Modal>
  );
};

export default SidebarComponent;
