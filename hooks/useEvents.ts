import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Added
import * as eventService from '../services/eventService';
import {
  Event, CreateEventPayload, UpdateEventPayload,
  Guest, CreateGuestPayload, UpdateGuestPayload, UpdateRSVPPayload,
  ScheduleItem, CreateScheduleItemPayload, UpdateScheduleItemPayload,
  Task, CreateTaskPayload, UpdateTaskPayload,
  BudgetItem, CreateBudgetItemPayload, UpdateBudgetItemPayload,
  Idea, CreateIdeaPayload, UpdateIdeaPayload,
  Theme, 

  EventTeam, CreateEventTeamPayload, UpdateEventTeamPayload, AddTeamMemberPayload, UpdateTeamMemberPayload,
  EventMessage, CreateEventMessagePayload,
  SeatingChart, UpdateSeatingChartPayload, WebsitePayload, // Added SeatingChart types
} from '../types/eventTypes';

// Hook for managing a list of all events
export const useAllEvents = () => {
  const { isAuthenticated } = useAuth(); // Added
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchedEvent, setLastFetchedEvent] = useState<Event | undefined>(undefined);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const eventsLimit = 10; // Number of events per page

  const fetchEvents = useCallback(async (isInitialFetch: boolean = false) => {
    if (!hasMoreEvents && !isInitialFetch) return;

    setIsLoading(true);
    setError(null);
    try {
      const cursor = isInitialFetch ? undefined : lastFetchedEvent;
      const data = await eventService.getEventsPaginated(isAuthenticated, eventsLimit, cursor); // Modified
      
      if (isInitialFetch) {
        setEvents(data);
      } else {
        setEvents(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          return [...prev, ...data.filter(e => !existingIds.has(e.id))];
        });
      }
      
      setHasMoreEvents(data.length === eventsLimit);
      if (data.length > 0) {
        setLastFetchedEvent(data[data.length - 1]);
      }
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch events:", e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, hasMoreEvents, lastFetchedEvent?.createdAt, eventsLimit]); // Changed lastFetchedEvent to lastFetchedEvent?.createdAt

  useEffect(() => {
    // Initial fetch logic when component mounts or isAuthenticated changes
    const performInitialFetch = async () => {
      if (isAuthenticated) {
        setLastFetchedEvent(undefined);
        setHasMoreEvents(true);
        await fetchEvents(true); // Call the memoized fetchEvents
      } else {
        // Clear data if not authenticated
        setEvents([]);
        setIsLoading(false);
        setError(null);
        setHasMoreEvents(false);
        setLastFetchedEvent(undefined);
      }
    };
    performInitialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Removed fetchEvents from here, depends only on isAuthenticated

  const loadMoreEvents = useCallback(() => {
    if (isAuthenticated && hasMoreEvents && !isLoading) { // check isAuthenticated
      fetchEvents(false);
    }
  }, [isAuthenticated, hasMoreEvents, isLoading, fetchEvents]);

  const refreshEvents = useCallback(() => {
    if (isAuthenticated) { // check isAuthenticated
      setLastFetchedEvent(undefined);
      setHasMoreEvents(true);
      fetchEvents(true);
    }
  }, [isAuthenticated, fetchEvents]);

  const addEvent = useCallback(async (payload: CreateEventPayload, organizerId: string) => {
    setIsLoading(true); // Consider a specific loading state for addEvent
    setError(null);
    try {
      const newEvent = await eventService.createEvent(isAuthenticated, payload, organizerId); // Modified
      // Optimistically add to the start of the list or refetch/refresh
      setEvents(prev => [newEvent, ...prev.filter(e => e.id !== newEvent.id)]);
      // If using createdAt for pagination, new event should appear at top after refresh.
      // Or, if not refreshing, ensure `lastFetchedEvent` logic doesn't break.
      // For simplicity, prepending. A full refresh might be better for consistency.
      return newEvent;
    } catch (e) {
      setError(e as Error);
      console.error("Failed to create event:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]); // Added isAuthenticated to dependency array
  
  return { 
    events, 
    isLoading, 
    error, 
    fetchEvents: refreshEvents, 
    loadMoreEvents, 
    addEvent 
  };
};

// Hook for managing a single event and its details (including sub-entities like guests and schedule)
export const useEventDetail = (eventId?: string) => {
  const { isAuthenticated, user } = useAuth(); // Added user
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [eventWebsite, setEventWebsite] = useState<WebsitePayload | null>(null);
  const [eventTeams, setEventTeams] = useState<EventTeam[]>([]);
  const [eventMessages, setEventMessages] = useState<EventMessage[]>([]);
  const [seatingChart, setSeatingChart] = useState<SeatingChart | null>(null); // Added state for seating chart

  const [isLoadingEvent, setIsLoadingEvent] = useState(true); 
  const [isLoadingSubEntities, setIsLoadingSubEntities] = useState(true); 
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  const [isLoadingSeatingChart, setIsLoadingSeatingChart] = useState(false); // Added loading state for seating chart
  const [error, setError] = useState<Error | null>(null);

  // Fetch main event data (non-real-time for now, can be enhanced)
  const fetchMainEvent = useCallback(async (id: string) => {
    if (!id) {
      setEvent(null);
      setIsLoadingEvent(false);
      return;
    }
    setIsLoadingEvent(true);
    setError(null);
    try {
      const eventData = await eventService.getEventById(isAuthenticated, id); // Modified
      setEvent(eventData);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to fetch event details for ${id}:`, e);
    } finally {
      setIsLoadingEvent(false);
    }
  }, []);

  useEffect(() => {
    fetchMainEvent(eventId || '');

    let unsubscribeGuests: (() => void) | undefined = undefined;
    let unsubscribeSchedule: (() => void) | undefined = undefined;
    let unsubscribeTasks: (() => void) | undefined = undefined;
    let unsubscribeBudgetItems: (() => void) | undefined = undefined;
    let unsubscribeIdeas: (() => void) | undefined = undefined;
    let unsubscribeEventTeams: (() => void) | undefined = undefined;
    let unsubscribeEventMessages: (() => void) | undefined = undefined;

    const fetchInitialNonRealtimeSubData = async () => {
      if (eventId) {
        setIsLoadingThemes(true);
        setIsLoadingWebsite(true);
        setIsLoadingSeatingChart(true);
        try {
          const [eventThemeData, allThemesData, websiteData, seatingChartData] = await Promise.all([
            eventService.getEventTheme(isAuthenticated, eventId, user?.uid), // user?.uid is fine here as getEventTheme accepts string | undefined for userId
            eventService.getAvailableThemes(isAuthenticated, user?.uid || null), // Pass user?.uid or null
            eventService.getEventWebsite(isAuthenticated, eventId), 
            eventService.getSeatingChartForEvent(isAuthenticated, eventId) 
          ]);
          setCurrentTheme(eventThemeData);
          setAvailableThemes(allThemesData);
          setEventWebsite(websiteData);
          setSeatingChart(seatingChartData);
        } catch (err) {
          console.error("Error fetching initial non-realtime sub-data:", err);
          setError(err as Error); 
        } finally {
          setIsLoadingThemes(false);
          setIsLoadingWebsite(false);
          setIsLoadingSeatingChart(false);
        }
      } else {
        setCurrentTheme(null);
        setAvailableThemes([]);
        setEventWebsite(null);
        setSeatingChart(null);
      }
    };

    if (eventId) {
      setIsLoadingSubEntities(true);
      fetchInitialNonRealtimeSubData(); 

      let loadedFlags = { guests: false, schedule: false, tasks: false, budget: false, ideas: false, teams: false, messages: false };
      const checkAllLoaded = () => {
        if (Object.values(loadedFlags).every(Boolean)) {
          setIsLoadingSubEntities(false);
        }
      };
      
      unsubscribeGuests = eventService.listenToGuestsWithRsvp(isAuthenticated, eventId, (updatedGuests) => { // Modified
        setGuests(updatedGuests);
        loadedFlags.guests = true; checkAllLoaded();
      });
      
      unsubscribeSchedule = eventService.listenToSchedule(isAuthenticated, eventId, (updatedSchedule) => { // Modified
        setSchedule(updatedSchedule);
        loadedFlags.schedule = true; checkAllLoaded();
      });

      unsubscribeTasks = eventService.listenToEventTasks(isAuthenticated, eventId, (updatedTasks) => { // Modified
        setTasks(updatedTasks);
        loadedFlags.tasks = true; checkAllLoaded();
      });

      unsubscribeBudgetItems = eventService.listenToBudgetItems(isAuthenticated, eventId, (updatedBudgetItems) => { // Modified
        setBudgetItems(updatedBudgetItems);
        loadedFlags.budget = true; checkAllLoaded();
      });

      unsubscribeIdeas = eventService.listenToIdeas(isAuthenticated, eventId, (updatedIdeas) => { // Modified
        setIdeas(updatedIdeas);
        loadedFlags.ideas = true; checkAllLoaded();
      });

      unsubscribeEventTeams = eventService.listenToEventTeams(isAuthenticated, eventId, (updatedTeams) => { // Modified
        setEventTeams(updatedTeams);
        loadedFlags.teams = true; checkAllLoaded();
      });

      unsubscribeEventMessages = eventService.listenToEventMessages(isAuthenticated, eventId, (updatedMessages) => { // Modified
        setEventMessages(updatedMessages);
        loadedFlags.messages = true; checkAllLoaded();
      });

    } else {
      setEvent(null);
      setGuests([]);
      setSchedule([]);
      setTasks([]);
      setBudgetItems([]);
      setIdeas([]);
      setCurrentTheme(null);
      setAvailableThemes([]);
      setEventWebsite(null);
      setEventTeams([]);
      setEventMessages([]);
      setSeatingChart(null);
      setIsLoadingEvent(false);
      setIsLoadingSubEntities(false);
      setIsLoadingThemes(false);
      setIsLoadingWebsite(false);
      setIsLoadingSeatingChart(false);
    }

    return () => {
      if (unsubscribeGuests) unsubscribeGuests();
      if (unsubscribeSchedule) unsubscribeSchedule();
      if (unsubscribeTasks) unsubscribeTasks();
      if (unsubscribeBudgetItems) unsubscribeBudgetItems();
      if (unsubscribeIdeas) unsubscribeIdeas();
      if (unsubscribeEventTeams) unsubscribeEventTeams();
      if (unsubscribeEventMessages) unsubscribeEventMessages();
    };
  }, [eventId, fetchMainEvent]);

  const updateThisEvent = useCallback(async (payload: UpdateEventPayload) => {
    if (!eventId) { // Use eventId from params as event state might not be set yet
      console.error("No event ID provided to update.");
      setError(new Error("No event ID provided to update."));
      return null;
    }
    // setIsLoadingEvent(true); // Or a general loading state
    setError(null);
    try {
      const updatedEventData = await eventService.updateEvent(isAuthenticated, eventId, payload); // Modified
      setEvent(updatedEventData); 
      return updatedEventData;
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to update event ${eventId}:`, e);
      throw e;
    } finally {
      // setIsLoadingEvent(false);
    }
  }, [eventId]);

  const deleteThisEvent = useCallback(async () => {
    if (!eventId) {
      console.error("No event ID provided to delete.");
      setError(new Error("No event ID provided to delete."));
      return false;
    }
    // setIsLoadingEvent(true);
    setError(null);
    try {
      const success = await eventService.deleteEvent(isAuthenticated, eventId); // Modified
      if (success) {
        setEvent(null); 
        setGuests([]);  
        setSchedule([]);
        setTasks([]);
        setBudgetItems([]);
        setIdeas([]);
        setCurrentTheme(null);
        setEventWebsite(null);
        setEventTeams([]);
        setEventMessages([]);
        setSeatingChart(null);
        // Clear other sub-entities
      }
      return success;
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to delete event ${eventId}:`, e);
      throw e;
    } finally {
      // setIsLoadingEvent(false);
    }
  }, [eventId]);


  // --- Guest Management specific to this event (now uses Firestore-backed services) ---
  const addGuest = useCallback(async (payload: CreateGuestPayload) => {
    if (!eventId) {
      setError(new Error("Event not loaded. Cannot add guest."));
      throw new Error("Event not loaded. Cannot add guest.");
    }
    // setIsLoadingSubEntities(true); // Or a specific guest loading state
    setError(null);
    try {
      // Listener will update the guests state
      return await eventService.addGuestToEvent(isAuthenticated, eventId, payload); // Modified
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to add guest to event ${eventId}:`, e);
      throw e;
    } finally {
      // setIsLoadingSubEntities(false);
    }
  }, [eventId]);

  const updateGuestAndRsvp = useCallback(async (guestId: string, payload: Partial<UpdateGuestPayload & UpdateRSVPPayload>) => {
    if (!eventId) {
      setError(new Error("Event not loaded. Cannot update guest/RSVP."));
      throw new Error("Event not loaded. Cannot update guest/RSVP.");
    }
    // setIsLoadingSubEntities(true);
    setError(null);
    try {
      // Listener will update the guests state
      return await eventService.updateGuestRsvp(isAuthenticated, eventId, guestId, payload); // Modified
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to update guest/RSVP ${guestId}:`, e);
      throw e;
    } finally {
      // setIsLoadingSubEntities(false);
    }
  }, [eventId]);

  const removeGuest = useCallback(async (guestId: string) => {
    if (!eventId) {
      setError(new Error("Event not loaded. Cannot remove guest."));
      throw new Error("Event not loaded. Cannot remove guest.");
    }
    // setIsLoadingSubEntities(true);
    setError(null);
    try {
      // Listener will update the guests state
      await eventService.removeGuestFromEvent(isAuthenticated, eventId, guestId); // Modified
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to remove guest ${guestId}:`, e);
      throw e;
    } finally {
      // setIsLoadingSubEntities(false);
    }
  }, [eventId]);

  // --- Schedule Item Management ---
  const addScheduleItemHook = useCallback(async (payload: CreateScheduleItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    // setIsLoadingSubEntities(true);
    try {
      // Listener will update schedule state
      return await eventService.addScheduleItem(isAuthenticated, eventId, payload); // Modified
    } catch (e) {
      console.error("Error in addScheduleItemHook", e);
      setError(e as Error);
      throw e;
    } finally {
      // setIsLoadingSubEntities(false);
    }
  }, [eventId]);

  const updateScheduleItemHook = useCallback(async (itemId: string, payload: UpdateScheduleItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    // setIsLoadingSubEntities(true);
    try {
      // Listener will update schedule state
      return await eventService.updateScheduleItem(isAuthenticated, eventId, itemId, payload); // Modified
    } catch (e) {
      console.error("Error in updateScheduleItemHook", e);
      setError(e as Error);
      throw e;
    } finally {
      // setIsLoadingSubEntities(false);
    }
  }, [eventId]);

  const deleteScheduleItemHook = useCallback(async (itemId: string) => {
    if (!eventId) throw new Error("Event ID is required.");
    // setIsLoadingSubEntities(true);
    try {
      // Listener will update schedule state
      await eventService.deleteScheduleItem(isAuthenticated, eventId, itemId); // Modified
    } catch (e) {
      console.error("Error in deleteScheduleItemHook", e);
      setError(e as Error);
      throw e;
    } finally {
      // setIsLoadingSubEntities(false);
    }
  }, [eventId]);

  // --- Event Task Management ---
  const addEventTaskHook = useCallback(async (payload: CreateTaskPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.addTaskToEvent(isAuthenticated, eventId, payload); } // Modified
    catch (e) { console.error("Error in addEventTaskHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const updateEventTaskHook = useCallback(async (taskId: string, payload: UpdateTaskPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.updateEventTask(isAuthenticated, eventId, taskId, payload); } // Modified
    catch (e) { console.error("Error in updateEventTaskHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const deleteEventTaskHook = useCallback(async (taskId: string) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { await eventService.deleteEventTask(isAuthenticated, eventId, taskId); } // Modified
    catch (e) { console.error("Error in deleteEventTaskHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  // --- Budget Item Management ---
  const addBudgetItemHook = useCallback(async (payload: CreateBudgetItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.addBudgetItemToEvent(isAuthenticated, eventId, payload); } // Modified
    catch (e) { console.error("Error in addBudgetItemHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const updateBudgetItemHook = useCallback(async (itemId: string, payload: UpdateBudgetItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.updateBudgetItem(isAuthenticated, eventId, itemId, payload); } // Modified
    catch (e) { console.error("Error in updateBudgetItemHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const deleteBudgetItemHook = useCallback(async (itemId: string) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { await eventService.deleteBudgetItem(isAuthenticated, eventId, itemId); } // Modified
    catch (e) { console.error("Error in deleteBudgetItemHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  return {
    event,
    guests,
    schedule,
    tasks,
    budgetItems,
    ideas,
    isLoading: isLoadingEvent || isLoadingSubEntities, // Combined loading state
    error,
    fetchEventDetails: () => eventId && fetchMainEvent(eventId), // Keep a way to manually refetch main event
    updateThisEvent,
    deleteThisEvent,
    addGuest,
    updateGuestAndRsvp, // Renamed from updateGuestDetails
    removeGuestFromEvent: removeGuest, // Renamed from removeGuestFromEvent
    addScheduleItem: addScheduleItemHook,
    updateScheduleItem: updateScheduleItemHook,
    deleteScheduleItem: deleteScheduleItemHook,
    addEventTask: addEventTaskHook,
    updateEventTask: updateEventTaskHook,
    deleteEventTask: deleteEventTaskHook,
    addBudgetItem: addBudgetItemHook,
    updateBudgetItem: updateBudgetItemHook,
    deleteBudgetItem: deleteBudgetItemHook,
    addIdea: useCallback(async (payload: CreateIdeaPayload, userId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.addIdeaToEvent(isAuthenticated, eventId, payload, userId); } // Modified
      catch (e) { console.error("Error in addIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    updateIdea: useCallback(async (ideaId: string, payload: UpdateIdeaPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.updateIdea(isAuthenticated, eventId, ideaId, payload); } // Modified
      catch (e) { console.error("Error in updateIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    deleteIdea: useCallback(async (ideaId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.deleteIdea(isAuthenticated, eventId, ideaId); } // Modified
      catch (e) { console.error("Error in deleteIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    voteForIdea: useCallback(async (ideaId: string, increment: number = 1) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.voteForIdea(isAuthenticated, eventId, ideaId, increment); } // Modified
      catch (e) { console.error("Error in voteForIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    // Theme Management
    currentTheme,
    availableThemes,
    isLoadingThemes,
    setEventTheme: useCallback(async (themeId: string | null) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { 
        const success = await eventService.setEventTheme(isAuthenticated, eventId, themeId); 
        if (success) {
          const updatedTheme = await eventService.getEventTheme(isAuthenticated, eventId, user?.uid); // Pass userId
          setCurrentTheme(updatedTheme);
          // Also update the themeId on the main event object if it's being displayed directly
          setEvent(prev => prev ? ({ ...prev, themeId: themeId ?? undefined }) : null);
        }
        return success;
      }
      catch (e) { console.error("Error in setEventThemeHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    fetchAvailableThemes: useCallback(async () => { // This can be called independently if needed
        setIsLoadingThemes(true);
        try {
            const themes = await eventService.getAvailableThemes(isAuthenticated, user?.uid || null); // Pass user?.uid or null
            setAvailableThemes(themes);
        } catch (e) {
            console.error("Error fetching available themes in hook", e);
            setError(e as Error);
        } finally {
            setIsLoadingThemes(false);
        }
    }, [isAuthenticated]),
    // Event Website Management
    eventWebsite,
    isLoadingWebsite,
    updateEventWebsite: useCallback(async (payload: WebsitePayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      setIsLoadingWebsite(true);
      try {
        const updatedWebsite = await eventService.updateEventWebsite(isAuthenticated, eventId, payload); // Modified
        setEventWebsite(updatedWebsite);
        return updatedWebsite;
      } catch (e) {
        console.error("Error in updateEventWebsiteHook", e);
        setError(e as Error);
        throw e;
      } finally {
        setIsLoadingWebsite(false);
      }
    }, [eventId, isAuthenticated]),
    // Event Team Management
    eventTeams,
    createEventTeam: useCallback(async (payload: CreateEventTeamPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.createEventTeam(isAuthenticated, eventId, payload); } // Modified
      catch (e) { console.error("Error in createEventTeam hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    updateEventTeam: useCallback(async (teamId: string, payload: UpdateEventTeamPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.updateEventTeam(isAuthenticated, eventId, teamId, payload); } // Modified
      catch (e) { console.error("Error in updateEventTeam hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    deleteEventTeam: useCallback(async (teamId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.deleteEventTeam(isAuthenticated, eventId, teamId); } // Modified
      catch (e) { console.error("Error in deleteEventTeam hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    addTeamMember: useCallback(async (teamId: string, memberPayload: AddTeamMemberPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.addTeamMemberToEventTeam(isAuthenticated, eventId, teamId, memberPayload); } // Modified
      catch (e) { console.error("Error in addTeamMember hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    updateTeamMember: useCallback(async (teamId: string, userId: string, rolePayload: UpdateTeamMemberPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.updateTeamMemberInEventTeam(isAuthenticated, eventId, teamId, userId, rolePayload); } // Modified
      catch (e) { console.error("Error in updateTeamMember hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    removeTeamMember: useCallback(async (teamId: string, userId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.removeTeamMemberFromEventTeam(isAuthenticated, eventId, teamId, userId); } // Modified
      catch (e) { console.error("Error in removeTeamMember hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    // Event Message Management
    eventMessages,
    sendEventMessage: useCallback(async (payload: CreateEventMessagePayload, senderId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.sendEventMessage(isAuthenticated, eventId, payload, senderId); } // Modified
      catch (e) { console.error("Error in sendEventMessage hook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    // Seating Chart Management
    seatingChart,
    isLoadingSeatingChart,
    updateSeatingChart: useCallback(async (payload: UpdateSeatingChartPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      setIsLoadingSeatingChart(true);
      try {
        const updatedChart = await eventService.updateSeatingChart(isAuthenticated, eventId, payload); // Modified
        setSeatingChart(updatedChart);
        return updatedChart;
      } catch (e) {
        console.error("Error in updateSeatingChart hook", e);
        setError(e as Error);
        throw e;
      } finally {
        setIsLoadingSeatingChart(false);
      }
    }, [eventId, isAuthenticated]),
    // Overall Budget Management
    updateEventOverallBudgetHook: useCallback(async (budgetAmount: number) => {
      if (!eventId) {
        setError(new Error("Event not loaded. Cannot update overall budget."));
        throw new Error("Event not loaded. Cannot update overall budget.");
      }
      // Consider a specific loading state if needed, or use setIsLoadingEvent
      setError(null);
      try {
        await eventService.updateEventOverallBudget(isAuthenticated, eventId, budgetAmount); // Modified
        // Optimistically update the local event state or refetch
        setEvent(prevEvent => prevEvent ? { ...prevEvent, overallBudget: budgetAmount, updatedAt: new Date().toISOString() } : null);
      } catch (e) {
        setError(e as Error);
        console.error(`Failed to update overall budget for event ${eventId}:`, e);
        throw e;
      }
    }, [eventId, isAuthenticated]),
  };
};

// You might create more specialized hooks, e.g., useEventGuests(eventId), useEventBudget(eventId)
// if the useEventDetail hook becomes too large or if components only need a subset of data.
