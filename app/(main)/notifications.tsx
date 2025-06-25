import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Switch, 
  StyleSheet,
  Alert, // Added Alert
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { Stack, router } from 'expo-router'; // Added Stack import here, router was already there
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(main)/notifications.styles';
// router import was duplicated, removed from here
import { useCurrentUser } from '../../hooks/useUser'; // Import the hook
import { Notification as UserNotification } from '../../types/userTypes'; // Import the type
import { ActivityIndicator } from 'react-native'; // For loading state
import { formatTimeToNow } from '../../utils/dateUtils'; // Import the date utility
import NotificationListItem, { DisplayNotification } from '../../components/notifications/NotificationListItem'; // Import the new component and type
import NotificationSearchBar from '../../components/notifications/NotificationSearchBar'; // Import the new search bar component
import NotificationFilterChips, { FilterChip as FilterChipType } from '../../components/notifications/NotificationFilterChips'; // Import the new filter chips component
import NotificationSettingsBar from '../../components/notifications/NotificationSettingsBar'; // Import the new settings bar component

// Define interfaces for better type safety
// Filter interface is now effectively FilterChipType, but keeping original name for consistency in this file
interface Filter extends FilterChipType {}


// DisplayNotification is now imported from NotificationListItem.tsx

interface NotificationsPageProps {
  // navigation prop might not be needed if using expo-router for all navigation
  navigation?: NavigationProp<ParamListBase>; 
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ navigation }) => {
  const { 
    notifications: rawNotifications, 
    isLoadingNotifications, 
    markRead, 
    markAllRead, 
    error 
  } = useCurrentUser();

  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<Filter['label']>('All'); 
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map UserNotification to DisplayNotification
  const notificationsData = useMemo((): DisplayNotification[] => {
    return rawNotifications.map((n: UserNotification): DisplayNotification => {
      let sender = n.title || 'Notification'; // Use n.title as the primary sender/subject
      let avatar: keyof typeof Ionicons.glyphMap = 'notifications-outline'; // Default avatar
      let displayType: DisplayNotification['type'] = 'updates'; // Default display type

      // Mapping based on UserNotification.type
      switch (n.type) {
        case 'event_invite':
        case 'event_update':
        case 'rsvp_update':
          displayType = 'events';
          avatar = 'calendar-outline';
          break;
        case 'new_message':
          displayType = 'messages';
          avatar = 'chatbubble-ellipses-outline';
          break;
        case 'task_assigned':
          displayType = 'updates'; // Could be 'tasks' if filter is added
          avatar = 'checkbox-outline';
          break;
        case 'system_alert':
          displayType = 'updates';
          avatar = 'alert-circle-outline';
          break;
        case 'friend_request':
          displayType = 'updates'; // Or 'social' category
          avatar = 'person-add-outline';
          break;
        case 'generic':
        default:
          displayType = 'updates'; // Fallback category
          avatar = 'information-circle-outline';
          break;
      }

      return {
        id: n.id,
        sender: sender, // Mapped from n.title
        message: n.message,
        time: formatTimeToNow(n.createdAt), // Use the new utility function
        avatar: avatar,
        type: displayType,
        isRead: n.isRead,
        originalType: n.type, 
        relatedEntityId: n.referenceId, // Map referenceId
      };
    });
  }, [rawNotifications]);

  const filters: Filter[] = [ 
    { id: 'all', label: 'All' },
    { id: 'events', label: 'Events' }, 
    { id: 'messages', label: 'Messages' }, 
    { id: 'updates', label: 'Updates' }, 
  ];

  const filteredNotifications = useMemo(() => {
    return notificationsData.filter(notification => {
      const filterMatch = activeFilter === 'All' || notification.type === activeFilter.toLowerCase() as DisplayNotification['type'];
      const readMatch = !showOnlyUnread || !notification.isRead;
      const searchMatch = searchQuery === '' ||
                          notification.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      return filterMatch && readMatch && searchMatch;
    });
  }, [notificationsData, activeFilter, showOnlyUnread, searchQuery]);

  const handleNotificationPress = async (item: DisplayNotification) => {
    if (!item.isRead) {
      await markRead(item.id); // Call the hook's function
    }
    // Navigation logic based on notification type
    if (item.relatedEntityId) {
      switch (item.originalType) {
        case 'event_invite':
        case 'event_update':
        case 'rsvp_update':
          router.push({ pathname: '/(events)/details/[id]', params: { id: item.relatedEntityId } });
          break;
        case 'new_message':
          // Assuming relatedEntityId is conversationId for new_message
          router.push({ pathname: '/(chat)/chatArea', params: { conversationId: item.relatedEntityId } });
          break;
        case 'task_assigned':
          // Navigation for tasks might be more complex, e.g., needing eventId and taskId
          // For now, let's log or navigate to a general tasks page if available
          // router.push({ pathname: '/(events)/tasks', params: { eventId: 'EVENT_ID_HERE', taskId: item.relatedEntityId } });
          Alert.alert("Task Notification", `Navigate to task: ${item.message}`);
          console.log("Navigate to task:", item.relatedEntityId);
          break;
        case 'friend_request':
          // Navigate to a friends or social page if it exists
          // router.push('/(main)/friends'); 
          Alert.alert("Friend Request", `${item.message}`);
          break;
        case 'system_alert':
        case 'generic':
        default:
          console.log("Notification pressed:", item);
          // No specific navigation for these types, or could navigate to a general info screen
          Alert.alert(item.sender, item.message);
          break;
      }
    } else {
      console.log("Notification pressed, but no relatedEntityId for navigation:", item);
      Alert.alert(item.sender, item.message); // Default behavior if no related ID
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead(); // Call the hook's function
  };

  // renderNotificationItem is removed as it's replaced by NotificationListItem component

  const renderSeparator = () => <View style={styles.separator} />;

  if (isLoadingNotifications) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text style={styles.errorText}>Error loading notifications:</Text>
        <Text style={styles.errorTextDetail}>{error.message || 'An unexpected error occurred.'}</Text>
        {/* Optionally, add a retry button here */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Notifications" }} />
      {/* Custom header View removed as per previous step, this just corrects the import location */}

      {/* Search Bar */}
      {isSearchVisible && (
        <NotificationSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {/* Filters */}
      <NotificationFilterChips
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Notification Settings */}
      <NotificationSettingsBar
        showOnlyUnread={showOnlyUnread}
        setShowOnlyUnread={setShowOnlyUnread}
      />

      {/* Notification List */}
      <FlatList
        data={filteredNotifications} // Use filtered data
        renderItem={({ item }) => (
          <NotificationListItem
            item={item}
            onPress={handleNotificationPress}
          />
        )}
        keyExtractor={item => item.id}
        style={styles.notificationList}
        ItemSeparatorComponent={renderSeparator}
      />

      {/* Mark All Read Button */}
      <TouchableOpacity 
        style={styles.markAllReadButton}
        onPress={handleMarkAllRead} // Call the handler
      >
        {/* Replace Image with Ionicons */}
        <Ionicons 
          name="checkmark-done-outline" 
          size={24} 
          color="#000" 
          style={styles.markAllReadIcon} 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotificationsPage;
