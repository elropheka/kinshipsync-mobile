import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Event as EventType } from '@/types/eventTypes';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import Fonts from '@/constants/fonts';
import { EventCoverImage } from '@/components/events/EventCoverImage';

export type EventListCardVariant = 'sand' | 'rust';

interface EventListCardProps {
  event: EventType;
  index: number;
  variant?: EventListCardVariant;
  preview?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}

export class EventListCard extends React.Component<EventListCardProps> {
  public render(): React.ReactNode {
    return <EventListCardInner {...this.props} />;
  }
}

const EventListCardInner: React.FC<EventListCardProps> = ({
  event,
  index,
  variant,
  preview = false,
  fullWidth = false,
  style,
  onPress,
}) => {
  const { currentColors } = useAppTheme();
  const resolvedVariant: EventListCardVariant = variant ?? (index % 2 === 0 ? 'sand' : 'rust');
  const styles = createItemStyles(currentColors, resolvedVariant, fullWidth);
  const eventDate = new Date(event.date);

  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();

  const handlePress = (): void => {
    if (preview) {
      return;
    }
    if (onPress) {
      onPress();
      return;
    }
    router.push({
      pathname: '/(events)/details/[id]',
      params: { id: event.id },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={handlePress}
      disabled={preview}
      activeOpacity={preview ? 1 : 0.7}
    >
      <EventCoverImage event={event} contained style={styles.coverImage} />
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

const createItemStyles = (
  theme: typeof Colors.light,
  variant: EventListCardVariant,
  fullWidth: boolean,
) => {
  const isSand = variant === 'sand';
  return StyleSheet.create({
    card: {
      width: fullWidth ? '100%' : 200,
      borderRadius: BorderRadius.xl,
      padding: Spacing.m,
      backgroundColor: isSand ? theme.backgroundSecondary : theme.secondary,
      marginBottom: Spacing.s,
      overflow: 'hidden',
    },
    coverImage: {
      borderRadius: BorderRadius.m,
      marginBottom: Spacing.s,
      backgroundColor: isSand ? theme.backgroundPaper : 'rgba(255,255,255,0.15)',
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

export default EventListCard;
