import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Removed AntDesign as it's not used
import { Stack, router } from 'expo-router'; // Removed useLocalSearchParams
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(events)/guests.styles'; // Assuming styles are somewhat reusable or will be adapted
import { useAppAuth } from '../../hooks/useAppAuth';
import { useAllEvents } from '../../hooks/useEvents'; // Use the filtered events hook
import { Event as EventType } from '../../types/eventTypes'; // Only EventType needed here
import { Colors } from '../../constants/Colors';

const EventSelectionForGuestsScreen = () => {
  const { user } = useAppAuth();
  const isAuthenticated = !!user;
  
  const { events, isLoading, error, fetchEvents: refreshEvents } = useAllEvents();

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
                if (isAuthenticated && refreshEvents) {
                    refreshEvents();
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
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.accent} hidden={Platform.OS === 'android'}/>
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
