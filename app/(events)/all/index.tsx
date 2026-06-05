import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createIndexStyles } from '../../../styles/app/(events)/all/index.styles';
import { useAllEvents } from '../../../hooks/useEvents';
import { useAppTheme } from '../../../context/AppThemeContext';
import { Event as AppEvent } from '../../../types/eventTypes';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { BrandEmptyState } from '@/components/ui/BrandEmptyState';
import { BrandText } from '@/components/ui/BrandText';
import { BrandButton } from '@/components/ui/BrandButton';
import { BrandSearchBar } from '@/components/ui/BrandSearchBar';
import { BrandSummaryCard } from '@/components/ui/BrandSummaryCard';
import { EventListCard } from '@/components/events/EventListCard';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';

type EventClientStatus = 'Upcoming' | 'Past' | 'Planning';
type EventFilter = 'all' | 'upcoming' | 'planned' | 'completed';

interface ProcessedEvent extends AppEvent {
  derivedStatus: EventClientStatus;
}

interface Summary {
  all: number;
  upcoming: number;
  planned: number;
  completed: number;
}

const FILTER_LABELS: Record<EventFilter, string> = {
  all: 'events',
  upcoming: 'upcoming events',
  planned: 'planned events',
  completed: 'completed events',
};

const EventsScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createIndexStyles(currentColors);

  const { events: fetchedEvents, isLoading, error, fetchEvents: refreshEvents } = useAllEvents();
  const [activeFilter, setActiveFilter] = useState<EventFilter>('all');
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
    return fetchedEvents.map((event) => ({
      ...event,
      derivedStatus: getEventClientStatus(event.date),
    }));
  }, [fetchedEvents]);

  const filteredEventsData = useMemo(() => {
    let newFilteredEvents = processedEventsData;
    if (activeFilter === 'upcoming') {
      newFilteredEvents = newFilteredEvents.filter((event) => event.derivedStatus === 'Upcoming');
    } else if (activeFilter === 'planned') {
      newFilteredEvents = newFilteredEvents.filter((event) => event.derivedStatus === 'Planning');
    } else if (activeFilter === 'completed') {
      newFilteredEvents = newFilteredEvents.filter((event) => event.derivedStatus === 'Past');
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      newFilteredEvents = newFilteredEvents.filter(
        (event) =>
          event.name.toLowerCase().includes(lowercasedQuery) ||
          (event.location && event.location.toLowerCase().includes(lowercasedQuery)),
      );
    }
    return newFilteredEvents;
  }, [activeFilter, searchQuery, processedEventsData]);

  const summaryData: Summary = useMemo(() => {
    const upcoming = processedEventsData.filter((e) => e.derivedStatus === 'Upcoming').length;
    const planned = processedEventsData.filter((e) => e.derivedStatus === 'Planning').length;
    const completed = processedEventsData.filter((e) => e.derivedStatus === 'Past').length;
    return {
      all: processedEventsData.length,
      upcoming,
      planned,
      completed,
    };
  }, [processedEventsData]);

  if (isLoading && !fetchedEvents?.length && !error) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.errorContainer}>
          <BrandText color="accent">Failed to load events: {error.message}</BrandText>
          <BrandButton label="Try Again" variant="primary" onPress={() => refreshEvents?.()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: 'My Events',
          ...HeaderButtonItems.headerRightIconOptions({
            label: 'Search',
            sfSymbol: 'magnifyingglass',
            ionicon: 'search',
            onPress: () => setShowSearchInput(!showSearchInput),
            tintColor: currentColors.accentContrastText,
          }),
        }}
      />

      {showSearchInput ? (
        <BrandSearchBar
          placeholder="Search events by title or location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          containerStyle={styles.searchBar}
        />
      ) : null}

      <View style={styles.summaryContainer}>
        <BrandSummaryCard
          value={summaryData.all}
          label="All"
          variant="sand"
          selected={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
        <BrandSummaryCard
          value={summaryData.upcoming}
          label="Upcoming"
          variant="green"
          selected={activeFilter === 'upcoming'}
          onPress={() => setActiveFilter('upcoming')}
        />
        <BrandSummaryCard
          value={summaryData.planned}
          label="Planned"
          variant="golden"
          selected={activeFilter === 'planned'}
          onPress={() => setActiveFilter('planned')}
        />
        <BrandSummaryCard
          value={summaryData.completed}
          label="Completed"
          variant="sand"
          selected={activeFilter === 'completed'}
          onPress={() => setActiveFilter('completed')}
        />
      </View>

      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        {!isLoading && filteredEventsData.length === 0 ? (
          <BrandEmptyState
            title={`No ${FILTER_LABELS[activeFilter]}`}
            message={searchQuery ? 'Try adjusting your search.' : 'Create an event to start planning with your family.'}
            actionLabel="Create Event"
            onActionPress={() => router.push('/createEvent')}
            iconName="calendar-outline"
            style={styles.noEventsContainer}
          />
        ) : null}
        {filteredEventsData.map((event, index) => (
          <EventListCard key={event.id} event={event} index={index} fullWidth />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(events)/createEvent')}
        accessibilityRole="button"
        accessibilityLabel="Create new event"
      >
        <Ionicons name="add-sharp" size={30} color={currentColors.primaryContrastText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EventsScreen;
