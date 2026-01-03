import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '@/types/eventTypes';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { useAppTheme } from '@/context/AppThemeContext';

interface EventDetailHeaderProps {
  event: Event;
  deadlineInfo: {
    text: string;
    style: object;
  };
  currentUserId?: string;
  onEditEvent?: () => void;
  isOrganizer?: boolean;
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ event, deadlineInfo, currentUserId, onEditEvent, isOrganizer }) => {
  const { currentColors } = useAppTheme();
  const styles = createEventDetailsStyles(currentColors);
  
  if (!event) {
    return null; 
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.title}>{event.name}</Text>
        {isOrganizer && onEditEvent && (
          <TouchableOpacity onPress={onEditEvent} style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.detailItem}>
        <Ionicons name="calendar-outline" size={20} color={currentColors.textSecondary} style={styles.icon} />
        <Text style={styles.detailText}>{new Date(event.date).toLocaleDateString()}</Text>
      </View>
      {event.time && (
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={20} color={currentColors.textSecondary} style={styles.icon} />
          <Text style={styles.detailText}>{event.time}</Text>
        </View>
      )}
      {event.location && (
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color={currentColors.textSecondary} style={styles.icon} />
          <Text style={styles.detailText}>{event.location}</Text>
        </View>
      )}
      {event.description && (
        <>
          <Text style={styles.descriptionTitle}>Description:</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </>
      )}
      <View style={styles.deadlineContainer}>
        <Ionicons name="timer-outline" size={20} color={(deadlineInfo.style as any).color || "#555"} style={styles.icon} />
        <Text style={[styles.detailText, deadlineInfo.style]}>{deadlineInfo.text}</Text>
      </View>
    </View>
  );
};

export default EventDetailHeader;
