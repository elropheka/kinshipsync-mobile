import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Removed Dimensions
import Icon from 'react-native-vector-icons/MaterialIcons'; // Example icon library
import { styles } from '@/styles/components/common/Layout/landingPageHome.styles'; // Adjusted path
import { Colors } from '@/constants/Colors';
import PhoneComponent, { styles as phoneStyles } from '@/components/phoneComponent';

interface LandingPageHomeProps {
  onLoginPress: () => void;
  onCreateAccountPress: () => void;
}

const LandingPageHome: React.FC<LandingPageHomeProps> = ({
  onLoginPress,
  onCreateAccountPress
}) => {
  return (
    <View style={styles.pageContainer}>
      {/* Logo and app name */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          {/* Logo can be added here */}
        </View>
        <Text style={styles.appName}>KINSHIP SYNC</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Your ultimate event planner and beyond!
      </Text>

      {/* Description */}
      <Text style={styles.description}>
        Bring everyone together—easily organize your reunion with family and friends in one central spot.
      </Text>

      {/* Main content - side by side layout */}
      <View style={styles.mainContentContainer}>
        {/* Features list */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features:</Text>
          
          <View style={styles.featureItem}>
            <Icon name="event" size={20} color={Colors.light.buttonPrimary} />
            <Text style={styles.featureText}>Event Creation</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="web" size={20} color={Colors.light.buttonPrimary} />
            <Text style={styles.featureText}>Customization invite and Website</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="people" size={20} color={Colors.light.buttonPrimary} />
            <Text style={styles.featureText}>Guest List Management</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="account-balance-wallet" size={20} color={Colors.light.buttonPrimary} />
            <Text style={styles.featureText}>Budget Management</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="assignment" size={20} color={Colors.light.buttonPrimary} />
            <Text style={styles.featureText}>Task & Timeline Management</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="store" size={20} color={Colors.light.buttonPrimary} />
            <Text style={styles.featureText}>Vendor & Supplier Management</Text>
          </View>

         
          
          <Text style={styles.collaborationText}>
            Collaborate with family and friends to streamline your reunion—all in one place.
          </Text>
        </View>

        </View>

      {/* Login/Create Account Buttons */}
      <View style={styles.authButtonsContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createAccountButton} onPress={onCreateAccountPress}>
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingPageHome;
