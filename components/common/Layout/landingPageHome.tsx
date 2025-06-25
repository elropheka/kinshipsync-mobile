import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Removed Dimensions
import Icon from 'react-native-vector-icons/MaterialIcons'; // Example icon library
import { styles } from '../../../styles/components/common/Layout/landingPageHome.styles'; // Adjusted path

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
        <Text style={styles.appName}>KINSHIP</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Your ultimate event{'\n'}
        planner + everything in between
      </Text>

      {/* Main content - side by side layout */}
      <View style={styles.mainContentContainer}>
        {/* Feature buttons */}
        <View style={styles.featuresContainer}>
          <View style={[styles.featureButton, styles.eventsButton]}>
            <Text style={styles.featureButtonText}>Events</Text>
          </View>
          
          <View style={[styles.featureButton, styles.vendorsButton]}>
            <Text style={styles.featureButtonText}>VENDORS</Text>
          </View>
          
          <View style={[styles.featureButton, styles.websiteButton]}>
            <Text style={styles.featureButtonText}>WEDDING WEBSITE</Text>
          </View>
          
          <View style={[styles.featureButton, styles.miscButton]}>
            <Text style={styles.featureButtonText}>MISC</Text>
          </View>
          
          <View style={styles.andMoreContainer}>
            <Text style={styles.andMoreText}>AND MORE!</Text>
          </View>
        </View>

        {/* Phone mockup with app preview */}
        <View style={styles.phonePreviewContainer}>
          <View style={styles.phonePreview}>
            <View style={styles.phoneHeader}>
              <Text style={styles.daysCounter}>300 days to go</Text>
              <Icon name="notifications-none" size={28} color='#000' />
            </View>

            <View style={styles.eventInfoContainer}>
              <Text style={styles.coupleNames}>Sarah &{'\n'}Daniel</Text>
              <View style={styles.eventDetailsRow}>
                <Text style={styles.eventDetailsIcon}>📅</Text>
                <Text style={styles.eventDetailsText}>April 9, 2025</Text>
              </View>
              <View style={styles.eventDetailsRow}>
                <Text style={styles.eventDetailsIcon}>📍</Text>
                <Text style={styles.eventDetailsText}>New York, NY</Text>
              </View>
            </View>

            <View style={styles.featureSection}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureTitle}>Venues</Text>
                <Text style={styles.featureIcon}>▼</Text>
              </View>
              <Text style={styles.featureDescription}>
                Find your kind of place{'\n'}
                for the celebration to{'\n'}
                go down.
              </Text>
              <View style={styles.featureImage}>
                <View style={styles.imagePlaceholder}></View>
              </View>
            </View>

            <View style={styles.featureSection}>
              <View style={[styles.featureHeader, styles.vendorHeader]}>
                <Text style={styles.featureTitle}>Vendors</Text>
                <Text style={styles.featureIcon}>▼</Text>
              </View>
              <Text style={styles.featureDescription}>
                Get in touch with{'\n'}
                photographers, DJs,{'\n'}
                florists and more
              </Text>
              <View style={styles.featureImage}>
                <View style={styles.imagePlaceholder}></View>
              </View>
            </View>

            <View style={styles.featureSection}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureTitle}>Announcements</Text>
                <Text style={styles.featureIcon}>▼</Text>
              </View>
              <View style={styles.announcementTypes}>
                <View style={styles.announcementItem}>
                  <View style={styles.announcementImage}></View>
                  <Text style={styles.announcementText}>Save the date</Text>
                </View>
                <View style={styles.announcementItem}>
                  <View style={styles.announcementImage}></View>
                  <Text style={styles.announcementText}>Birthday party</Text>
                </View>
              </View>
            </View>
          </View>
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
