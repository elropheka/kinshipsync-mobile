import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/notifications/NotificationListItem.styles';
import { Notification as UserNotification } from '../../types/userTypes';

export interface DisplayNotification {
  id: string;
  sender: string;
  message: string;
  time: string;
  avatar: keyof typeof Ionicons.glyphMap;
  type: 'updates' | 'events' | 'messages' | 'other';
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
      
      <View style={styles.avatarContainer}>
        <Ionicons name={item.avatar} size={30} color="#555" style={styles.avatarIcon} />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.senderName}>{item.sender}</Text>
        </View>
        
        <Text style={styles.notificationText} numberOfLines={2} ellipsizeMode="tail">
          {item.message}
        </Text>
        
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationListItem;
