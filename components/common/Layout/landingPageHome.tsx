import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '@/styles/components/common/Layout/landingPageHome.styles';
import { Colors } from '@/constants/Colors';
import Slider from '@/components/common/slider';

interface LandingPageHomeProps {
  onLoginPress: () => void;
  onCreateAccountPress: () => void;
}

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const LandingPageHome: React.FC<LandingPageHomeProps> = ({
  onLoginPress,
  onCreateAccountPress
}) => {
  // Group features into three slides
  const featuresData: Feature[][] = [
    [
      {
        id: '1',
        icon: 'event',
        title: 'Event Creation',
        description: 'Create and manage your events with ease'
      },
      {
        id: '2',
        icon: 'web',
        title: 'Custom Websites',
        description: 'Beautiful, customizable event websites'
      }
    ],
    [
      {
        id: '3',
        icon: 'people',
        title: 'Guest Management',
        description: 'Organize your guest list and RSVPs'
      },
      {
        id: '4',
        icon: 'account-balance-wallet',
        title: 'Budget Tracking',
        description: 'Keep track of all your event expenses'
      }
    ],
    [
      {
        id: '5',
        icon: 'assignment',
        title: 'Task Management',
        description: 'Assign and track tasks with timelines'
      },
      {
        id: '6',
        icon: 'store',
        title: 'Vendor Management',
        description: 'Find and manage vendors and suppliers'
      }
    ]
  ];

  const renderFeatureSlide = (features: Feature[]) => (
    <View style={styles.featureSlide}>
      <Text style={styles.featuresTitle}>Features</Text>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Icon name={item.icon} size={24} color={Colors.light.buttonPrimary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureText}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

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

      {/* Features Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          height={300}
          autoPlay={true}
          autoPlayInterval={4000}
          showDots={true}
          showArrows={true}
          loop={true}
        >
          {featuresData.map((slideFeatures, index) => 
            renderFeatureSlide(slideFeatures)
          )}
        </Slider>
      </View>

      {/* Collaboration text */}
      <View style={styles.collaborationContainer}>
        <Text style={styles.collaborationText}>
          Collaborate with family and friends to streamline your reunion—all in one place.
        </Text>
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
