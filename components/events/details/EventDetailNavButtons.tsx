import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed

interface EventDetailNavButtonsProps {
  eventId: string;
}

const EventDetailNavButtons: React.FC<EventDetailNavButtonsProps> = ({ eventId }) => {
  return (
    <View>
      <TouchableOpacity 
        style={[styles.navButton, styles.scheduleButton]} 
        onPress={() => router.push({ pathname: '/(events)/schedule', params: { eventId: eventId } })}
      >
        <Ionicons name="calendar-number-outline" size={22} color="#fff" style={styles.navButtonIcon}/>
        <Text style={styles.navButtonText}>View Schedule</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, styles.ideasButton]} 
        onPress={() => router.push({ pathname: '/(events)/ideas', params: { eventId: eventId } })}
      >
        <Ionicons name="bulb-outline" size={22} color="#fff" style={styles.navButtonIcon}/>
        <Text style={styles.navButtonText}>Event Ideas</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, styles.rsvpButton]} 
        onPress={() => router.push({ pathname: '/(events)/rsvps', params: { eventId: eventId } })}
      >
        <Ionicons name="people-outline" size={22} color="#fff" style={styles.navButtonIcon}/>
        <Text style={styles.navButtonText}>Manage RSVPs/Guests</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, styles.seatingButton]} 
        onPress={() => router.push({ pathname: '/(events)/seating', params: { eventId: eventId } })}
      >
        <Ionicons name="car-outline" size={22} color="#fff" style={styles.navButtonIcon}/>
        <Text style={styles.navButtonText}>View Seating</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventDetailNavButtons;
