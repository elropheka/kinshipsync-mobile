import axiosInstance from './axiosInstance';
import { getEventWebsiteUrl } from '../utils/eventWebsiteUtils';
import { getUserProfileById } from './userService';
import { createBudgetItemAddedNotification, createBudgetMilestoneNotification, createRsvpReceivedNotification, createGuestMilestoneNotification, createDietaryPreferenceNotification, createScheduleAddedNotification, createIdeaSubmittedNotification, createIdeaPopularNotification, createWebsitePublishedNotification } from '../services/notificationService';
import {
  Event, CreateEventPayload, UpdateEventPayload,
  Guest, CreateGuestPayload, UpdateGuestPayload,
  BudgetItem, CreateBudgetItemPayload, UpdateBudgetItemPayload,
  Idea, CreateIdeaPayload, UpdateIdeaPayload,
  ScheduleItem, CreateScheduleItemPayload, UpdateScheduleItemPayload,
  Task, CreateTaskPayload, UpdateTaskPayload,
  Theme, 
  WebsitePayload, UpdateEventWebsiteDetailsPayload,
  UpdateRSVPPayload,
  SeatingChart, UpdateSeatingChartPayload, 
  EventMessage, CreateEventMessagePayload,
  EventTeam, CreateEventTeamPayload, UpdateEventTeamPayload, AddTeamMemberPayload, UpdateTeamMemberPayload, TeamMember,
} from '../types/eventTypes';

const generateKeywords = (name: string, description?: string, location?: string): string[] => {
  const text = `${name} ${description || ''} ${location || ''}`.toLowerCase();
  const words = text.split(/\s+/).filter(word => word.length > 2);
  const substrings = new Set<string>();
  words.forEach(word => {
    for (let i = 3; i <= word.length; i++) {
      substrings.add(word.substring(0, i));
    }
  });
  return Array.from(new Set([...words, ...substrings]));
};

export const getEventsPaginated = async (
  isAuthenticated: boolean,
  limitNum: number = 10,
  lastFetchedEvent?: Event
): Promise<Event[]> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log('Service: Fetching paginated events from backend...');
  try {
    const queryParams = new URLSearchParams({
      limit: limitNum.toString(),
      ...(lastFetchedEvent?.createdAt && { cursor: lastFetchedEvent.createdAt }),
    });
    const response = await axiosInstance.get(`/events?${queryParams.toString()}`);
    if (response.data.success && response.data.data) {
      return (response.data.data.events || []).map((data: any) => ({
        id: data.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      })) as Event[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching paginated events:", error);
    throw error;
  }
};

export const getEventById = async (isAuthenticated: boolean, eventId: string): Promise<Event | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching event with id ${eventId} from backend...`);
  try {
    const response = await axiosInstance.get(`/events/${eventId}`);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || eventId,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Event;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

export const createEvent = async (isAuthenticated: boolean, payload: CreateEventPayload, organizerId: string): Promise<Event> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log('Service: Creating event with payload:', payload);
  try {
    const response = await axiosInstance.post('/events', {
      ...payload,
      organizerId,
    });
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Event;
    }
    throw new Error("Failed to create event.");
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (isAuthenticated: boolean, eventId: string, payload: UpdateEventPayload, currentUserId?: string): Promise<Event | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Updating event ${eventId} with payload:`, payload);
  if (!eventId) throw new Error("Event ID is required for update.");
  try {
    const response = await axiosInstance.put(`/events/${eventId}`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || eventId,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Event;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    if (error.response?.status === 403) {
      throw new Error("Only the event organizer can update this event.");
    }
    console.error(`Error updating event ${eventId}:`, error);
    throw error;
  }
};

export const deleteEvent = async (isAuthenticated: boolean, eventId: string): Promise<boolean> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Deleting event ${eventId}...`);
  if (!eventId) throw new Error("Event ID is required for deletion.");
  try {
    await axiosInstance.delete(`/events/${eventId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw error;
  }
};

