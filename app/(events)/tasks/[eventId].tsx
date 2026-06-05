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
import EventDetailTasks from '@/components/events/details/EventDetailTasks';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { EventNavigation } from '@/utils/eventNavigation';

const EventTasksScreen: React.FC = () => {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = EventNavigation.resolveEventId(params.eventId);
  const { currentColors } = useAppTheme();
  const detailStyles = createEventDetailsStyles(currentColors);
  const { user: currentUser } = useAppAuth();

  const {
    event,
    tasks,
    guests,
    eventTeams,
    addEventTask,
    updateEventTask,
    deleteEventTask,
    isLoading,
    error,
  } = useEventDetail(eventId);
  const { taskAssignableUsers } = useEventAssignableUsers(guests, eventTeams);

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
          title: 'Tasks',
          ...HeaderButtonItems.headerLeftBackOptions(
            currentColors.accentContrastText,
            'onAccent',
            `/(events)/details/${eventId}`,
          ),
        }}
      />
      <EventDetailTasks
        tasks={tasks}
        assignableUsers={taskAssignableUsers}
        onAddTask={async (taskData) => {
          await addEventTask(taskData);
        }}
        onUpdateTask={async (taskId, taskData) => {
          await updateEventTask(taskId, taskData);
        }}
        onDeleteTask={async (taskId) => {
          await deleteEventTask(taskId);
        }}
        isOrganizer={isOrganizer}
      />
    </SafeAreaView>
  );
};

export default EventTasksScreen;
