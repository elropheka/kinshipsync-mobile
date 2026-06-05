import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
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

interface ProcessedEvent extends AppEvent {
  derivedStatus: EventClientStatus;
}

interface Summary {
  upcoming: number;
  planned: number;
  completed: number;
}

const EventsScreen: React.FC = () => {
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
    return fetchedEvents.map((event) => ({
      ...event,
      derivedStatus: getEventClientStatus(event.date),
    }));
  }, [fetchedEvents]);

  const filteredEventsData = useMemo(() => {
    let newFilteredEvents = processedEventsData;
    if (activeTab === 'Upcoming') {
      newFilteredEvents = newFilteredEvents.filter(
        (event) => event.derivedStatus === 'Upcoming' || event.derivedStatus === 'Planning',
      );
    } else if (activeTab === 'Completed') {
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
  }, [activeTab, searchQuery, processedEventsData]);

  const summaryData: Summary = useMemo(() => {
    const upcoming = processedEventsData.filter((e) => e.derivedStatus === 'Upcoming').length;
    const planned = processedEventsData.filter((e) => e.derivedStatus === 'Planning').length;
    const completed = processedEventsData.filter((e) => e.derivedStatus === 'Past').length;
    return {
      upcoming: upcoming + planned,
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
        <BrandSummaryCard value={summaryData.upcoming} label="Upcoming" variant="green" />
        <BrandSummaryCard value={summaryData.planned} label="Planned" variant="golden" />
        <BrandSummaryCard value={summaryData.completed} label="Completed" variant="sand" />
      </View>

      <View style={styles.tabContainer}>
        {['Upcoming', 'All Events', 'Completed'].map((tab: string) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <BrandText variant="body" style={activeTab === tab ? styles.activeTabText : styles.tabText}>
              {tab}
            </BrandText>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        {!isLoading && filteredEventsData.length === 0 ? (
          <BrandEmptyState
            title={`No ${activeTab.toLowerCase()} events`}
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

      <View style={styles.createButtonContainer}>
        <BrandButton
          label="Create New Event"
          variant="primary"
          onPress={() => router.push('/(events)/createEvent')}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

export default EventsScreen;