export const updateEventOverallBudget = async (isAuthenticated: boolean, eventId: string, budgetAmount: number): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  console.log(`Service: Updating overall budget for event ${eventId} to ${budgetAmount}`);
  try {
    await axiosInstance.patch(`/events/${eventId}/budget`, {
      overallBudget: budgetAmount,
    });
  } catch (error) {
    console.error("Error updating event overall budget:", error);
    throw error;
  }
};

export const listenToGuestsWithRsvp = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (guests: Guest[]) => void
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to guests.");
    return () => { console.warn("Attempted to listen to guests while unauthenticated."); };
  }
  if (!eventId) {
    console.error("listenToGuestsWithRsvp: Event ID is required.");
    return () => {};
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollGuests = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/guests`);
      if (response.data.success && response.data.data) {
        const guests = (response.data.data.guests || []).map((data: any) => {
          const [firstName = '', lastName = ''] = (data.name || '').split(' ');
          return {
            id: data.id,
            eventId,
            name: data.name,
            firstName: data.firstName || firstName,
            lastName: data.lastName || lastName,
            email: data.email,
            phone: data.phone,
            status: data.status,
            plusOnes: data.plusOnes || 0,
            notes: data.notes,
            dietaryRestrictions: data.dietaryRestrictions,
            addedAt: data.addedAt || new Date().toISOString(),
            rsvpUpdatedAt: data.rsvpUpdatedAt,
          } as Guest;
        });
        callback(guests);
      }
    } catch (error) {
      console.error("Error polling guests:", error);
    }
  };

  // Initial fetch
  pollGuests();
  
  // Poll every 5 seconds
  pollingInterval = setInterval(pollGuests, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const addGuestToEvent = async (isAuthenticated: boolean, eventId: string, payload: CreateGuestPayload): Promise<Guest> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to add a guest.");

  try {
    const response = await axiosInstance.post(`/events/${eventId}/guests`, {
      ...payload,
      status: payload.status || 'Invited',
    });
    
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        eventId,
        ...data,
        addedAt: data.addedAt || new Date().toISOString(),
      } as Guest;
    }
    throw new Error("Failed to add guest.");
  } catch (error) {
    console.error("Error adding guest to event:", error);
    throw error;
  }
};

export const sendRsvpReminderToGuest = async (isAuthenticated: boolean, eventId: string, guestId: string): Promise<boolean> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !guestId) {
    throw new Error("Event ID and Guest ID are required to send a reminder.");
  }

  console.log(`Service: Sending RSVP reminder to guest ${guestId} for event ${eventId}...`);

  try {
    await axiosInstance.post(`/events/${eventId}/guests/${guestId}/remind`);
    return true;
  } catch (error) {
    console.error(`Error sending RSVP reminder to guest ${guestId}:`, error);
    throw error;
  }
};

export const updateGuestRsvp = async (isAuthenticated: boolean, eventId: string, guestId: string, payload: Partial<UpdateGuestPayload & UpdateRSVPPayload>): Promise<Guest | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !guestId) throw new Error("Event ID and Guest ID are required.");
  try {
    const response = await axiosInstance.patch(`/events/${eventId}/guests/${guestId}`, payload);
    
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      const [defaultFirstName = '', defaultLastName = ''] = (data.name || '').split(' ');
      
      const event = await getEventById(isAuthenticated, eventId);
      if (event && payload.status) {
        createRsvpReceivedNotification(event.organizerId, data.name, payload.status, event.name, eventId);
      }
      if (event && payload.dietaryRestrictions) {
        createDietaryPreferenceNotification(event.organizerId, data.name, event.name, eventId);
      }

      return {
        id: data.id || guestId,
        eventId,
        name: data.name,
        firstName: data.firstName || defaultFirstName,
        lastName: data.lastName || defaultLastName,
        status: data.status,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
        plusOnes: data.plusOnes || 0,
        addedAt: data.addedAt || new Date().toISOString(),
        rsvpUpdatedAt: data.rsvpUpdatedAt,
      } as Guest;
    }
    return null;
  } catch (error) {
    console.error("Error updating guest/RSVP:", error);
    throw error;
  }
};

export const removeGuestFromEvent = async (isAuthenticated: boolean, eventId: string, guestId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !guestId) throw new Error("Event ID and Guest ID are required.");
  try {
    await axiosInstance.delete(`/events/${eventId}/guests/${guestId}`);
  } catch (error) {
    console.error("Error removing guest:", error);
    throw error;
  }
};

export const listenToSchedule = (isAuthenticated: boolean, eventId: string, callback: (schedule: ScheduleItem[]) => void) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to schedule.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToSchedule: Event ID is required.");
    return () => {};
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollSchedule = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/schedule`);
      if (response.data.success && response.data.data) {
        const scheduleItems = (response.data.data.scheduleItems || []).map((data: any) => ({
          id: data.id,
          eventId,
          ...data,
        })) as ScheduleItem[];
        callback(scheduleItems);
      }
    } catch (error) {
      console.error("Error polling schedule:", error);
    }
  };

  pollSchedule();
  pollingInterval = setInterval(pollSchedule, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const getEventTheme = async (isAuthenticated: boolean, eventId: string, userId?: string): Promise<Theme | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    const response = await axiosInstance.get(`/events/${eventId}/theme`);
    if (response.data.success && response.data.data) {
      return response.data.data as Theme;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching theme for event ${eventId}:`, error);
    throw error;
  }
};

export const listenToEventTasks = (isAuthenticated: boolean, eventId: string, callback: (tasks: Task[]) => void) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to tasks.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToEventTasks: Event ID is required.");
    return () => {};
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollTasks = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/tasks`);
      if (response.data.success && response.data.data) {
        const tasks = (response.data.data.tasks || []).map((data: any) => ({
          id: data.id,
          eventId,
          ...data,
        })) as Task[];
        callback(tasks);
      }
    } catch (error) {
      console.error("Error polling tasks:", error);
    }
  };

  pollTasks();
  pollingInterval = setInterval(pollTasks, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const listenToBudgetItems = (isAuthenticated: boolean, eventId: string, callback: (budgetItems: BudgetItem[]) => void) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to budget items.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToBudgetItems: Event ID is required.");
    return () => {};
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollBudgetItems = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/budget-items`);
      if (response.data.success && response.data.data) {
        const items = (response.data.data.budgetItems || []).map((data: any) => ({
          id: data.id,
          eventId,
          ...data,
        })) as BudgetItem[];
        callback(items);
      }
    } catch (error) {
      console.error("Error polling budget items:", error);
    }
  };

  pollBudgetItems();
  pollingInterval = setInterval(pollBudgetItems, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const listenToIdeas = (isAuthenticated: boolean, eventId: string, callback: (ideas: Idea[]) => void) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to ideas.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToIdeas: Event ID is required.");
    return () => {};
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollIdeas = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/ideas`);
      if (response.data.success && response.data.data) {
        const ideas = (response.data.data.ideas || []).map((data: any) => ({
          id: data.id,
          eventId,
          ...data,
        })) as Idea[];
        callback(ideas);
      }
    } catch (error) {
      console.error("Error polling ideas:", error);
    }
  };

  pollIdeas();
  pollingInterval = setInterval(pollIdeas, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const listenToEventTeams = (isAuthenticated: boolean, eventId: string, callback: (teams: EventTeam[]) => void) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to teams.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToEventTeams: Event ID is required.");
    return () => {};
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollTeams = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/teams`);
      if (response.data.success && response.data.data) {
        const teams = (response.data.data.teams || []).map((data: any) => ({
          id: data.id,
          eventId,
          ...data,
        })) as EventTeam[];
        callback(teams);
      }
    } catch (error) {
      console.error("Error polling teams:", error);
    }
  };

  pollTeams();
  pollingInterval = setInterval(pollTeams, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const listenToEventMessages = (isAuthenticated: boolean, eventId: string, callback: (messages: EventMessage[]) => void) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to messages.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToEventMessages: Event ID is required.");
    return () => {};
  }

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollMessages = async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/messages`);
      if (response.data.success && response.data.data) {
        const messages = (response.data.data.messages || []).map((data: any) => ({
          id: data.id,
          eventId,
          ...data,
        })) as EventMessage[];
        callback(messages);
      }
    } catch (error) {
      console.error("Error polling messages:", error);
    }
  };

  pollMessages();
  pollingInterval = setInterval(pollMessages, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const getAvailableThemes = async (isAuthenticated: boolean, userId: string | null): Promise<Theme[]> => {
  try {
    console.log('getAvailableThemes called', { isAuthenticated, userId });
    
    // For unauthenticated users, return predefined themes
    if (!isAuthenticated) {
      try {
        // Import predefined themes dynamically to avoid circular dependencies
        const { predefinedThemes } = await import('../constants/themes');
        console.log('Returning predefined themes for unauthenticated user:', predefinedThemes.length);
        return predefinedThemes;
      } catch (importError) {
        console.error('Error importing predefined themes:', importError);
        // Return a basic fallback theme
        return [{
          id: 'fallback-theme',
          name: 'Default Theme',
          isPredefined: true,
          colors: {
            primary: '#000000',
            secondary: '#FFFFFF',
            background: '#FFFFFF',
            text: '#000000',
          },
          fonts: {
            heading: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
            body: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
          },
        }];
      }
    }
    
    try {
      console.log('Fetching themes from backend...');
      const response = await axiosInstance.get('/themes');
      
      if (response.data.success && response.data.data) {
        const themes = (response.data.data.themes || []).map((data: any) => ({
          id: data.id,
          name: data.name || '',
          colors: {
            primary: data.colors?.primary || '#000000',
            secondary: data.colors?.secondary || '#FFFFFF',
            background: data.colors?.background || '#FFFFFF',
            text: data.colors?.text || '#000000',
            accent: data.colors?.accent,
            cardBackground: data.colors?.cardBackground,
            borderColor: data.colors?.borderColor,
          },
          fonts: {
            heading: {
              fontFamily: data.fonts?.heading?.fontFamily || 'Poppins-Regular',
              fontWeight: data.fonts?.heading?.fontWeight || '400',
              fontStyle: data.fonts?.heading?.fontStyle,
            },
            body: {
              fontFamily: data.fonts?.body?.fontFamily || 'Poppins-Regular',
              fontWeight: data.fonts?.body?.fontWeight || '400',
              fontStyle: data.fonts?.body?.fontStyle,
            },
          },
          isPredefined: data.isPredefined || false,
        })) as Theme[];
        
        // Also include predefined themes for authenticated users
        try {
          const { predefinedThemes } = await import('../constants/themes');
          const result = [...predefinedThemes, ...themes];
          console.log('Returning combined themes:', result.length);
          return result;
        } catch (importError) {
          console.error('Error importing predefined themes for authenticated user:', importError);
          return themes;
        }
      }
      
      // Fallback to predefined themes if backend returns no data
      try {
        const { predefinedThemes } = await import('../constants/themes');
        console.log('Fallback to predefined themes due to backend error');
        return predefinedThemes;
      } catch (importError) {
        console.error('Error importing predefined themes as fallback:', importError);
        return [{
          id: 'fallback-theme',
          name: 'Default Theme',
          isPredefined: true,
          colors: {
            primary: '#000000',
            secondary: '#FFFFFF',
            background: '#FFFFFF',
            text: '#000000',
          },
          fonts: {
            heading: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
            body: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
          },
        }];
      }
    } catch (backendError) {
      console.error("Error fetching themes from backend:", backendError);
      // Fallback to predefined themes on error
      try {
        const { predefinedThemes } = await import('../constants/themes');
        console.log('Fallback to predefined themes due to backend error');
        return predefinedThemes;
      } catch (importError) {
        console.error('Error importing predefined themes as fallback:', importError);
        return [{
          id: 'fallback-theme',
          name: 'Default Theme',
          isPredefined: true,
          colors: {
            primary: '#000000',
            secondary: '#FFFFFF',
            background: '#FFFFFF',
            text: '#000000',
          },
          fonts: {
            heading: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
            body: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
          },
        }];
      }
    }
  } catch (error) {
    console.error("Unexpected error in getAvailableThemes:", error);
    // Return a basic fallback theme
    return [{
      id: 'fallback-theme',
      name: 'Default Theme',
      isPredefined: true,
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        background: '#FFFFFF',
        text: '#000000',
      },
      fonts: {
        heading: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
        body: { fontFamily: 'Poppins-Regular', fontWeight: '400' },
      },
    }];
  }
};

