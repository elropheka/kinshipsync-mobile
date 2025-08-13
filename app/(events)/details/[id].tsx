import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../../styles/app/(events)/details/[id].styles';
import { useEventDetail } from '../../../hooks/useEvents';
import { UserProfile } from '../../../types/userTypes';
import { Colors } from '../../../constants/Colors';
import { useAppAuth } from '../../../hooks/useAppAuth'; 

// Import new sub-components
import EventDetailHeader from '../../../components/events/details/EventDetailHeader';
import EventDetailNavButtons from '../../../components/events/details/EventDetailNavButtons';
import EventDetailTasks from '../../../components/events/details/EventDetailTasks';
import EventDetailBudget from '../../../components/events/details/EventDetailBudget';
import EventDetailIdeas from '../../../components/events/details/EventDetailIdeas';
import EventDetailTeams from '../../../components/events/details/EventDetailTeams';
import EventDetailTheme from '../../../components/events/details/EventDetailTheme';
import EventDetailWebsite from '../../../components/events/details/EventDetailWebsite';
import { CreateTaskPayload, UpdateTaskPayload, CreateBudgetItemPayload, UpdateBudgetItemPayload, CreateIdeaPayload, UpdateIdeaPayload, CreateEventTeamPayload, UpdateEventTeamPayload, AddTeamMemberPayload, WebsitePayload } from '../../../types/eventTypes';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = id || ''; 
  const { user: currentUser } = useAppAuth();

  const { 
    event, 
    tasks, 
    guests, 
    budgetItems, 
    ideas, 
    eventTeams,
    addEventTask, 
    updateEventTask, 
    deleteEventTask,
    addBudgetItem, 
    updateBudgetItem,
    deleteBudgetItem,
    addIdea, 
    updateIdea,
    deleteIdea,
    voteForIdea,
    createEventTeam, 
    updateEventTeam,
    deleteEventTeam,
    addTeamMember,
    // updateTeamMember, // This was in useEventDetail but not used directly here after refactor
    removeTeamMember,
    currentTheme,
    availableThemes, 
    setEventTheme, 
    eventWebsite,
    updateEventWebsite,
    isLoading: isLoadingEventDetails, 
    error: eventError 
  } = useEventDetail(eventId);

  // This mapping remains as it's used by child components like EventDetailTeams
  const assignableUsers: UserProfile[] = guests.map(guest => ({
    userId: guest.id, 
    displayName: guest.name,
    email: guest.email || '',
    createdAt: guest.addedAt || new Date().toISOString(),
    updatedAt: guest.addedAt || new Date().toISOString(),
    avatarUrl: undefined, 
  }));

  // This logic remains as it's used by EventDetailHeader
  const getRsvpDeadlineInfo = () => {
    // Placeholder: Implement actual logic based on event.rsvpDeadline or other fields
    return { text: 'RSVP details not available', style: styles.deadlineTextDefault };
  };

  if (isLoadingEventDetails) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text>Loading event details...</Text>
      </View>
    );
  }
  if (eventError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading event: {eventError.message}</Text>
        {/* Inline back button removed, header provides back functionality */}
      </View>
    );
  }
  if (!event) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Event not found.</Text>
        {/* Inline back button removed, header provides back functionality */}
      </View>
    );
  }

  const deadlineInfo = getRsvpDeadlineInfo();

  // Wrapper functions to match expected signatures if sub-components don't directly use useEventDetail returns
  // For example, if a sub-component expects a simple onDelete that doesn't return a value or has a different alert logic
  // However, for this refactor, we'll pass the hook functions directly where possible.

  const handleAddTask = async (taskData: CreateTaskPayload) => {
    await addEventTask(taskData);
  };
  const handleUpdateTask = async (taskId: string, taskData: UpdateTaskPayload) => {
    await updateEventTask(taskId, taskData);
  };
  const handleDeleteTask = async (taskId: string) => {
    await deleteEventTask(taskId);
  };

  const handleAddBudgetItem = async (itemData: CreateBudgetItemPayload) => {
    await addBudgetItem(itemData);
  };
  const handleUpdateBudgetItem = async (itemId: string, itemData: UpdateBudgetItemPayload) => {
    await updateBudgetItem(itemId, itemData);
  };
  const handleDeleteBudgetItem = async (itemId: string) => {
    await deleteBudgetItem(itemId);
  };

  const handleAddIdea = async (ideaData: CreateIdeaPayload, currentUserId: string) => {
    await addIdea(ideaData, currentUserId);
  };
  const handleUpdateIdea = async (ideaId: string, ideaData: UpdateIdeaPayload) => {
    await updateIdea(ideaId, ideaData);
  };
  const handleDeleteIdea = async (ideaId: string) => {
    await deleteIdea(ideaId);
  };
  const handleVoteForIdea = async (ideaId: string, increment: number) => {
    await voteForIdea(ideaId, increment);
  };
  
  const handleCreateEventTeam = async (teamData: CreateEventTeamPayload) => {
    await createEventTeam(teamData);
  };
  const handleUpdateEventTeam = async (teamId: string, teamData: UpdateEventTeamPayload) => {
    await updateEventTeam(teamId, teamData);
  };
  const handleDeleteEventTeam = async (teamId: string) => {
    await deleteEventTeam(teamId);
  };
  const handleAddTeamMember = async (teamId: string, memberData: AddTeamMemberPayload) => {
    await addTeamMember(teamId, memberData);
  };
  const handleRemoveTeamMember = async (teamId: string, memberUserId: string) => {
    await removeTeamMember(teamId, memberUserId);
  };

  const handleSetEventTheme = async (themeId: string) => {
    await setEventTheme(themeId);
  };

  const handleUpdateEventWebsite = async (websiteData: WebsitePayload) => {
    await updateEventWebsite(websiteData);
  };


  return (
    <SafeAreaView style={styles.outerContainer} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: event.name || 'Event Details' }} />
      {/* Custom header View removed */}
      <ScrollView style={styles.container}>
        <EventDetailHeader event={event} deadlineInfo={deadlineInfo} />
        
        <EventDetailNavButtons eventId={event.id} />

        <EventDetailTasks 
          tasks={tasks}
          assignableUsers={assignableUsers}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />

        <EventDetailBudget
          budgetItems={budgetItems}
          onAddBudgetItem={handleAddBudgetItem}
          onUpdateBudgetItem={handleUpdateBudgetItem}
          onDeleteBudgetItem={handleDeleteBudgetItem}
        />

        <EventDetailIdeas
          ideas={ideas}
          currentUserId={currentUser?.uid}
          onAddIdea={handleAddIdea}
          onUpdateIdea={handleUpdateIdea}
          onDeleteIdea={handleDeleteIdea}
          onVoteForIdea={handleVoteForIdea}
        />

        <EventDetailTeams
          eventTeams={eventTeams}
          assignableUsers={assignableUsers}
          onCreateEventTeam={handleCreateEventTeam}
          onUpdateEventTeam={handleUpdateEventTeam}
          onDeleteEventTeam={handleDeleteEventTeam}
          onAddTeamMember={handleAddTeamMember}
          onRemoveTeamMember={handleRemoveTeamMember}
        />
        
        <EventDetailTheme
          currentTheme={currentTheme}
          availableThemes={availableThemes}
          onSetEventTheme={handleSetEventTheme}
        />

        <EventDetailWebsite
          eventWebsite={eventWebsite}
          onUpdateEventWebsite={handleUpdateEventWebsite}
        />

      </ScrollView>
      {/* Modals are now managed within their respective components */}
    </SafeAreaView>
  );
}
