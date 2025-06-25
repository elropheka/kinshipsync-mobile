import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../../../types/eventTypes';
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed

interface EventDetailHeaderProps {
  event: Event;
  deadlineInfo: {
    text: string;
    style: object;
  };
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ event, deadlineInfo }) => {
  if (!event) {
    return null; // Or some placeholder/loading state if preferred
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.name}</Text>
      <View style={styles.detailItem}>
        <Ionicons name="calendar-outline" size={20} color="#555" style={styles.icon} />
        <Text style={styles.detailText}>{new Date(event.date).toLocaleDateString()}</Text>
      </View>
      {event.time && (
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={20} color="#555" style={styles.icon} />
          <Text style={styles.detailText}>{event.time}</Text>
        </View>
      )}
      {event.location && (
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color="#555" style={styles.icon} />
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