export const setEventTheme = async (isAuthenticated: boolean, eventId: string, themeId: string | null): Promise<boolean> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    await axiosInstance.patch(`/events/${eventId}/theme`, { themeId });
    return true;
  } catch (error) {
    console.error(`Error setting theme for event ${eventId}:`, error);
    throw error;
  }
};

export const getEventWebsite = async (isAuthenticated: boolean, eventId: string): Promise<WebsitePayload | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    const response = await axiosInstance.get(`/events/${eventId}/website`);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        published: data.published ?? false,
        title: data.title,
        headerImageUrl: data.headerImageUrl,
        welcomeMessage: data.welcomeMessage,
        sections: data.sections ?? [],
        websiteThemeId: data.websiteThemeId,
        updatedAt: data.updatedAt || new Date().toISOString()
      } as WebsitePayload;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching website for event ${eventId}:`, error);
    throw error;
  }
};

export const updateEventWebsite = async (isAuthenticated: boolean, eventId: string, payload: UpdateEventWebsiteDetailsPayload): Promise<WebsitePayload | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    const response = await axiosInstance.put(`/events/${eventId}/website`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        published: data.published ?? false,
        title: data.title,
        headerImageUrl: data.headerImageUrl,
        welcomeMessage: data.welcomeMessage,
        sections: data.sections ?? [],
        websiteThemeId: data.websiteThemeId,
        updatedAt: data.updatedAt || new Date().toISOString()
      } as WebsitePayload;
    }
    return null;
  } catch (error) {
    console.error(`Error updating website for event ${eventId}:`, error);
    throw error;
  }
};

export const addTaskToEvent = async (isAuthenticated: boolean, eventId: string, payload: CreateTaskPayload): Promise<Task> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to add a task.");
  try {
    const response = await axiosInstance.post(`/events/${eventId}/tasks`, {
      ...payload,
      status: payload.status || 'pending',
    });
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        eventId,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Task;
    }
    throw new Error("Failed to create task.");
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateEventTask = async (isAuthenticated: boolean, eventId: string, taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !taskId) throw new Error("Event ID and Task ID are required.");
  try {
    const response = await axiosInstance.put(`/events/${eventId}/tasks/${taskId}`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || taskId,
        eventId,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Task;
    }
    throw new Error("Failed to update task.");
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteEventTask = async (isAuthenticated: boolean, eventId: string, taskId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !taskId) throw new Error("Event ID and Task ID are required.");
  try {
    await axiosInstance.delete(`/events/${eventId}/tasks/${taskId}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const addIdeaToEvent = async (isAuthenticated: boolean, eventId: string, payload: CreateIdeaPayload, userId: string): Promise<Idea> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to add an idea.");
  try {
    const response = await axiosInstance.post(`/events/${eventId}/ideas`, {
      ...payload,
      createdBy: userId,
    });
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      const event = await getEventById(isAuthenticated, eventId);
      if (event) {
        createIdeaSubmittedNotification(event.organizerId, payload.title, event.name, eventId);
      }
      return {
        id: data.id,
        eventId,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
      } as Idea;
    }
    throw new Error("Failed to create idea.");
  } catch (error) {
    console.error("Error adding idea:", error);
    throw error;
  }
};

