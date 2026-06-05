import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Event as EventType } from '../../types/eventTypes';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import Fonts from '@/constants/fonts';
import { BrandText } from '@/components/ui/BrandText';

interface UpcomingEventItemProps {
  event: EventType;
  index: number;
  variant: 'sand' | 'rust';
}

const UpcomingEventItem: React.FC<UpcomingEventItemProps> = ({ event, index, variant }) => {
  const { currentColors } = useAppTheme();
  const styles = createItemStyles(currentColors, variant);
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/(events)/details/[id]',
          params: { id: event.id },
        })
      }
    >
      <View style={styles.dateBlock}>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {event.name}
      </Text>
      {event.time ? (
        <View style={styles.metaRow}>
          <Icon name="schedule" size={14} color={styles.metaColor.color} />
          <Text style={styles.meta}>{event.time}</Text>
        </View>
      ) : null}
      {event.location ? (
        <View style={styles.metaRow}>
          <Icon name="location-on" size={14} color={styles.metaColor.color} />
          <Text style={styles.meta} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
      ) : null}
      <Text style={styles.indexLabel}>#{index + 1}</Text>
    </TouchableOpacity>
  );
};

interface UpcomingEventsProps {
  events: EventType[];
  searchQuery?: string;
  onSeeAllPress: () => void;
  horizontal?: boolean;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events: allEvents,
  searchQuery,
  onSeeAllPress,
  horizontal = false,
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
          <UpcomingEventItem
            key={event.id}
            event={event}
            index={index}
            variant={index % 2 === 0 ? 'sand' : 'rust'}
          />
        ))}
      </ScrollView>
    ) : (
      upcomingEvents.slice(0, 3).map((event, index) => (
        <UpcomingEventItem
          key={event.id}
          event={event}
          index={index}
          variant={index % 2 === 0 ? 'sand' : 'rust'}
        />
      ))
    )
  ) : (
    <BrandText variant="body" color="secondary">
      No upcoming events found.
    </BrandText>
  );

  return (
    <View style={{ marginBottom: Spacing.l }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.s }}>
        <BrandText variant="h4">Upcoming Events</BrandText>
        {upcomingEvents.length > 0 ? (
          <TouchableOpacity onPress={onSeeAllPress}>
            <BrandText variant="body" color="secondary">
              See all
            </BrandText>
          </TouchableOpacity>
        ) : null}
      </View>
      {content}
    </View>
  );
};

const createItemStyles = (theme: typeof Colors.light, variant: 'sand' | 'rust') => {
  const isSand = variant === 'sand';
  return StyleSheet.create({
    card: {
      width: 200,
      borderRadius: BorderRadius.xl,
      padding: Spacing.m,
      backgroundColor: isSand ? theme.backgroundSecondary : theme.secondary,
      marginBottom: Spacing.s,
    },
    dateBlock: {
      alignSelf: 'flex-start',
      backgroundColor: isSand ? theme.backgroundPaper : 'rgba(255,255,255,0.15)',
      borderRadius: BorderRadius.m,
      paddingHorizontal: Spacing.s,
      paddingVertical: Spacing.xs,
      marginBottom: Spacing.s,
    },
    month: {
      fontFamily: Fonts.captionMedium,
      fontSize: 11,
      color: isSand ? theme.textSecondary : theme.textLight,
    },
    day: {
      fontFamily: Fonts.headerBold,
      fontSize: 20,
      color: isSand ? theme.text : theme.textLight,
    },
    title: {
      fontFamily: Fonts.titleSemiBold,
      fontSize: 16,
      color: isSand ? theme.text : theme.textLight,
      marginBottom: Spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    meta: {
      fontFamily: Fonts.bodyRegular,
      fontSize: 12,
      color: isSand ? theme.textSecondary : theme.textLight,
      flex: 1,
    },
    metaColor: {
      color: isSand ? theme.textSecondary : theme.textLight,
    },
    indexLabel: {
      position: 'absolute',
      top: Spacing.s,
      right: Spacing.s,
      fontFamily: Fonts.captionMedium,
      fontSize: 10,
      color: isSand ? theme.textSecondary : theme.textLight,
      opacity: 0.7,
    },
  });
};

export default UpcomingEvents;
