
import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SecondaryIcon from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { useCurrentUser } from '../../../hooks/useUser';
import { useAppTheme } from '@/context/AppThemeContext';
import { createSideBarStyles, SIDEBAR_WIDTH } from '../../../styles/components/common/Navigation/sideBar.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../Avatar';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const { signOut } = useAuth();
  const { profile: currentUserProfile, isLoading: isLoadingUser } = useCurrentUser();
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createSideBarStyles(currentColors), [currentColors]);

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
          <BrandLoadingSpinner size="large" />
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
                <Image
                  source={require('@/assets/branding/rusty-brown-logo.png')}
                  style={styles.sidebarLogo}
                  resizeMode="contain"
                />
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
                    <Avatar
                      name={currentUserProfile.displayName || currentUserProfile.email || 'User'}
                      avatarUrls={currentUserProfile.avatarUrl ? [currentUserProfile.avatarUrl] : []}
                      size={40}
                    />
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
                      <Avatar
                        name="Loading"
                        avatarUrl={undefined}
                        size={40}
                      />
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
                    <SecondaryIcon name="person-outline" size={22} color={currentColors.text} />
                    <Text style={styles.menuText}>Profile</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/settings');
                    }}
                  >
                    <Icon name="settings" size={22} color={currentColors.text} />
                    <Text style={styles.menuText}>Settings</Text>
                  </TouchableOpacity>
                </View>

                {currentUserProfile?.isVendor ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>VENDOR</Text>
                    
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        onClose();
                        router.push('/(vendors)/dashboard' as any);
                      }}
                    >
                      <SecondaryIcon name="storefront-outline" size={22} color={currentColors.text} />
                      <Text style={styles.menuText}>Dashboard</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        onClose();
                        router.push('/(vendors)/items' as any);
                      }}
                    >
                      <SecondaryIcon name="cube-outline" size={22} color={currentColors.text} />
                      <Text style={styles.menuText}>My Items</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        onClose();
                        router.push('/(vendors)/requests' as any);
                      }}
                    >
                      <SecondaryIcon name="chatbox-ellipses-outline" size={22} color={currentColors.text} />
                      <Text style={styles.menuText}>Requests</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                
                <View style={styles.section}>
                  {/* <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      onClose();
                      router.push('/(main)/subscriptionPlans');
                    }}
                  >
                    <Icon name="card-membership" size={22} color={currentColors.text} />
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
                  <Icon name="logout" size={22} color={currentColors.error} />
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