export const updateIdea = async (isAuthenticated: boolean, eventId: string, ideaId: string, payload: UpdateIdeaPayload): Promise<Idea> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !ideaId) throw new Error("Event ID and Idea ID are required.");
  try {
    const response = await axiosInstance.put(`/events/${eventId}/ideas/${ideaId}`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || ideaId,
        eventId,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
      } as Idea;
    }
    throw new Error("Failed to update idea.");
  } catch (error) {
    console.error("Error updating idea:", error);
    throw error;
  }
};

export const deleteIdea = async (isAuthenticated: boolean, eventId: string, ideaId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !ideaId) throw new Error("Event ID and Idea ID are required.");
  try {
    await axiosInstance.delete(`/events/${eventId}/ideas/${ideaId}`);
  } catch (error) {
    console.error("Error deleting idea:", error);
    throw error;
  }
};

export const voteForIdea = async (isAuthenticated: boolean, eventId: string, ideaId: string, increment: number = 1): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !ideaId) throw new Error("Event ID and Idea ID are required.");
  try {
    const response = await axiosInstance.post(`/events/${eventId}/ideas/${ideaId}/vote`, { increment });
    if (response.data.success && response.data.data) {
      const idea = response.data.data;
      const event = await getEventById(isAuthenticated, eventId);
      if (event && idea.votes >= 10) {
        createIdeaPopularNotification(event.organizerId, idea.title, event.name, idea.votes, eventId);
      }
    }
  } catch (error) {
    console.error("Error voting for idea:", error);
    throw error;
  }
};

