import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Event as EventType } from '../../types/eventTypes';
import { Spacing } from '@/constants/dimensions';
import { BrandText } from '@/components/ui/BrandText';
import { BrandSectionHeader } from '@/components/ui/BrandSectionHeader';
import { EventListCard } from '@/components/events/EventListCard';

interface UpcomingEventsProps {
  events: EventType[];
  searchQuery?: string;
  onSeeAllPress: () => void;
  horizontal?: boolean;
  preview?: boolean;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events: allEvents,
  searchQuery,
  onSeeAllPress,
  horizontal = false,
  preview = false,
}) => {
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = allEvents.filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });

    if (searchQuery && searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(lowercasedQuery) ||
          (event.location && event.location.toLowerCase().includes(lowercasedQuery)) ||
          (event.description && event.description.toLowerCase().includes(lowercasedQuery))
      );
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents, searchQuery]);

  const content = upcomingEvents.length > 0 ? (
    horizontal ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.s }}>
        {upcomingEvents.slice(0, 6).map((event, index) => (
          <EventListCard key={event.id} event={event} index={index} preview={preview} />
        ))}
      </ScrollView>
    ) : (
      upcomingEvents.slice(0, 3).map((event, index) => (
        <EventListCard key={event.id} event={event} index={index} preview={preview} fullWidth />
      ))
    )
  ) : (
    <BrandText variant="body" color="secondary">
      No upcoming events found.
    </BrandText>
  );

  return (
    <View style={{ marginBottom: Spacing.l }}>
      <BrandSectionHeader
        title="Upcoming Events"
        actionLabel={upcomingEvents.length > 0 && !preview ? 'See all' : undefined}
        onActionPress={preview ? undefined : onSeeAllPress}
      />
      {content}
    </View>
  );
};

export default UpcomingEvents;
