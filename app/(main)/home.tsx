import React, { useState } from 'react'; 
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { MaterialIcons as Icon, Ionicons as SecondaryIcon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors'; 
import { router } from 'expo-router';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import RecentActivities from '@/components/home/RecentActivities';
import { useSidebar } from '@/context/SidebarContext';
import { createHomeStyles } from '@/styles/app/(main)/home.styles';
import { useAppTheme } from '@/context/AppThemeContext'; 

import { useScrollHandler } from './_layout';
import { useAllEvents } from '@/hooks/useEvents'; 
import { useCurrentUser } from '@/hooks/useUser'; 
import { useAppAuth } from '@/hooks/useAppAuth'; 
import { Notification as NotificationType } from '@/types/userTypes';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { ResponsiveContainer } from '@/components/common/Layout/ResponsiveContainer';


const DashboardScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createHomeStyles(currentColors);

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
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <ResponsiveContainer>
        <View style={styles.header}>
          <TouchableOpacity onPress={globalToggleSidebar}>
            <Text style={[styles.kinshipText, { fontSize: isTablet ? 28 : 24 }]}>Kinship</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)} style={styles.headerIcon}>
              <Icon name="search" size={isTablet ? 28 : 25} color={currentColors.tint} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.headerIcon}>
              <View style={styles.notificationIconContainer}>
                <SecondaryIcon name="notifications-outline" size={isTablet ? 28 : 25} color={currentColors.tint} />
                {(() => {
                  const unreadCount = notifications.filter(n => !n.isRead).length;
                  return unreadCount > 0 ? (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </View>
                  ) : null;
                })()}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={globalToggleSidebar} style={[styles.headerIcon, { paddingLeft: 4, paddingTop: 1 }]}>
              <SecondaryIcon name="menu-outline" size={isTablet ? 28 : 25} color={currentColors.tint} />
            </TouchableOpacity>
          </View>
        </View>

      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={currentColors.icon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events"
            placeholderTextColor={currentColors.icon}
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
            <SecondaryIcon name="close" size={22} color={currentColors.icon} />
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
        {isLoadingEvents && allEvents.length === 0 && <ActivityIndicator style={{marginVertical: 20}} size="large" color={currentColors.primary}/>}
        {eventsError && <Text style={styles.errorText}>Could not load events.</Text>}
        <UpcomingEvents
          events={allEvents} 
          searchQuery={searchQuery} 
          onSeeAllPress={() => router.push('/(events)/all')}
        />

        {isLoadingUserContext && notifications.length === 0 && <ActivityIndicator style={{marginVertical: 20}} size="small" color={currentColors.primary}/>}
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
