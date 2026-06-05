import React from 'react';
import { View, Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useEventDetail } from '@/hooks/useEvents';
import { useEventAssignableUsers } from '@/hooks/useEventAssignableUsers';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import EventDetailTeams from '@/components/events/details/EventDetailTeams';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { EventNavigation } from '@/utils/eventNavigation';

const EventTeamsScreen: React.FC = () => {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = EventNavigation.resolveEventId(params.eventId);
  const { currentColors } = useAppTheme();
  const detailStyles = createEventDetailsStyles(currentColors);
  const { user: currentUser } = useAppAuth();

  const {
    event,
    guests,
    eventTeams,
    createEventTeam,
    updateEventTeam,
    deleteEventTeam,
    addTeamMember,
    removeTeamMember,
    isLoading,
    error,
  } = useEventDetail(eventId);
  const { uniqueAssignableUsers } = useEventAssignableUsers(guests, eventTeams);

  if (!eventId) {
    return (
      <View style={[detailStyles.container, detailStyles.centerContent]}>
        <Text style={detailStyles.errorText}>Event ID is missing.</Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !event) {
    return (
      <View style={[detailStyles.container, detailStyles.centerContent]}>
        <Text style={detailStyles.errorText}>{error?.message || 'Event not found.'}</Text>
      </View>
    );
  }

  const isOrganizer = currentUser?.uid === event.organizerId;

  return (
    <SafeAreaView style={detailStyles.outerContainer} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: 'Event Teams',
          ...HeaderButtonItems.headerLeftBackOptions(
            currentColors.accentContrastText,
            'onAccent',
            `/(events)/details/${eventId}`,
          ),
        }}
      />
      <EventDetailTeams
        eventTeams={eventTeams}
        assignableUsers={uniqueAssignableUsers}
        onCreateEventTeam={async (teamData) => {
          await createEventTeam(teamData);
        }}
        onUpdateEventTeam={async (teamId, teamData) => {
          await updateEventTeam(teamId, teamData);
        }}
        onDeleteEventTeam={deleteEventTeam}
        onAddTeamMember={addTeamMember}
        onRemoveTeamMember={removeTeamMember}
        isOrganizer={isOrganizer}
      />
    </SafeAreaView>
  );
};

export default EventTeamsScreen;
