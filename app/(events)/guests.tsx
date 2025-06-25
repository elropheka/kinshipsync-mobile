import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Removed AntDesign as it's not used
import { Stack, router } from 'expo-router'; // Removed useLocalSearchParams
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(events)/guests.styles'; // Assuming styles are somewhat reusable or will be adapted
import { useAppAuth } from '../../hooks/useAppAuth';
import { getEventsPaginated } from '../../services/eventService'; // Changed to getEventsPaginated
import { Event as EventType } from '../../types/eventTypes'; // Only EventType needed here
import { Colors } from '../../constants/Colors';

const EventSelectionForGuestsScreen = () => {
  const { user } = useAppAuth();
  const isAuthenticated = !!user;

  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // Removed guest-specific states: selectedStatusFilter, searchQuery, isSearchVisible, eventDetails

  useEffect(() => {
    if (!isAuthenticated) {
      setError(new Error("User not authenticated. Please sign in to view events."));
      setIsLoading(false);
      setEvents([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchEvents = async () => {
      try {
        // Fetch first page of events, e.g., 20 events
        const fetchedEvents = await getEventsPaginated(isAuthenticated, 20);
        setEvents(fetchedEvents);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError(new Error(err.message || "Failed to load events."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    // No specific unsubscribe needed for a one-time fetch like getEventsPaginated
  }, [isAuthenticated, user]); // Removed eventId from dependencies

  const handleEventPress = (eventId: string) => {
    router.push({ pathname: '/(events)/guests/[eventId]', params: { eventId: eventId } });
  };

  const renderEventItem = ({ item }: { item: EventType }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => handleEventPress(item.id)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eventName}>{item.name}</Text>
        {item.date && <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.light.textSecondary} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['left', 'right', 'bottom']}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{ marginTop: 10 }}>Loading events...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['left', 'right', 'bottom']}>
        <Text style={{ color: Colors.light.error, textAlign: 'center', marginBottom: 10 }}>Error: {error.message}</Text>
        <TouchableOpacity 
            onPress={() => { // Simplified retry logic
                if (isAuthenticated) {
                    setIsLoading(true);
                    setError(null);
                    // Re-trigger useEffect by changing a dependency or calling fetch directly
                    // For simplicity, directly call a fetch function if extracted, or reset state to re-trigger.
                    // This example relies on re-render if user state changes, or manual refresh.
                    // A more robust retry would involve re-calling fetchEvents.
                    const fetchEventsRetry = async () => {
                        try {
                          const fetchedEvents = await getEventsPaginated(isAuthenticated, 20);
                          setEvents(fetchedEvents);
                        } catch (err: any) {
                          setError(new Error(err.message || "Failed to load events."));
                        } finally {
                          setIsLoading(false);
                        }
                      };
                    fetchEventsRetry();
                } else {
                    Alert.alert("Cannot Retry", "Please ensure you are signed in.");
                }
            }} 
            style={{ padding: 10, backgroundColor: Colors.light.tint, borderRadius: 5}}
        >
           <Text style={{color: Colors.dark.text}}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundPrimary} />
      <Stack.Screen 
        options={{ 
          title: 'Select Event for Guest List', // Changed title
          headerRight: undefined // Removed search icon
        }} 
      />
      
      {events.length === 0 && !isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: Colors.light.textSecondary}}>
                No events found.
            </Text>
            <Text style={{fontSize: 14, color: Colors.light.textSecondary, marginTop: 5}}>
                Try creating an event first.
            </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.eventListContainer} // May need new styles
          ItemSeparatorComponent={() => <View style={styles.separator} />} // Assuming separator style is reusable
        />
      )}
    </SafeAreaView>
  );
};

export default EventSelectionForGuestsScreen; // Renamed component
