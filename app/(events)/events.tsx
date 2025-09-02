import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/app/(events)/events.styles';
import { useAllEvents } from '@/hooks/useEvents';
import { Event } from '@/types/eventTypes';
import { Colors } from '@/constants/Colors';
import { useAppAuth } from '@/hooks/useAppAuth';

const TABS = ['Guests', 'Events', 'RSVPs', 'Messages'];
const FILTERS = ['All', 'Upcoming', 'Past'];

const EventListScreen = () => {
  const [activeTab, setActiveTab] = useState('Events');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyOwnEvents, setShowOnlyOwnEvents] = useState(true);
  const { events, isLoading, error, fetchEvents: refreshEvents, loadMoreEvents } = useAllEvents();
  const { user: currentUser } = useAppAuth();
  const lastRefetchRef = useRef<number>(0);

  // Refresh events list when screen comes into focus (e.g., returning from create/edit screens)
  useFocusEffect(
    React.useCallback(() => {
      const now = Date.now();
      const timeSinceLastRefetch = now - lastRefetchRef.current;
      
      // Only refetch if it's been more than 2 seconds since last refetch
      if (refreshEvents && timeSinceLastRefetch > 2000) {
        console.log('Events list screen focused, refreshing events...');
        lastRefetchRef.current = now;
        refreshEvents();
      }
    }, [refreshEvents])
  );

  const getEventStatus = (eventDate: string): 'Upcoming' | 'Past' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parsedEventDate = new Date(eventDate);
    parsedEventDate.setHours(0, 0, 0, 0);
    return parsedEventDate >= today ? 'Upcoming' : 'Past';
  };

  const eventsToDisplay = useMemo(() => {
    let processedEvents: (Event & { eventStatus: 'Upcoming' | 'Past' })[] = (events || []).map(event => ({
      ...event,
      eventStatus: getEventStatus(event.date),
    }));

 
    if (showOnlyOwnEvents && currentUser?.uid) {
      processedEvents = processedEvents.filter(event => event.organizerId === currentUser.uid);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      processedEvents = processedEvents.filter(
        event =>
          event.name.toLowerCase().includes(lowercasedQuery) ||
          (event.location && event.location.toLowerCase().includes(lowercasedQuery)) ||
          (event.description && event.description.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (selectedFilter === 'Upcoming') {
      processedEvents = processedEvents.filter(event => event.eventStatus === 'Upcoming');
    } else if (selectedFilter === 'Past') {
      processedEvents = processedEvents.filter(event => event.eventStatus === 'Past');
    }
    return processedEvents;
  }, [searchQuery, events, selectedFilter, showOnlyOwnEvents, currentUser?.uid]);

  const keyExtractor = useCallback((item: Event & { eventStatus: 'Upcoming' | 'Past' }) => item.id, []);

  const ItemSeparator = useCallback(() => <View style={styles.separator} />, []);

  const renderEventItem = useCallback(({ item }: { item: Event & { eventStatus: 'Upcoming' | 'Past' } }) => (
    <View style={styles.eventItem}>
      <View>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
        {item.location && <Text style={styles.eventLocationText}>{item.location}</Text>}
        <Text style={styles.eventOrganizerText}>
          Organizer: {item.organizerId || 'N/A'}
        </Text>
        <Text style={styles.eventGuestCount}>{item.totalAttendees ?? 0} Attendees</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot,
          { backgroundColor: item.eventStatus === 'Upcoming' ? Colors.light.success : Colors.light.error }
        ]} />
        <Text style={[
          styles.statusText,
          { color: item.eventStatus === 'Upcoming' ? Colors.light.textDarkContrast : Colors.light.error }
        ]}>
          {item.eventStatus}
        </Text>
      </View>
    </View>
  ), []);

  const navigateToTab = useCallback((tabName: string) => {
    if (tabName === 'Guests') {
      router.push('/(events)/guests');
    } else if (tabName === 'Events') {
   
    } else if (tabName === 'RSVPs') {
      router.push('/(events)/rsvps');
    } else if (tabName === 'Messages') {
      router.push('/(events)/messages');
    }
    setActiveTab(tabName);
  }, []);

  const handleFilterSelect = useCallback((filterName: string) => {
    setSelectedFilter(filterName);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent}/>
      <Stack.Screen 
        options={{ 
          title: "Events",
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }}>
              <Ionicons name="information-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          )
        }} 
      />
   
      
      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => navigateToTab(tab)}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Events"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter
            ]}
            onPress={() => handleFilterSelect(filter)}
          >
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
        
      
        <TouchableOpacity 
          style={[
            styles.ownershipToggle,
            showOnlyOwnEvents && styles.ownershipToggleActive
          ]}
          onPress={() => setShowOnlyOwnEvents(!showOnlyOwnEvents)}
        >
          <Ionicons 
            name={showOnlyOwnEvents ? "person" : "people"} 
            size={16} 
            color={showOnlyOwnEvents ? "white" : Colors.light.primary} 
          />
          <Text style={[
            styles.ownershipToggleText,
            showOnlyOwnEvents && styles.ownershipToggleTextActive
          ]}>
            {showOnlyOwnEvents ? 'My Events' : 'All Events'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addEventButton} onPress={() => router.push('/(events)/createEvent')}>
          <AntDesign name="plus" size={18} color="white" />
          <Text style={styles.addEventText}>Add new event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.itemCountContainer}>
        <Text style={styles.itemCount}>{isLoading ? 'Loading...' : `${eventsToDisplay.length} Events`}</Text>
      </View>

      {isLoading && !eventsToDisplay.length && !error ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load events. {error.message}</Text>
          <TouchableOpacity onPress={() => refreshEvents && refreshEvents()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : eventsToDisplay.length === 0 && !isLoading ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No events found.</Text>
        </View>
      ) : (
        <FlatList
          data={eventsToDisplay}
          renderItem={renderEventItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={ItemSeparator}
          onRefresh={refreshEvents}
          refreshing={isLoading}
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading && eventsToDisplay.length > 0 ? <ActivityIndicator size="small" color="#0000ff" style={{ marginVertical: 20 }} /> : null}
        />
      )}
  
    </SafeAreaView>
  );
};

export default EventListScreen;
