import React, { useRef, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useEventDetail } from '@/hooks/useEvents';
import { useAppAuth } from '@/hooks/useAppAuth';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import EventDetailHeader from '@/components/events/details/EventDetailHeader';
import { EventDetailTileGrid } from '@/components/events/details/EventDetailTileGrid';
import { LoadingScreen } from '@/components/common/LoadingScreen';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = id || '';
  const { user: currentUser } = useAppAuth();
  const router = useRouter();
  const { currentColors } = useAppTheme();
  const styles = createEventDetailsStyles(currentColors);
  const lastRefetchRef = useRef<number>(0);

  const {
    event,
    guests,
    isLoading: isLoadingEventDetails,
    error: eventError,
    fetchEventDetails,
  } = useEventDetail(eventId);

  const isOrganizer = currentUser?.uid === event?.organizerId;

  const hasAccessToEvent = useMemo(() => {
    if (!currentUser?.uid) return false;
    if (!event) return false;
    if (event.organizerId === currentUser.uid) return true;
    if (event.visibility === 'public') return true;
    if (event.allowedUserIds && event.allowedUserIds.includes(currentUser.uid)) return true;
    const userEmail = currentUser.email;
    if (userEmail && guests.some((guest) => guest.email === userEmail)) return true;
    return false;
  }, [event, currentUser?.uid, currentUser?.email, guests]);

  useFocusEffect(
    React.useCallback(() => {
      const now = Date.now();
      const timeSinceLastRefetch = now - lastRefetchRef.current;
      if (fetchEventDetails && eventId && timeSinceLastRefetch > 2000) {
        lastRefetchRef.current = now;
        fetchEventDetails();
      }
    }, [fetchEventDetails, eventId]),
  );

  const getRsvpDeadlineInfo = () => {
    if (!event) {
      return { text: 'RSVP details not available', style: styles.deadlineTextDefault };
    }
    if (isLoadingEventDetails) {
      return { text: 'Loading RSVP details...', style: styles.deadlineTextDefault };
    }

    const eventDate = new Date(event.date);
    const now = new Date();
    const daysUntilEvent = Math.ceil(
      (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    const totalGuests = guests.length;
    const respondedGuests = guests.filter(
      (guest) =>
        guest.status === 'accepted' ||
        guest.status === 'Attending' ||
        guest.status === 'declined' ||
        guest.status === 'Declined',
    ).length;
    const pendingGuests = guests.filter(
      (guest) =>
        guest.status === 'pending' ||
        guest.status === 'Invited' ||
        guest.status === 'Maybe' ||
        !guest.status,
    ).length;

    if (daysUntilEvent < 0) {
      return {
        text: `Event has passed (${Math.abs(daysUntilEvent)} days ago)`,
        style: styles.deadlineTextPassed,
      };
    }
    if (daysUntilEvent === 0) {
      if (pendingGuests > 0) {
        return {
          text: `Event is today! ${pendingGuests} guests still pending RSVP`,
          style: styles.deadlineTextUrgent,
        };
      }
      return {
        text: `Event is today! All ${totalGuests} guests have responded`,
        style: styles.deadlineTextDefault,
      };
    }
    if (daysUntilEvent <= 3) {
      if (pendingGuests > 0) {
        return {
          text: `Event in ${daysUntilEvent} day${daysUntilEvent === 1 ? '' : 's'}! ${pendingGuests} guests pending`,
          style: styles.deadlineTextUrgent,
        };
      }
      return {
        text: `Event in ${daysUntilEvent} day${daysUntilEvent === 1 ? '' : 's'}! All ${totalGuests} guests responded`,
        style: styles.deadlineTextDefault,
      };
    }
    if (daysUntilEvent <= 7) {
      return {
        text: `Event in ${daysUntilEvent} days. ${respondedGuests}/${totalGuests} guests responded`,
        style: styles.deadlineTextDefault,
      };
    }
    if (totalGuests === 0) {
      return {
        text: `Event in ${daysUntilEvent} days. No guests invited yet`,
        style: styles.deadlineTextDefault,
      };
    }
    return {
      text: `Event in ${daysUntilEvent} days. ${respondedGuests}/${totalGuests} guests responded`,
      style: styles.deadlineTextDefault,
    };
  };

  if (isLoadingEventDetails) {
    return <LoadingScreen />;
  }
  if (eventError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading event: {eventError.message}</Text>
      </View>
    );
  }
  if (!event) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    );
  }
  if (!hasAccessToEvent) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Access Denied</Text>
        <Text style={styles.errorText}>You don&apos;t have permission to view this event.</Text>
        <Text style={styles.errorText}>Please contact the event organizer for access.</Text>
      </View>
    );
  }

  const deadlineInfo = getRsvpDeadlineInfo();

  const handleEditEvent = () => {
    router.push({
      pathname: '/(events)/editEvent',
      params: { eventId: event.id },
    });
  };

  return (
    <SafeAreaView style={styles.outerContainer} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: event.name || 'Event Details',
          ...HeaderButtonItems.headerLeftBackOptions(
            currentColors.accentContrastText,
            'onAccent',
            '/(events)/all',
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <EventDetailHeader
          event={event}
          deadlineInfo={deadlineInfo}
          currentUserId={currentUser?.uid}
          onEditEvent={handleEditEvent}
          isOrganizer={isOrganizer}
        />

        <EventDetailTileGrid eventId={event.id} />
      </ScrollView>
    </SafeAreaView>
  );
}
