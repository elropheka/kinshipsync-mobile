import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '@/context/AppThemeContext';
import { styles } from '@/styles/components/common/Layout/landingPageHome.styles';
import Slider from '@/components/common/slider';
import { Layout, Spacing } from '@/constants/dimensions';

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
  const { currentColors } = useAppTheme();

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
      },
      {
        id: '3',
        icon: 'schedule',
        title: 'Smart Scheduling',
        description: 'Intelligent scheduling and timeline management'
      }
    ],
    [
      {
        id: '4',
        icon: 'people',
        title: 'Guest Management',
        description: 'Organize your guest list and RSVPs'
      },
      {
        id: '5',
        icon: 'account-balance-wallet',
        title: 'Budget Tracking',
        description: 'Keep track of all your event expenses'
      }
    ],
    [
      {
        id: '6',
        icon: 'assignment',
        title: 'Task Management',
        description: 'Assign and track tasks with timelines'
      },
      {
        id: '7',
        icon: 'store',
        title: 'Vendor Management',
        description: 'Find and manage vendors and suppliers'
      },
      {
        id: '8',
        icon: 'chat',
        title: 'Team Communication',
        description: 'Stay connected with your event team'
      }
    ]
  ];

  const renderFeatureSlide = (features: Feature[]) => (
    <View style={styles.featureSlide}>
      <View style={styles.featuresGrid}>
        {features.map((item) => (
          <View key={item.id} style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Icon name={item.icon} size={24} color={currentColors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureText}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.pageContainer}>
      
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          
        </View>
        <Text style={styles.appName}>KINSHIP SYNC</Text>
      </View>

      
      <Text style={styles.tagline}>
        Your ultimate event planner and beyond!
      </Text>

      
      <Text style={styles.description}>
        Bring everyone together—easily organize your reunion with family and friends in one central spot.
      </Text>

      
      <View style={styles.sliderContainer}>
        <Slider
          height={300}
          autoPlay={true}
          autoPlayInterval={4000}
          showDots={false}
          showArrows={false}
          loop={true}
          width={Layout.SCREEN_WIDTH - Spacing.xxxxl}
        >
          {featuresData.map((slideFeatures, index) => 
            <View key={index}>
              {renderFeatureSlide(slideFeatures)}
            </View>
          )}

        </Slider>
        {/* <Text style={styles.collaborationText}>
            Collaborate with family and friends to streamline your reunion—all in one place.
        </Text> */}
     
      </View>

      
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
