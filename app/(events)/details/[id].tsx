import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/app/(events)/details/[id].styles';
import { useEventDetail } from '@/hooks/useEvents';
import { UserProfile } from '@/types/userTypes';
import { Colors } from '@/constants/Colors';
import { useAppAuth } from '@/hooks/useAppAuth';
import { getUserProfileById } from '@/services/userService'; 


import EventDetailHeader from '@/components/events/details/EventDetailHeader';
import EventDetailNavButtons from '@/components/events/details/EventDetailNavButtons';
import EventDetailTasks from '@/components/events/details/EventDetailTasks';
import EventDetailBudget from '@/components/events/details/EventDetailBudget';
import EventDetailIdeas from '@/components/events/details/EventDetailIdeas';
import EventDetailTeams from '@/components/events/details/EventDetailTeams';
import EventDetailTheme from '@/components/events/details/EventDetailTheme';
import EventDetailWebsite from '@/components/events/details/EventDetailWebsite';
import { CreateTaskPayload, UpdateTaskPayload, CreateBudgetItemPayload, UpdateBudgetItemPayload, CreateIdeaPayload, UpdateIdeaPayload, CreateEventTeamPayload, UpdateEventTeamPayload, AddTeamMemberPayload, WebsitePayload } from '@/types/eventTypes';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = id || ''; 
  const { user: currentUser } = useAppAuth();
  const router = useRouter();
  const [teamMemberProfiles, setTeamMemberProfiles] = useState<UserProfile[]>([]);
  const lastRefetchRef = useRef<number>(0);

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
    removeTeamMember,
    currentTheme,
    availableThemes, 
    setEventTheme, 
    eventWebsite,
    updateEventWebsite,
    isLoading: isLoadingEventDetails, 
    error: eventError,
    fetchEventDetails
  } = useEventDetail(eventId);

  // Refetch event details when screen comes into focus (e.g., returning from edit screen)
  useFocusEffect(
    React.useCallback(() => {
      const now = Date.now();
      const timeSinceLastRefetch = now - lastRefetchRef.current;
      
      // Only refetch if it's been more than 2 seconds since last refetch
      if (fetchEventDetails && eventId && timeSinceLastRefetch > 2000) {
        console.log('Event details screen focused, refetching event data...');
        lastRefetchRef.current = now;
        fetchEventDetails();
      }
    }, [fetchEventDetails, eventId])
  );

  // Fetch team member profiles when eventTeams change
  useEffect(() => {
    const fetchTeamMemberProfiles = async () => {
      if (!eventTeams || eventTeams.length === 0) {
        setTeamMemberProfiles([]);
        return;
      }

      try {
        // Get all unique user IDs from all teams
        const allUserIds = new Set<string>();
        eventTeams.forEach(team => {
          team.members.forEach(member => {
            allUserIds.add(member.userId);
          });
        });

        // Fetch profiles for all team members
        const profilePromises = Array.from(allUserIds).map(userId => 
          getUserProfileById(userId)
        );
        
        const profiles = await Promise.all(profilePromises);
        const validProfiles = profiles.filter((profile): profile is UserProfile => profile !== null);
        
        setTeamMemberProfiles(validProfiles);
      } catch (error) {
        console.error('Error fetching team member profiles:', error);
        setTeamMemberProfiles([]);
      }
    };

    fetchTeamMemberProfiles();
  }, [eventTeams]);


  const assignableUsers: UserProfile[] = guests.map(guest => ({
    userId: guest.id, 
    displayName: guest.name,
    email: guest.email || '',
    createdAt: guest.addedAt || new Date().toISOString(),
    updatedAt: guest.addedAt || new Date().toISOString(),
    avatarUrl: undefined, 
  }));

  // Create a comprehensive user list that includes both guests and team members
  const allAssignableUsers: UserProfile[] = [
    ...assignableUsers,
    ...teamMemberProfiles
  ];

  // Remove duplicates based on userId
  const uniqueAssignableUsers = allAssignableUsers.filter((user, index, self) => 
    index === self.findIndex(u => u.userId === user.userId)
  );

  const taskAssignableUsers: UserProfile[] = eventTeams.flatMap(team => 
    team.members.map((member: { userId: string }) => {
      const memberProfile = uniqueAssignableUsers.find(user => user.userId === member.userId);
      return memberProfile;
    }).filter((profile): profile is UserProfile => profile !== undefined)
  );

 
  const getRsvpDeadlineInfo = () => {
    if (!event) {
      return { text: 'RSVP details not available', style: styles.deadlineTextDefault };
    }

    const eventDate = new Date(event.date);
    const now = new Date();
    const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate RSVP statistics
    const totalGuests = guests.length;
    const respondedGuests = guests.filter(guest => 
      guest.status === 'accepted' || guest.status === 'declined'
    ).length;
    const pendingGuests = guests.filter(guest => 
      guest.status === 'pending' || guest.status === 'Invited'
    ).length;
    
    // Determine appropriate message and style based on event timing and RSVP status
    if (daysUntilEvent < 0) {
      // Event has passed
      return {
        text: `Event has passed (${Math.abs(daysUntilEvent)} days ago)`,
        style: styles.deadlineTextPassed
      };
    } else if (daysUntilEvent === 0) {
      // Event is today
      if (pendingGuests > 0) {
        return {
          text: `Event is today! ${pendingGuests} guests still pending RSVP`,
          style: styles.deadlineTextUrgent
        };
      } else {
        return {
          text: `Event is today! All ${totalGuests} guests have responded`,
          style: styles.deadlineTextDefault
        };
      }
    } else if (daysUntilEvent <= 3) {
      // Event is very soon
      if (pendingGuests > 0) {
        return {
          text: `Event in ${daysUntilEvent} day${daysUntilEvent === 1 ? '' : 's'}! ${pendingGuests} guests pending`,
          style: styles.deadlineTextUrgent
        };
      } else {
        return {
          text: `Event in ${daysUntilEvent} day${daysUntilEvent === 1 ? '' : 's'}! All ${totalGuests} guests responded`,
          style: styles.deadlineTextDefault
        };
      }
    } else if (daysUntilEvent <= 7) {
      // Event is within a week
      if (pendingGuests > 0) {
        return {
          text: `Event in ${daysUntilEvent} days. ${respondedGuests}/${totalGuests} guests responded`,
          style: styles.deadlineTextDefault
        };
      } else {
        return {
          text: `Event in ${daysUntilEvent} days. All ${totalGuests} guests responded`,
          style: styles.deadlineTextDefault
        };
      }
    } else {
      // Event is more than a week away
      if (totalGuests === 0) {
        return {
          text: `Event in ${daysUntilEvent} days. No guests invited yet`,
          style: styles.deadlineTextDefault
        };
      } else {
        return {
          text: `Event in ${daysUntilEvent} days. ${respondedGuests}/${totalGuests} guests responded`,
          style: styles.deadlineTextDefault
        };
      }
    }
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

  const deadlineInfo = getRsvpDeadlineInfo();

 

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

  const handleEditEvent = () => {
    if (event) {
      router.push({
        pathname: '/(events)/editEvent',
        params: { eventId: event.id }
      });
    }
  };


  return (
    <SafeAreaView style={styles.outerContainer} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: event.name || 'Event Details' }} />
     
      <ScrollView style={styles.container}>
        <EventDetailHeader 
          event={event} 
          deadlineInfo={deadlineInfo} 
          currentUserId={currentUser?.uid}
          onEditEvent={handleEditEvent}
        />
        
        <EventDetailNavButtons eventId={event.id} />

        <EventDetailTasks 
          tasks={tasks}
          assignableUsers={taskAssignableUsers}
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
          assignableUsers={uniqueAssignableUsers}
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
     
    </SafeAreaView>
  );
}
