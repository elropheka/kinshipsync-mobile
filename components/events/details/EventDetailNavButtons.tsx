import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';

interface EventDetailNavButtonsProps {
  eventId: string;
}

const EventDetailNavButtons: React.FC<EventDetailNavButtonsProps> = ({ eventId }) => {
  const { currentColors } = useAppTheme();
  const styles = createEventDetailsStyles(currentColors);
  return (
    <View>
      <TouchableOpacity 
        style={[styles.navButton, styles.scheduleButton]} 
        onPress={() => router.push({ pathname: '/(events)/schedule', params: { eventId: eventId } })}
      >
        <Ionicons name="calendar-number-outline" size={22} color={currentColors.successContrastText} style={styles.navButtonIcon}/>
        <Text style={[styles.navButtonText, { color: currentColors.successContrastText }]}>View Schedule</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, styles.ideasButton]} 
        onPress={() => router.push({ pathname: '/(events)/ideas', params: { eventId: eventId } })}
      >
        <Ionicons name="bulb-outline" size={22} color={currentColors.warningContrastText} style={styles.navButtonIcon}/>
        <Text style={[styles.navButtonText, { color: currentColors.warningContrastText }]}>Event Ideas</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, styles.rsvpButton]} 
        onPress={() => router.push({ pathname: '/(events)/rsvps', params: { eventId: eventId } })}
      >
        <Ionicons name="people-outline" size={22} color={currentColors.infoContrastText} style={styles.navButtonIcon}/>
        <Text style={[styles.navButtonText, { color: currentColors.infoContrastText }]}>Manage RSVPs/Guests</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.navButton, styles.seatingButton]} 
        onPress={() => router.push({ pathname: '/(events)/seating', params: { eventId: eventId } })}
      >
        <Ionicons name="car-outline" size={22} color={currentColors.tertiaryContrastText} style={styles.navButtonIcon}/>
        <Text style={[styles.navButtonText, { color: currentColors.tertiaryContrastText }]}>View Seating</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventDetailNavButtons;
