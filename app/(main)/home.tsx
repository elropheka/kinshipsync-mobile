import React, { useState } from 'react'; 
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons as Icon, Ionicons as SecondaryIcon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors'; 
import { router } from 'expo-router';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import RecentActivities from '@/components/home/RecentActivities';
import { useSidebar } from '../../context/SidebarContext'; 
import { styles } from '../../styles/app/(main)/home.styles'; 
// import InterstitialAdModal from '@/components/common/Ads/InterstitialAdModal'; 
import { useScrollHandler } from './_layout';
import { useAllEvents } from '../../hooks/useEvents'; 
import { useCurrentUser } from '../../hooks/useUser'; 
import { useAppAuth } from '../../hooks/useAppAuth'; 
import { Notification as NotificationType } from '../../types/userTypes';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { ResponsiveContainer } from '../../components/common/Layout/ResponsiveContainer';
// import { ResponsiveGrid } from '../../components/common/Layout/ResponsiveGrid';
// EventType is not directly used in this file after refactor,
// it will be used by the child component UpcomingEvents.

const DashboardScreen: React.FC = () => {
  const { toggleSidebar: globalToggleSidebar } = useSidebar();
  const { user: authUser } = useAppAuth();
  const { isTablet } = useResponsiveLayout();
  const { 
    events: allEvents, 
    isLoading: isLoadingEvents, 
    error: eventsError 
  } = useAllEvents();
  const { 
    notifications, 
    // subscription: currentUserSubscription, 
    isLoading: isLoadingUserContext, 
    error: userContextError 
  } = useCurrentUser();
  
  // Define all activity-related notification types
  const activityRelatedNotificationTypes: NotificationType['type'][] = [
    // Existing types
    'event_invite',
    'event_update',
    'rsvp_update',
    'task_assigned',
    
    // Team-related
    'team_member_added',
    'family_tree_update',
    'team_task_update',
    
    // Vendor-related
    'vendor_booking',
    'vendor_confirmation',
    'vendor_quote',
    'vendor_review',
    
    // Budget-related
    'budget_item_added',
    'payment_made',
    'budget_milestone',
    
    // Guest-related
    'rsvp_received',
    'guest_milestone',
    'dietary_preference',
    
    // Schedule-related
    'schedule_added',
    'schedule_conflict',
    'schedule_reminder',
    
    // Idea-related
    'idea_submitted',
    'idea_popular',
    'idea_comment',
    
    // Website-related
    'website_published',
    'website_updated',
    'website_stats',
    
    // Milestone-related
    'event_countdown',
    'planning_progress',
    
    // Recommendation-related
    'vendor_suggestion',
    'theme_recommendation',
    'task_reminder'
  ];

  // Filter notifications to get only activity-related ones and take the top 5
  const activities = notifications
    .filter(notification => activityRelatedNotificationTypes.includes(notification.type))
    .slice(0, 5);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  // const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  // selectedActivityId is not used if we simplify handleActivityItemPress
  // const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null); 
  
  const { handleScroll } = useScrollHandler();

  const handleActivityItemPress = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.link) {
        router.push(notification.link as any); // Using 'as any' for now, assuming links are valid paths
    } else {
        router.push('/(main)/notifications');
    }
    // setShowInterstitialAd(true); // Re-evaluate if ad is needed here
  };

  // const handleInterstitialAdClose = () => {
  //   setShowInterstitialAd(false);
  //   // Navigation logic after ad close can be handled by handleActivityItemPress directly
  // };
  
  const welcomeName = authUser?.displayName || authUser?.email || "User";

  return (
    <SafeAreaView style={styles.container} edges={['top','left', 'right', 'bottom']}>
      <ResponsiveContainer>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: isTablet ? 24 : 16 }]}>
          <TouchableOpacity onPress={globalToggleSidebar}>
            <Text style={[styles.kinshipText, { fontSize: isTablet ? 28 : 24 }]}>Kinship</Text>
          </TouchableOpacity>
          {/* Spacer to push icons to the right */}
          <View style={{ flex: 1 }} /> 
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)} style={styles.headerIcon}>
              <Icon name="search" size={isTablet ? 28 : 25} color={Colors.light.tint} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.headerIcon}>
              <SecondaryIcon name="notifications-outline" size={isTablet ? 28 : 25} color={Colors.light.tint} />
            </TouchableOpacity>
            <TouchableOpacity onPress={globalToggleSidebar} style={[styles.headerIcon, { paddingLeft: 4, paddingTop: 1 }]}>
              <SecondaryIcon name="menu-outline" size={isTablet ? 28 : 25} color={Colors.light.tint} />
            </TouchableOpacity>
          </View>
        </View>

      {/* Conditionally rendered Search Bar below header */}
      {isSearchVisible && (
        <View style={styles.searchContainer}> {/* Ensure this style is adapted or a new one like searchContainerExternal is used */}
          <Icon name="search" size={20} color={Colors.light.icon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events"
            placeholderTextColor={Colors.light.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          <TouchableOpacity 
            onPress={() => {
              setIsSearchVisible(false);
              setSearchQuery(''); // Clear search query when closing
            }} 
            style={{ padding: 5 }} // Added padding for easier touch
          >
            <SecondaryIcon name="close" size={22} color={Colors.light.icon} />
          </TouchableOpacity>
        </View>
      )}

        {/* My Dashboard Title */}
        <Text style={[styles.dashboardTitle, { fontSize: isTablet ? 32 : 28, textAlign: isTablet ? 'left' : 'center' }]}>
          Welcome, {welcomeName}!
        </Text>
        <ScrollView 
          style={[styles.dashboardContent, { paddingHorizontal: isTablet ? 24 : 16 }]} 
          showsVerticalScrollIndicator={false} 
          onScroll={handleScroll} 
          scrollEventThrottle={16}
        >

        {isLoadingEvents && <ActivityIndicator style={{marginVertical: 20}} size="large" color={Colors.light.primary}/>}
        {eventsError && <Text style={styles.errorText}>Could not load events.</Text>}
        {!isLoadingEvents && !eventsError && (
          <UpcomingEvents
            events={allEvents.slice(0, 3)} // Display only the first 5 upcoming events
            searchQuery={searchQuery} 
            onSeeAllPress={() => router.push('/(events)/all')}
          />
        )}

        {isLoadingUserContext && notifications.length === 0 && <ActivityIndicator style={{marginVertical: 20}} size="small" color={Colors.light.primary}/>}
        {userContextError && <Text style={styles.errorText}>Could not load recent activity.</Text>}
        {!isLoadingUserContext && !userContextError && (
          <RecentActivities
            notifications={activities} // Use filtered event activities
            onActivityPress={handleActivityItemPress} 
          />
        )}

        {/* Pro Feature Gating Example */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pro Feature: Advanced Analytics</Text>
          {currentUserSubscription?.planId === 'pro' && currentUserSubscription.status === 'active' ? ( // Check actual subscription
            <View style={styles.proFeatureContent}>
              <Icon name="bar-chart" size={50} color={Colors.light.tint} />
              <Text style={styles.proFeatureText}>Detailed event analytics and reports are available for Pro users!</Text>
              <Text style={styles.mockChart}>[Mock Chart Data Placeholder]</Text>
            </View>
          ) : (
            <View style={styles.upgradePrompt}>
              <Icon name="lock-outline" size={30} color={Colors.light.icon} />
              <Text style={styles.upgradeText}>Upgrade to Pro to unlock Advanced Analytics.</Text>
              <TouchableOpacity style={styles.upgradeButton} onPress={() => router.push('/(main)/subscriptionPlans')}>
                <Text style={styles.upgradeButtonText}>View Plans</Text>
              </TouchableOpacity>
            </View>
          )}
        </View> */}

        </ScrollView>

        {/* Ad Placeholder Banner */}
        <View style={[styles.adPlaceholderBanner, { marginHorizontal: isTablet ? 24 : 16 }]}>
          <Text style={[styles.adPlaceholderText, { fontSize: isTablet ? 16 : 14 }]}>Advertisement</Text>
        </View>
      </ResponsiveContainer>

      {/* <InterstitialAdModal
        visible={showInterstitialAd}
        onClose={handleInterstitialAdClose}
      /> */}
    </SafeAreaView>
  );
};

export default DashboardScreen;
