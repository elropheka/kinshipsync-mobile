import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/notifications/NotificationListItem.styles';
import { Notification as UserNotification } from '../../types/userTypes'; // Assuming this is the raw type

// This is the DisplayNotification type from app/(main)/notifications.tsx
// It's good practice to define this in a shared types file if used in multiple places,
// or pass all necessary primitive props. For now, let's redefine a similar one or import if available.
export interface DisplayNotification {
  id: string;
  sender: string;
  message: string;
  time: string;
  avatar: keyof typeof Ionicons.glyphMap;
  type: 'updates' | 'events' | 'messages' | 'other'; // Simplified or adjust as needed
  isRead: boolean;
  originalType?: UserNotification['type'];
  relatedEntityId?: string;
}

interface NotificationListItemProps {
  item: DisplayNotification;
  onPress: (item: DisplayNotification) => void;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => onPress(item)}
    >
      {!item.isRead && <View style={styles.unreadIndicator} />} 
      {/* Unread indicator moved to the far left */}
      
      <View style={styles.avatarContainer}>
        <Ionicons name={item.avatar} size={30} color="#555" style={styles.avatarIcon} />
      </View>
      
      <View style={styles.notificationContent}>
        {/* Header now only contains the sender name */}
        <View style={styles.notificationHeader}>
          <Text style={styles.senderName}>{item.sender}</Text>
          {/* Original time display removed from header */}
        </View>
        
        <Text style={styles.notificationText} numberOfLines={2} ellipsizeMode="tail">
          {item.message}
        </Text>
        
        {/* Time displayed at the bottom of the content area */}
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      {/* Original unread indicator position removed */}
    </TouchableOpacity>
  );
};

export default NotificationListItem;
