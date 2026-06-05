import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import { createEventsStyles } from '@/styles/app/(events)/events.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAllEvents } from '@/hooks/useEvents';
import { Event } from '@/types/eventTypes';


const TABS = ['Guests', 'Events', 'RSVPs', 'Messages'];
const FILTERS = ['All', 'Upcoming', 'Past'];

const EventListScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createEventsStyles(currentColors), [currentColors]);


  const [activeTab, setActiveTab] = useState('Events');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { events, isLoading, error, fetchEvents: refreshEvents, loadMoreEvents } = useAllEvents();
  const lastRefetchRef = useRef<number>(0);

  useFocusEffect(
    React.useCallback(() => {
      const now = Date.now();
      const timeSinceLastRefetch = now - lastRefetchRef.current;
      
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
    let processedEvents: Array<Event & { eventStatus: 'Upcoming' | 'Past' }> = (events || []).map(event => ({
      ...event,
      eventStatus: getEventStatus(event.date),
    }));

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
  }, [searchQuery, events, selectedFilter]);

  const keyExtractor = useCallback((item: Event & { eventStatus: 'Upcoming' | 'Past' }) => item.id, []);

  const ItemSeparator = () => <View style={styles.separator} />;

  const renderEventItem = ({ item }: { item: Event & { eventStatus: 'Upcoming' | 'Past' } }) => (
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
          { backgroundColor: item.eventStatus === 'Upcoming' ? currentColors.success : currentColors.error }
        ]} />
        <Text style={[
          styles.statusText,
          { color: item.eventStatus === 'Upcoming' ? currentColors.textDarkContrast : currentColors.error }
        ]}>
          {item.eventStatus}
        </Text>
      </View>
    </View>
  );

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
      <Stack.Screen
        options={{
          title: 'Events',
          ...HeaderButtonItems.headerRightIconOptions({
            label: 'Info',
            sfSymbol: 'info.circle',
            ionicon: 'information-circle-outline',
            onPress: () => undefined,
            tintColor: currentColors.accentContrastText,
          }),
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
