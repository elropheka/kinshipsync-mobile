
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SecondaryIcon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { useCurrentUser } from '../../../hooks/useUser';
import { styles, SIDEBAR_WIDTH } from '../../../styles/components/common/Navigation/sideBar.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { signOut } = useAuth();
  const { profile: currentUserProfile, isLoading: isLoadingUser } = useCurrentUser();

  useEffect(() => {
    if (isVisible) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]); // opacityAnim and translateX are animation values, not dependencies

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
      animationType="none"
      onRequestClose={onClose}
    >
      <>
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
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Kinship</Text>
              </View>

              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {currentUserProfile ? (
                  <TouchableOpacity 
                    style={styles.profileSection}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/profile');
                    }}
                  >
                    {currentUserProfile.avatarUrl ? (
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

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>ACCOUNT</Text>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/profile');
                    }}
                  >
                    <SecondaryIcon name="person-outline" size={22} color="#333" />
                    <Text style={styles.menuText}>Profile</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/settings');
                    }}
                  >
                    <Icon name="settings" size={22} color="#333" />
                    <Text style={styles.menuText}>Settings</Text>
                  </TouchableOpacity>
                  
                  {/* <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/subscriptionPlans');
                    }}
                  >
                    <Icon name="card-membership" size={22} color="#333" />
                    <Text style={styles.menuText}>Subscription Plan</Text>
                  </TouchableOpacity> */}
                </View>
              </ScrollView>

              <View style={styles.logoutContainer}>
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={async () => {
                    onClose();
                    try {
                      await signOut();
                      router.replace('/(auth)/signIn');
                    } catch (error) {
                      console.error("Logout failed:", error);
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
