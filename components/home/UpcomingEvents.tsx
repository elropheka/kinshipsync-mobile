import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Event as EventType } from '../../types/eventTypes';
import { styles } from '../../styles/app/(main)/home.styles'; 
import { Colors } from 'constants/Colors';

interface UpcomingEventItemProps {
  event: EventType;
  index: number;
}

const UpcomingEventItem: React.FC<UpcomingEventItemProps> = ({ event, index }) => {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const title = event.name;
  const time = event.time;
  const location = event.location;

  const dateBgColor = index % 2 === 0 ? '#EAE9FE' : '#FEEBD6';
  const dateTextColor = index % 2 === 0 ? '#6338EF' : '#F2671D';

  return (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => router.push({
        pathname: '/(events)/details/[id]',
        params: { id: event.id }
      })}
    >
      <View style={[styles.eventDate, { backgroundColor: dateBgColor }]}>
        <Text style={[styles.eventMonth, { color: dateTextColor }]}>{month}</Text>
        <Text style={[styles.eventDay, { color: dateTextColor }]}>{day}</Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle} numberOfLines={2}>{title}</Text>
        <View style={styles.eventTimeLocation}>
          {time && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="schedule" size={14} color={Colors.light.icon} />
              <Text style={styles.eventTime}>{time}</Text>
            </View>
          )}
          {location && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: time ? 4 : 0 }}>
              <Icon name="location-on" size={14} color={Colors.light.icon} />
              <Text style={styles.eventLocation} numberOfLines={1}>{location}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface UpcomingEventsProps {
  events: EventType[];
  searchQuery?: string;
  onSeeAllPress: () => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events: allEvents, searchQuery, onSeeAllPress }) => {
  const upcomingEvents = useMemo(() => {
    console.log('UpcomingEvents: Received events:', allEvents.length);
    console.log('UpcomingEvents: Events data:', allEvents.map(e => ({ id: e.id, name: e.name, date: e.date, organizerId: e.organizerId })));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('UpcomingEvents: Today:', today.toISOString());

    let filtered = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const isUpcoming = eventDate >= today;
      console.log(`UpcomingEvents: Event "${event.name}" (${event.date}) - isUpcoming: ${isUpcoming}`);
      return isUpcoming;
    });
    
    console.log('UpcomingEvents: Filtered upcoming events:', filtered.length);

    if (searchQuery && searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.name.toLowerCase().includes(lowercasedQuery) ||
          (event.location && event.location.toLowerCase().includes(lowercasedQuery)) ||
          (event.description && event.description.toLowerCase().includes(lowercasedQuery))
      );
    }
    
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, searchQuery]);

  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, styles.recentActivityHeader]}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingEvents.length > 0 && (
            <TouchableOpacity onPress={onSeeAllPress}>
                <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
        )}
      </View>
      {upcomingEvents.length > 0 ? (
        upcomingEvents.slice(0, 3).map((event, index) => (
          <UpcomingEventItem key={event.id} event={event} index={index} />
        ))
      ) : (
        <Text style={styles.noItemsText}>No upcoming events found.</Text>
      )}
    </View>
  );
};

export default UpcomingEvents;