export const getSeatingChartForEvent = async (isAuthenticated: boolean, eventId: string): Promise<SeatingChart | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    const response = await axiosInstance.get(`/events/${eventId}/seating-chart`);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || 'current',
        eventId,
        tables: data.tables || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      } as SeatingChart;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching seating chart for event ${eventId}:`, error);
    throw error;
  }
};

export const updateSeatingChart = async (isAuthenticated: boolean, eventId: string, payload: UpdateSeatingChartPayload): Promise<SeatingChart> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    const response = await axiosInstance.put(`/events/${eventId}/seating-chart`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || 'current',
        eventId,
        tables: data.tables || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      } as SeatingChart;
    }
    throw new Error("Failed to update seating chart.");
  } catch (error) {
    console.error(`Error updating seating chart for event ${eventId}:`, error);
    throw error;
  }
};

export const addScheduleItem = async (isAuthenticated: boolean, eventId: string, payload: CreateScheduleItemPayload): Promise<ScheduleItem> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to add a schedule item.");
  try {
    const response = await axiosInstance.post(`/events/${eventId}/schedule`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      const event = await getEventById(isAuthenticated, eventId);
      if (event) {
        createScheduleAddedNotification(event.organizerId, payload.title, event.name, eventId);
      }
      return {
        id: data.id,
        eventId,
        ...data,
      } as ScheduleItem;
    }
    throw new Error("Failed to create schedule item.");
  } catch (error) {
    console.error("Error adding schedule item:", error);
    throw error;
  }
};

export const updateScheduleItem = async (isAuthenticated: boolean, eventId: string, itemId: string, payload: UpdateScheduleItemPayload): Promise<ScheduleItem> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !itemId) throw new Error("Event ID and Item ID are required.");
  try {
    const response = await axiosInstance.put(`/events/${eventId}/schedule/${itemId}`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || itemId,
        eventId,
        ...data,
      } as ScheduleItem;
    }
    throw new Error("Failed to update schedule item.");
  } catch (error) {
    console.error("Error updating schedule item:", error);
    throw error;
  }
};

export const deleteScheduleItem = async (isAuthenticated: boolean, eventId: string, itemId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !itemId) throw new Error("Event ID and Item ID are required.");
  try {
    await axiosInstance.delete(`/events/${eventId}/schedule/${itemId}`);
  } catch (error) {
    console.error("Error deleting schedule item:", error);
    throw error;
  }
};

export const createEventTeam = async (isAuthenticated: boolean, eventId: string, payload: CreateEventTeamPayload): Promise<EventTeam> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to create a team.");
  try {
    const response = await axiosInstance.post(`/events/${eventId}/teams`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        eventId,
        ...data,
      } as EventTeam;
    }
    throw new Error("Failed to create team.");
  } catch (error) {
    console.error("Error creating event team:", error);
    throw error;
  }
};

export const updateEventTeam = async (isAuthenticated: boolean, eventId: string, teamId: string, payload: UpdateEventTeamPayload): Promise<EventTeam> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !teamId) throw new Error("Event ID and Team ID are required.");
  try {
    const response = await axiosInstance.put(`/events/${eventId}/teams/${teamId}`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || teamId,
        eventId,
        ...data,
      } as EventTeam;
    }
    throw new Error("Failed to update team.");
  } catch (error) {
    console.error("Error updating event team:", error);
    throw error;
  }
};

export const deleteEventTeam = async (isAuthenticated: boolean, eventId: string, teamId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !teamId) throw new Error("Event ID and Team ID are required.");
  try {
    await axiosInstance.delete(`/events/${eventId}/teams/${teamId}`);
  } catch (error) {
    console.error("Error deleting event team:", error);
    throw error;
  }
};

export const addTeamMemberToEventTeam = async (isAuthenticated: boolean, eventId: string, teamId: string, memberPayload: AddTeamMemberPayload): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !teamId) throw new Error("Event ID and Team ID are required.");
  try {
    await axiosInstance.post(`/events/${eventId}/teams/${teamId}/members`, memberPayload);
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error("Member already exists in team.");
    }
    console.error("Error adding team member:", error);
    throw error;
  }
};

export const updateTeamMemberInEventTeam = async (isAuthenticated: boolean, eventId: string, teamId: string, userId: string, rolePayload: UpdateTeamMemberPayload): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !teamId || !userId) throw new Error("Event ID, Team ID, and User ID are required.");
  try {
    await axiosInstance.patch(`/events/${eventId}/teams/${teamId}/members/${userId}`, rolePayload);
  } catch (error) {
    console.error("Error updating team member:", error);
    throw error;
  }
};

export const removeTeamMemberFromEventTeam = async (isAuthenticated: boolean, eventId: string, teamId: string, userId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !teamId || !userId) throw new Error("Event ID, Team ID, and User ID are required.");
  try {
    await axiosInstance.delete(`/events/${eventId}/teams/${teamId}/members/${userId}`);
  } catch (error) {
    console.error("Error removing team member:", error);
    throw error;
  }
};

export const sendEventMessage = async (isAuthenticated: boolean, eventId: string, payload: CreateEventMessagePayload, senderId: string): Promise<EventMessage> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to send a message.");
  try {
    const response = await axiosInstance.post(`/events/${eventId}/messages`, {
      ...payload,
      sender: senderId,
    });
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        eventId,
        sender: data.sender || senderId,
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
        type: data.type,
      } as EventMessage;
    }
    throw new Error("Failed to send message.");
  } catch (error) {
    console.error("Error sending event message:", error);
    throw error;
  }
};

export const updateBudgetItem = async (isAuthenticated: boolean, eventId: string, itemId: string, payload: UpdateBudgetItemPayload): Promise<BudgetItem> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !itemId) throw new Error("Event ID and Item ID are required.");
  try {
    const response = await axiosInstance.put(`/events/${eventId}/budget-items/${itemId}`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || itemId,
        eventId: data.eventId || eventId,
        ...data,
      } as BudgetItem;
    }
    throw new Error("Failed to update budget item.");
  } catch (error) {
    console.error("Error updating budget item:", error);
    throw error;
  }
};

export const deleteBudgetItem = async (isAuthenticated: boolean, eventId: string, itemId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId || !itemId) throw new Error("Event ID and Item ID are required.");
  try {
    await axiosInstance.delete(`/events/${eventId}/budget-items/${itemId}`);
  } catch (error) {
    console.error("Error deleting budget item:", error);
    throw error;
  }
};

export const publishEventWebsite = async (isAuthenticated: boolean, eventId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  try {
    await axiosInstance.post(`/events/${eventId}/website/publish`);
    const event = await getEventById(isAuthenticated, eventId);
    if (event) {
      createWebsitePublishedNotification(event.organizerId, event.name, getEventWebsiteUrl(event.id), eventId);
    }
  } catch (error) {
    console.error(`Error publishing website for event ${eventId}:`, error);
    throw error;
  }
};

export const unpublishEventWebsite = async (isAuthenticated: boolean, eventId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  try {
    await axiosInstance.post(`/events/${eventId}/website/unpublish`);
  } catch (error) {
    console.error(`Error unpublishing website for event ${eventId}:`, error);
    throw error;
  }
};

export const getEventBySlug = async (isAuthenticated: boolean, slug: string): Promise<Event | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!slug) throw new Error("Slug is required.");
  
  try {
    const response = await axiosInstance.get(`/events/slug/${slug}`);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id,
        ...data,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Event;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching event by slug ${slug}:`, error);
    throw error;
  }
};

