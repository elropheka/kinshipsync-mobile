import React, { useState } from 'react'; 
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons as Icon, Ionicons as SecondaryIcon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors'; 
import { router } from 'expo-router';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import RecentActivities from '@/components/home/RecentActivities';
import { useSidebar } from '@/context/SidebarContext'; 
import { styles } from '@/styles/app/(main)/home.styles'; 

import { useScrollHandler } from './_layout';
import { useAllEvents } from '@/hooks/useEvents'; 
import { useCurrentUser } from '@/hooks/useUser'; 
import { useAppAuth } from '@/hooks/useAppAuth'; 
import { Notification as NotificationType } from '@/types/userTypes';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { ResponsiveContainer } from '@/components/common/Layout/ResponsiveContainer';


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

    isLoading: isLoadingUserContext, 
    error: userContextError 
  } = useCurrentUser();
  
  const activityRelatedNotificationTypes: NotificationType['type'][] = [
    'event_invite',
    'event_update',
    'rsvp_update',
    'task_assigned',
    
   
    'team_member_added',
    'family_tree_update',
    'team_task_update',
    
    
    'vendor_booking',
    'vendor_confirmation',
    'vendor_quote',
    'vendor_review',
    
    
    'budget_item_added',
    'payment_made',
    'budget_milestone',
    
    
    'rsvp_received',
    'guest_milestone',
    'dietary_preference',
    
  
    'schedule_added',
    'schedule_conflict',
    'schedule_reminder',
    

    'idea_submitted',
    'idea_popular',
    'idea_comment',
    
  
    'website_published',
    'website_updated',
    'website_stats',
    
   
    'event_countdown',
    'planning_progress',
    
    
    'vendor_suggestion',
    'theme_recommendation',
    'task_reminder'
  ];

  
  const activities = notifications
    .filter(notification => activityRelatedNotificationTypes.includes(notification.type))
    .slice(0, 5);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
 
  
  const { handleScroll } = useScrollHandler();

  const handleActivityItemPress = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.link) {
        router.push(notification.link as any); 
    } else {
        router.push('/(main)/notifications');
    }
  };


  
  const welcomeName = authUser?.displayName || authUser?.email || "User";

  return (
    <SafeAreaView style={styles.container} edges={['top','left', 'right', 'bottom']}>
      <ResponsiveContainer>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={globalToggleSidebar}>
            <Text style={[styles.kinshipText, { fontSize: isTablet ? 28 : 24 }]}>Kinship</Text>
          </TouchableOpacity>
          
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

      
      {isSearchVisible && (
        <View style={styles.searchContainer}> 
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
              setSearchQuery(''); 
            }} 
            style={{ padding: 5 }} 
          >
            <SecondaryIcon name="close" size={22} color={Colors.light.icon} />
          </TouchableOpacity>
        </View>
      )}

        
        <Text style={[styles.dashboardTitle, { fontSize: isTablet ? 32 : 28, textAlign: isTablet ? 'left' : 'center' }]}>
          Welcome, {welcomeName}!
        </Text>
        <ScrollView 
          style={styles.dashboardContent} 
          showsVerticalScrollIndicator={false} 
          onScroll={handleScroll} 
          scrollEventThrottle={16}
        >

        {isLoadingEvents && <ActivityIndicator style={{marginVertical: 20}} size="large" color={Colors.light.primary}/>}
        {eventsError && <Text style={styles.errorText}>Could not load events.</Text>}
        {!isLoadingEvents && !eventsError && (
          <UpcomingEvents
            events={allEvents.slice(0, 3)} 
            searchQuery={searchQuery} 
            onSeeAllPress={() => router.push('/(events)/all')}
          />
        )}

        {isLoadingUserContext && notifications.length === 0 && <ActivityIndicator style={{marginVertical: 20}} size="small" color={Colors.light.primary}/>}
        {userContextError && <Text style={styles.errorText}>Could not load recent activity.</Text>}
        {!isLoadingUserContext && !userContextError && (
          <RecentActivities
            notifications={activities} 
            onActivityPress={handleActivityItemPress} 
          />
        )}


        </ScrollView>

        
      </ResponsiveContainer>

     
    </SafeAreaView>
  );
};

export default DashboardScreen;
