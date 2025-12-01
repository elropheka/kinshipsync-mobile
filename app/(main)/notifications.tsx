import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(main)/notifications.styles';
import { useCurrentUser } from '../../hooks/useUser';
import { Notification as UserNotification } from '../../types/userTypes';
import { formatTimeToNow } from '../../utils/dateUtils';
import NotificationListItem, { DisplayNotification } from '../../components/notifications/NotificationListItem';
import NotificationSearchBar from '../../components/notifications/NotificationSearchBar';
import NotificationFilterChips, { FilterChip as FilterChipType } from '../../components/notifications/NotificationFilterChips';
import NotificationSettingsBar from '../../components/notifications/NotificationSettingsBar';

type Filter = FilterChipType;

const NotificationsPage: React.FC = () => {
  const { 
    notifications: rawNotifications, 
    isLoadingNotifications, 
    markRead, 
    markAllRead, 
    error 
  } = useCurrentUser();

  const [isSearchVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<Filter['label']>('All'); 
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const notificationsData = useMemo((): DisplayNotification[] => {
    return rawNotifications.map((n: UserNotification): DisplayNotification => {
      let sender = n.title || 'Notification';
      let avatar: keyof typeof Ionicons.glyphMap = 'notifications-outline';
      let displayType: DisplayNotification['type'] = 'updates';

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
          displayType = 'updates';
          avatar = 'checkbox-outline';
          break;
        case 'system_alert':
          displayType = 'updates';
          avatar = 'alert-circle-outline';
          break;
        case 'friend_request':
          displayType = 'updates';
          avatar = 'person-add-outline';
          break;
        case 'generic':
        default:
          displayType = 'updates';
          avatar = 'information-circle-outline';
          break;
      }

      return {
        id: n.id,
        sender: sender,
        message: n.message,
        time: formatTimeToNow(n.createdAt),
        avatar: avatar,
        type: displayType,
        isRead: n.isRead,
        originalType: n.type, 
        relatedEntityId: n.referenceId,
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
      await markRead(item.id);
    }
    if (item.relatedEntityId) {
      switch (item.originalType) {
        case 'event_invite':
        case 'event_update':
        case 'rsvp_update':
          router.push({ pathname: '/(events)/details/[id]', params: { id: item.relatedEntityId } });
          break;
        case 'new_message':
          router.push({ pathname: '/(chat)/chatArea', params: { conversationId: item.relatedEntityId } });
          break;
        case 'task_assigned':
          Alert.alert("Task Notification", `Navigate to task: ${item.message}`);
          break;
        case 'friend_request':
          Alert.alert("Friend Request", `${item.message}`);
          break;
        case 'system_alert':
        case 'generic':
        default:
          Alert.alert(item.sender, item.message);
          break;
      }
    } else {
      Alert.alert(item.sender, item.message);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Notifications" }} />

      {isSearchVisible && (
        <NotificationSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <NotificationFilterChips
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <NotificationSettingsBar
        showOnlyUnread={showOnlyUnread}
        setShowOnlyUnread={setShowOnlyUnread}
      />

      <FlatList
        data={filteredNotifications}
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

      <TouchableOpacity 
        style={styles.markAllReadButton}
        onPress={handleMarkAllRead}
      >
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