export const addBudgetItemToEvent = async (isAuthenticated: boolean, eventId: string, payload: CreateBudgetItemPayload): Promise<BudgetItem> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to add a budget item.");
  try {
    const response = await axiosInstance.post(`/events/${eventId}/budget-items`, payload);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      const event = await getEventById(isAuthenticated, eventId);
      if (event) {
        createBudgetItemAddedNotification(event.organizerId, payload.itemName, event.name, eventId);
        
        if (event.overallBudget && data.estimatedCost) {
          const budgetResponse = await axiosInstance.get(`/events/${eventId}/budget-items`);
          if (budgetResponse.data.success && budgetResponse.data.data) {
            const budgetItems = budgetResponse.data.data.budgetItems || [];
            const totalEstimatedCost = budgetItems.reduce((sum: number, item: BudgetItem) => sum + (item.estimatedCost || 0), 0);
            if (totalEstimatedCost > 0) {
              const percentageAllocated = Math.round((totalEstimatedCost / event.overallBudget) * 100);
              if (percentageAllocated >= 25 && percentageAllocated < 30) {
                createBudgetMilestoneNotification(event.organizerId, event.name, 25, eventId);
              } else if (percentageAllocated >= 50 && percentageAllocated < 55) {
                createBudgetMilestoneNotification(event.organizerId, event.name, 50, eventId);
              } else if (percentageAllocated >= 75 && percentageAllocated < 80) {
                createBudgetMilestoneNotification(event.organizerId, event.name, 75, eventId);
              } else if (percentageAllocated >= 100 && percentageAllocated < 105) {
                createBudgetMilestoneNotification(event.organizerId, event.name, 100, eventId);
              }
            }
          }
        }
      }
      return {
        id: data.id,
        eventId: data.eventId || eventId,
        ...data,
      } as BudgetItem;
    }
    throw new Error("Failed to create budget item.");
  } catch (error) {
    console.error("Error adding budget item:", error);
    throw error;
  }
};
