import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Removed AntDesign as it's not used
import { Stack, router } from 'expo-router'; // Removed useLocalSearchParams
import { SafeAreaView } from 'react-native-safe-area-context';
import { createGuestsStyles } from '../../styles/app/(events)/guests.styles';
import { useAppTheme } from '@/context/AppThemeContext'; // Assuming styles are somewhat reusable or will be adapted
import { useAppAuth } from '../../hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import { useAllEvents } from '../../hooks/useEvents'; // Use the filtered events hook
import { Event as EventType } from '../../types/eventTypes'; // Only EventType needed here

const EventSelectionForGuestsScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createGuestsStyles(currentColors);


  const { user } = useAppAuth();
  const isAuthenticated = !!user;
  const { showError } = useAlert();
  
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
      <Ionicons name="chevron-forward" size={24} color={currentColors.textSecondary} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['left', 'right', 'bottom']}>
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text style={{ marginTop: 10 }}>Loading events...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['left', 'right', 'bottom']}>
        <Text style={{ color: currentColors.error, textAlign: 'center', marginBottom: 10 }}>Error: {error.message}</Text>
        <TouchableOpacity 
            onPress={() => { // Simplified retry logic
                if (isAuthenticated && refreshEvents) {
                    refreshEvents();
                } else {
                    showError("Cannot Retry", "Please ensure you are signed in.");
                }
            }} 
            style={{ padding: 10, backgroundColor: currentColors.tint, borderRadius: 5}}
        >
           <Text style={{color: currentColors.text}}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: 'Select Event for Guest List', // Changed title
          headerRight: undefined // Removed search icon
        }} 
      />
      
      {events.length === 0 && !isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: currentColors.textSecondary}}>
                No events found.
            </Text>
            <Text style={{fontSize: 14, color: currentColors.textSecondary, marginTop: 5}}>
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
