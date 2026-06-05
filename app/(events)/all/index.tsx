import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router'; 
import { createIndexStyles } from '../../../styles/app/(events)/all/index.styles';
import { useAllEvents } from '../../../hooks/useEvents';
import { useAppTheme } from '../../../context/AppThemeContext';
import { Event as AppEvent } from '../../../types/eventTypes';
import LoadingScreen from '@/components/common/LoadingScreen';
import { BrandEmptyState } from '@/components/ui/BrandEmptyState';

type EventClientStatus = 'Upcoming' | 'Past' | 'Planning';

interface ProcessedEvent extends AppEvent {
  derivedStatus: EventClientStatus;
  eventType: string;
  guestCount: number;
  progress: number;
}

interface Summary {
  upcoming: number;
  planned: number;
  completed: number;
}

type EventsScreenProps = Record<string, never>;

const EventsScreen: React.FC<EventsScreenProps> = () => {
  const { currentColors } = useAppTheme();
  const styles = createIndexStyles(currentColors);

  const { events: fetchedEvents, isLoading, error, fetchEvents: refreshEvents } = useAllEvents();
  const [activeTab, setActiveTab] = useState<string>('Upcoming');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getEventClientStatus = (eventDate: string): EventClientStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parsedEventDate = new Date(eventDate);
    parsedEventDate.setHours(0, 0, 0, 0); 
    return parsedEventDate >= today ? 'Upcoming' : 'Past';
  };

  const processedEventsData = useMemo((): ProcessedEvent[] => {
    if (!fetchedEvents) return [];
    return fetchedEvents.map(event => ({
      ...event,
      derivedStatus: getEventClientStatus(event.date),
      eventType: event.name.toLowerCase().includes("wedding") ? "Wedding" :
                 event.name.toLowerCase().includes("corporate") ? "Corporate" :
                 event.name.toLowerCase().includes("charity") ? "Charity" :
                 event.name.toLowerCase().includes("birthday") ? "Birthday" : "General",
      guestCount: (event as any).guests || 0,
      progress: new Date(event.date) < new Date() ? 100 : Math.floor(Math.random() * 70) + 30,
    }));
  }, [fetchedEvents]);

  const filteredEventsData = useMemo(() => {
    let newFilteredEvents = processedEventsData;
    if (activeTab === 'Upcoming') {
      newFilteredEvents = newFilteredEvents.filter(event => event.derivedStatus === 'Upcoming' || event.derivedStatus === 'Planning');
    } else if (activeTab === 'Completed') {
      newFilteredEvents = newFilteredEvents.filter(event => event.derivedStatus === 'Past');
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      newFilteredEvents = newFilteredEvents.filter(
        event =>
          event.name.toLowerCase().includes(lowercasedQuery) ||
          (event.location && event.location.toLowerCase().includes(lowercasedQuery))
      );
    }
    return newFilteredEvents;
  }, [activeTab, searchQuery, processedEventsData]);

  const summaryData: Summary = useMemo(() => {
    const upcoming = processedEventsData.filter(e => e.derivedStatus === 'Upcoming').length;
    const planned = processedEventsData.filter(e => e.derivedStatus === 'Planning').length;
    const completed = processedEventsData.filter(e => e.derivedStatus === 'Past').length;
    return {
      upcoming: upcoming + planned,
      planned: planned,
      completed: completed,
    };
  }, [processedEventsData]);

  const getEventIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type.toLowerCase()) {
      case 'wedding': return 'heart-outline';
      case 'corporate': return 'briefcase-outline';
      case 'charity': return 'ribbon-outline';
      case 'birthday': return 'gift-outline';
      case 'general': return 'calendar-outline';
      default: return 'calendar-outline';
    }
  };

  if (isLoading && !fetchedEvents?.length && !error) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load events: {error.message}</Text>
          <TouchableOpacity onPress={() => refreshEvents && refreshEvents()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen 
        options={{ 
          title: "My Events",
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setShowSearchInput(!showSearchInput)}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          )
        }} 
      />
     

      {showSearchInput && (
        <View style={styles.searchContainerExternal}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIconExternal} />
          <TextInput
            style={styles.searchInputExternal}
            placeholder="Search events by title or location"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: currentColors.neutralBg }]}>
          <Text style={[styles.summaryNumber, { color: currentColors.primary }]}>{summaryData.upcoming}</Text>
          <Text style={styles.summaryLabel}>Upcoming</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: currentColors.tertiaryLight }]}>
          <Text style={[styles.summaryNumber, { color: currentColors.accent }]}>{summaryData.planned}</Text>
          <Text style={styles.summaryLabel}>Planned</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: currentColors.successLight }]}>
          <Text style={[styles.summaryNumber, { color: currentColors.primary }]}>{summaryData.completed}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {['Upcoming', 'All Events', 'Completed'].map((tab: string) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabIndicatorContainer}>
        <View
          style={[
            styles.tabIndicator,
            {
              left: activeTab === 'Upcoming' ? '0%' :
                    activeTab === 'All Events' ? '33.3%' : '66.6%'
            }
          ]}
        />
      </View>

      <ScrollView 
        style={styles.eventsList}
      >

        {!isLoading && filteredEventsData.length === 0 && (
          <BrandEmptyState
            title={`No ${activeTab.toLowerCase()} events`}
            message={searchQuery ? 'Try adjusting your search.' : 'Create an event to start planning with your family.'}
            actionLabel="Create Event"
            onActionPress={() => router.push('/createEvent')}
            iconName="calendar-outline"
            style={styles.noEventsContainer}
          />
        )}
        {filteredEventsData.map((event: ProcessedEvent) => (
          <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => router.push(`/(events)/details/${event.id}`)}>
            <View style={styles.eventImageContainer}>
              <Ionicons name={getEventIcon(event.eventType)} size={60} color="#ccc" />
            </View>
            <View style={styles.eventTypeTag}>
              <Text style={styles.eventTypeText}>{event.eventType}</Text>
            </View>

            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{event.name}</Text>

              <View style={styles.eventInfoRow}>
                <View style={styles.eventInfoItem}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.eventInfoText}>{new Date(event.date).toLocaleDateString()}</Text>
                </View>
                {event.time && (
                  <View style={styles.eventInfoItem}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.eventInfoText}>{event.time}</Text>
                  </View>
                )}
              </View>

              {event.location && (
                <View style={styles.eventInfoRow}>
                  <View style={styles.eventInfoItem}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.eventInfoText}>{event.location}</Text>
                  </View>
                </View>
              )}

              <View style={styles.eventInfoRow}>
                <View style={styles.eventInfoItem}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.eventInfoText}>{event.guestCount} Guests</Text>
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          event.derivedStatus === 'Upcoming' ? '#4CD964' :
                          event.derivedStatus === 'Planning' ? '#FF9500' :
                          event.derivedStatus === 'Past' ? '#8E8E93' : '#8E8E93'
                      }
                    ]}
                  />
                  <Text style={styles.statusText}>{event.derivedStatus}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${event.progress}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{event.progress}% Complete</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(events)/createEvent')}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Create New Event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EventsScreen;
