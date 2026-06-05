import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createTasksStyles } from '@/styles/app/(events)/tasks.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useEventDetail } from '@/hooks/useEvents';
import { useEventAssignableUsers } from '@/hooks/useEventAssignableUsers';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import EventDetailTasks from '@/components/events/details/EventDetailTasks';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { EventNavigation } from '@/utils/eventNavigation';

interface TaskCategory {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const TasksTimelinePage: React.FC = () => {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = EventNavigation.resolveEventId(params.eventId);
  const { currentColors } = useAppTheme();
  const styles = createTasksStyles(currentColors);
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

  if (eventId) {
    const isOrganizer = currentUser?.uid === event?.organizerId;

    if (isLoading) return <LoadingScreen />;
    if (error || !event) {
      return (
        <View style={[detailStyles.container, detailStyles.centerContent]}>
          <Text style={detailStyles.errorText}>{error?.message || 'Event not found.'}</Text>
        </View>
      );
    }

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
        <ScrollView style={detailStyles.container}>
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
        </ScrollView>
      </SafeAreaView>
    );
  }

  const taskCategories: TaskCategory[] = [
    {
      id: '1',
      title: 'To-Do Lists',
      description: 'Assign tasks to different people',
      iconName: 'checkmark-circle-outline',
    },
    {
      id: '2',
      title: 'Sign-Up Sheet',
      description: 'Sign up to bring different food items',
      iconName: 'list-outline',
    },
    {
      id: '3',
      title: 'Reminders & Deadlines',
      description: 'Set deadlines and reminders to keep everything on track',
      iconName: 'notifications-outline',
    },
    {
      id: '4',
      title: 'Timeline',
      description: 'Generate a schedule to ensure tasks are completed on time',
      iconName: 'checkmark-circle-outline',
    },
  ];

  const renderTaskCategoryItem = ({ item }: { item: TaskCategory }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.iconName} size={24} color={currentColors.text} />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Tasks' }} />
      <View style={styles.divider} />
      <FlatList
        data={taskCategories}
        renderItem={renderTaskCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarIndicator} />
      </View>
    </SafeAreaView>
  );
};

export default TasksTimelinePage;
