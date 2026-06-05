import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useCurrentUser } from '@/hooks/useUser';
import * as eventService from '@/services/eventService';
import { selectEventRefetchTrigger, selectShowAllPublicEvents, triggerEventRefetch } from '../store/slices/eventVisibilitySlice';
import { getDefaultTheme } from '@/constants/themes';
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
  SeatingChart, UpdateSeatingChartPayload, WebsitePayload,
} from '@/types/eventTypes';
export const useAllEvents = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { settings } = useCurrentUser();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  
  const reduxShowAllPublicEvents = useSelector(selectShowAllPublicEvents);
  const refetchTrigger = useSelector(selectEventRefetchTrigger) as number;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchedEvent, setLastFetchedEvent] = useState<Event | undefined>(undefined);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const eventsLimit = 100;

  const events = useMemo(() => {
    if (!user?.uid) {
      return [];
    }

    if (!settings?.eventVisibility) {
      const filtered = allEvents.filter(event => {
        if (event.organizerId === user.uid) {
          return true;
        }
        
        if (event.visibility === 'public') {
          return true;
        }
        
        if (event.allowedUserIds && event.allowedUserIds.includes(user.uid)) {
          return true;
        }
        
        const userEmail = user.email;
        if (userEmail && event.guestEmails && event.guestEmails.includes(userEmail)) {
          return true;
        }
        
        return false;
      });
      return filtered;
    }

    const showAllPublicEvents = reduxShowAllPublicEvents;
    
    if (showAllPublicEvents) {
      const filteredEvents = allEvents.filter(event => {
        if (event.visibility === 'public') {
          return true;
        }
        
        if (event.organizerId === user.uid) {
          return true;
        }
        
        if (event.allowedUserIds && event.allowedUserIds.includes(user.uid)) {
          return true;
        }
        
        const userEmail = user.email;
        if (userEmail && event.guestEmails && event.guestEmails.includes(userEmail)) {
          return true;
        }
        
        return false;
      });
      return filteredEvents;
    } else {
      const filteredEvents = allEvents.filter(event => {
        if (event.organizerId === user.uid) {
          return true;
        }
        
        if (event.allowedUserIds && event.allowedUserIds.includes(user.uid)) {
          return true;
        }
        
        const userEmail = user.email;
        if (userEmail && event.guestEmails && event.guestEmails.includes(userEmail)) {
          return true;
        }
        
        return false;
      });
      return filteredEvents;
    }
  }, [allEvents, user?.uid, user?.email, reduxShowAllPublicEvents, settings?.eventVisibility]);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawData = await eventService.getEventsPaginated(isAuthenticated, eventsLimit, undefined);
      setAllEvents(rawData);
      setLastFetchedEvent(rawData.length > 0 ? rawData[rawData.length - 1] : undefined);
      setHasMoreEvents(rawData.length === eventsLimit);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch events:", e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, eventsLimit]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    } else {
      setAllEvents([]);
      setIsLoading(false);
      setError(null);
      setLastFetchedEvent(undefined);
      setHasMoreEvents(true);
    }
  }, [isAuthenticated, fetchEvents]);


  useEffect(() => {
    if (isAuthenticated && refetchTrigger > 0) {
      fetchEvents();
    }
  }, [refetchTrigger, isAuthenticated, fetchEvents, reduxShowAllPublicEvents]);

  const refreshEvents = useCallback(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated, fetchEvents]);

  const addEvent = useCallback(async (payload: CreateEventPayload, organizerId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newEvent = await eventService.createEvent(isAuthenticated, payload, organizerId);
      setAllEvents(prev => [newEvent, ...prev.filter(e => e.id !== newEvent.id)]);
      dispatch(triggerEventRefetch());
      return newEvent;
    } catch (e) {
      setError(e as Error);
      console.error("Failed to create event:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, dispatch]);
  
  const triggerGlobalRefetch = useCallback(() => {
    dispatch(triggerEventRefetch());
  }, [dispatch]);

  const loadMoreEvents = useCallback(async () => {
    if (!isAuthenticated || isLoadingMore || !hasMoreEvents || !lastFetchedEvent) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);
    try {
      const newEvents = await eventService.getEventsPaginated(isAuthenticated, eventsLimit, lastFetchedEvent);
      if (newEvents.length > 0) {
        setAllEvents(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const uniqueNewEvents = newEvents.filter(e => !existingIds.has(e.id));
          return [...prev, ...uniqueNewEvents];
        });
        setLastFetchedEvent(newEvents[newEvents.length - 1]);
        setHasMoreEvents(newEvents.length === eventsLimit);
      } else {
        setHasMoreEvents(false);
      }
    } catch (e) {
      setError(e as Error);
      console.error("Failed to load more events:", e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isAuthenticated, eventsLimit, lastFetchedEvent, hasMoreEvents, isLoadingMore]);

  return { 
    events, 
    isLoading, 
    error, 
    fetchEvents: refreshEvents, 
    addEvent,
    triggerGlobalRefetch,
    loadMoreEvents
  };
};

export const useEventDetail = (eventId?: string) => {
  const { isAuthenticated, user } = useAuth();
  const { setTheme: setThemeContext } = useTheme();
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
  const [seatingChart, setSeatingChart] = useState<SeatingChart | null>(null);

  const [isLoadingEvent, setIsLoadingEvent] = useState(true); 
  const [isLoadingSubEntities, setIsLoadingSubEntities] = useState(true); 
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [isLoadingWebsite, setIsLoadingWebsite] = useState(false);
  const [isLoadingSeatingChart, setIsLoadingSeatingChart] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMainEvent = useCallback(async (id: string) => {
    if (!id) {
      setEvent(null);
      setIsLoadingEvent(false);
      return;
    }
    setIsLoadingEvent(true);
    setError(null);
    try {
      const eventData = await eventService.getEventById(isAuthenticated, id);
      setEvent(eventData);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to fetch event details for ${id}:`, e);
    } finally {
      setIsLoadingEvent(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (eventId) {
      setCurrentTheme(null);
      setGuests([]);
      setSchedule([]);
      setTasks([]);
      setBudgetItems([]);
      setIdeas([]);
      setEventWebsite(null);
      setEventTeams([]);
      setEventMessages([]);
      setSeatingChart(null);
      setError(null);
    }

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
            eventService.getEventTheme(isAuthenticated, eventId, user?.uid),
            eventService.getAvailableThemes(isAuthenticated, user?.uid || null),
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
      const handleListenerError = (listenerError: Error) => {
        setError(listenerError);
        setIsLoadingSubEntities(false);
      };
      
      unsubscribeGuests = eventService.listenToGuestsWithRsvp(isAuthenticated, eventId, (updatedGuests) => {
        setGuests(updatedGuests);
        loadedFlags.guests = true; checkAllLoaded();
      }, handleListenerError);
      
      unsubscribeSchedule = eventService.listenToSchedule(isAuthenticated, eventId, (updatedSchedule) => {
        setSchedule(updatedSchedule);
        loadedFlags.schedule = true; checkAllLoaded();
      }, handleListenerError);

      unsubscribeTasks = eventService.listenToEventTasks(isAuthenticated, eventId, (updatedTasks) => {
        setTasks(updatedTasks);
        loadedFlags.tasks = true; checkAllLoaded();
      }, handleListenerError);

      unsubscribeBudgetItems = eventService.listenToBudgetItems(isAuthenticated, eventId, (updatedBudgetItems) => {
        setBudgetItems(updatedBudgetItems);
        loadedFlags.budget = true; checkAllLoaded();
      }, handleListenerError);

      unsubscribeIdeas = eventService.listenToIdeas(isAuthenticated, eventId, (updatedIdeas) => {
        setIdeas(updatedIdeas);
        loadedFlags.ideas = true; checkAllLoaded();
      }, handleListenerError);

      unsubscribeEventTeams = eventService.listenToEventTeams(isAuthenticated, eventId, (updatedTeams) => {
        setEventTeams(updatedTeams);
        loadedFlags.teams = true; checkAllLoaded();
      }, handleListenerError);

      unsubscribeEventMessages = eventService.listenToEventMessages(isAuthenticated, eventId, (updatedMessages) => {
        setEventMessages(updatedMessages);
        loadedFlags.messages = true; checkAllLoaded();
      }, handleListenerError);

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
  }, [eventId, fetchMainEvent, isAuthenticated, user?.uid]);

  const updateThisEvent = useCallback(async (payload: UpdateEventPayload) => {
    if (!eventId) {
      console.error("No event ID provided to update.");
      setError(new Error("No event ID provided to update."));
      return null;
    }
    setError(null);
    try {
      const updatedEventData = await eventService.updateEvent(isAuthenticated, eventId, payload, user?.uid);
      setEvent(updatedEventData); 
      return updatedEventData;
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to update event ${eventId}:`, e);
      throw e;
    }
  }, [eventId, isAuthenticated, user?.uid]);

  const deleteThisEvent = useCallback(async () => {
    if (!eventId) {
      console.error("No event ID provided to delete.");
      setError(new Error("No event ID provided to delete."));
      return false;
    }
    setError(null);
    try {
      const success = await eventService.deleteEvent(isAuthenticated, eventId);
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
      }
      return success;
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to delete event ${eventId}:`, e);
      throw e;
    }
  }, [eventId, isAuthenticated]);


  const addGuest = useCallback(async (payload: CreateGuestPayload) => {
    if (!eventId) {
      setError(new Error("Event not loaded. Cannot add guest."));
      throw new Error("Event not loaded. Cannot add guest.");
    }
    setError(null);
    try {
      return await eventService.addGuestToEvent(isAuthenticated, eventId, payload);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to add guest to event ${eventId}:`, e);
      throw e;
    }
  }, [eventId, isAuthenticated]);

  const updateGuestAndRsvp = useCallback(async (guestId: string, payload: Partial<UpdateGuestPayload & UpdateRSVPPayload>) => {
    if (!eventId) {
      setError(new Error("Event not loaded. Cannot update guest/RSVP."));
      throw new Error("Event not loaded. Cannot update guest/RSVP.");
    }
    setError(null);
    try {
      return await eventService.updateGuestRsvp(isAuthenticated, eventId, guestId, payload);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to update guest/RSVP ${guestId}:`, e);
      throw e;
    }
  }, [eventId, isAuthenticated]);

  const removeGuest = useCallback(async (guestId: string) => {
    if (!eventId) {
      setError(new Error("Event not loaded. Cannot remove guest."));
      throw new Error("Event not loaded. Cannot remove guest.");
    }
    setError(null);
    try {
      await eventService.removeGuestFromEvent(isAuthenticated, eventId, guestId);
    } catch (e) {
      setError(e as Error);
      console.error(`Failed to remove guest ${guestId}:`, e);
      throw e;
    }
  }, [eventId, isAuthenticated]);

  const addScheduleItemHook = useCallback(async (payload: CreateScheduleItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try {
      return await eventService.addScheduleItem(isAuthenticated, eventId, payload);
    } catch (e) {
      console.error("Error in addScheduleItemHook", e);
      setError(e as Error);
      throw e;
    }
  }, [eventId, isAuthenticated]);

  const updateScheduleItemHook = useCallback(async (itemId: string, payload: UpdateScheduleItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try {
      return await eventService.updateScheduleItem(isAuthenticated, eventId, itemId, payload);
    } catch (e) {
      console.error("Error in updateScheduleItemHook", e);
      setError(e as Error);
      throw e;
    }
  }, [eventId, isAuthenticated]);

  const deleteScheduleItemHook = useCallback(async (itemId: string) => {
    if (!eventId) throw new Error("Event ID is required.");
    try {
      await eventService.deleteScheduleItem(isAuthenticated, eventId, itemId);
    } catch (e) {
      console.error("Error in deleteScheduleItemHook", e);
      setError(e as Error);
      throw e;
    }
  }, [eventId, isAuthenticated]);

  const addEventTaskHook = useCallback(async (payload: CreateTaskPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.addTaskToEvent(isAuthenticated, eventId, payload); }
    catch (e) { console.error("Error in addEventTaskHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const updateEventTaskHook = useCallback(async (taskId: string, payload: UpdateTaskPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.updateEventTask(isAuthenticated, eventId, taskId, payload); }
    catch (e) { console.error("Error in updateEventTaskHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const deleteEventTaskHook = useCallback(async (taskId: string) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { await eventService.deleteEventTask(isAuthenticated, eventId, taskId); }
    catch (e) { console.error("Error in deleteEventTaskHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const addBudgetItemHook = useCallback(async (payload: CreateBudgetItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.addBudgetItemToEvent(isAuthenticated, eventId, payload); }
    catch (e) { console.error("Error in addBudgetItemHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const updateBudgetItemHook = useCallback(async (itemId: string, payload: UpdateBudgetItemPayload) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { return await eventService.updateBudgetItem(isAuthenticated, eventId, itemId, payload); }
    catch (e) { console.error("Error in updateBudgetItemHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  const deleteBudgetItemHook = useCallback(async (itemId: string) => {
    if (!eventId) throw new Error("Event ID is required.");
    try { await eventService.deleteBudgetItem(isAuthenticated, eventId, itemId); }
    catch (e) { console.error("Error in deleteBudgetItemHook", e); setError(e as Error); throw e; }
  }, [eventId, isAuthenticated]);

  return {
    event,
    guests,
    schedule,
    tasks,
    budgetItems,
    ideas,
    isLoading: isLoadingEvent || isLoadingSubEntities,
    error,
    fetchEventDetails: () => eventId && fetchMainEvent(eventId),
    updateThisEvent,
    deleteThisEvent,
    addGuest,
    updateGuestAndRsvp,
    removeGuestFromEvent: removeGuest,
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
      try { return await eventService.addIdeaToEvent(isAuthenticated, eventId, payload, userId); }
      catch (e) { console.error("Error in addIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    updateIdea: useCallback(async (ideaId: string, payload: UpdateIdeaPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.updateIdea(isAuthenticated, eventId, ideaId, payload); }
      catch (e) { console.error("Error in updateIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    deleteIdea: useCallback(async (ideaId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.deleteIdea(isAuthenticated, eventId, ideaId); }
      catch (e) { console.error("Error in deleteIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    voteForIdea: useCallback(async (ideaId: string, increment: number = 1) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.voteForIdea(isAuthenticated, eventId, ideaId, increment); }
      catch (e) { console.error("Error in voteForIdeaHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    currentTheme,
    availableThemes,
    isLoadingThemes,
    setEventTheme: useCallback(async (themeId: string | null) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { 
        const success = await eventService.setEventTheme(isAuthenticated, eventId, themeId); 
        if (success) {
          const updatedTheme = await eventService.getEventTheme(isAuthenticated, eventId, user?.uid);
          setCurrentTheme(updatedTheme);
          setThemeContext(updatedTheme ?? getDefaultTheme());
          setEvent(prev => prev ? ({ ...prev, themeId: themeId ?? undefined }) : null);
        }
        return success;
      }
      catch (e) { console.error("Error in setEventThemeHook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated, user?.uid, setThemeContext]),
    fetchAvailableThemes: useCallback(async () => {
        setIsLoadingThemes(true);
        try {
            const themes = await eventService.getAvailableThemes(isAuthenticated, user?.uid || null);
            setAvailableThemes(themes);
        } catch (e) {
            console.error("Error fetching available themes in hook", e);
            setError(e as Error);
        } finally {
            setIsLoadingThemes(false);
        }
    }, [isAuthenticated, user?.uid]),
    eventWebsite,
    isLoadingWebsite,
    updateEventWebsite: useCallback(async (payload: WebsitePayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      setIsLoadingWebsite(true);
      try {
        const updatedWebsite = await eventService.updateEventWebsite(isAuthenticated, eventId, payload);
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
    eventTeams,
    createEventTeam: useCallback(async (payload: CreateEventTeamPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.createEventTeam(isAuthenticated, eventId, payload); }
      catch (e) { console.error("Error in createEventTeam hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    updateEventTeam: useCallback(async (teamId: string, payload: UpdateEventTeamPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.updateEventTeam(isAuthenticated, eventId, teamId, payload); }
      catch (e) { console.error("Error in updateEventTeam hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    deleteEventTeam: useCallback(async (teamId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.deleteEventTeam(isAuthenticated, eventId, teamId); }
      catch (e) { console.error("Error in deleteEventTeam hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    addTeamMember: useCallback(async (teamId: string, memberPayload: AddTeamMemberPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.addTeamMemberToEventTeam(isAuthenticated, eventId, teamId, memberPayload); }
      catch (e) { console.error("Error in addTeamMember hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    updateTeamMember: useCallback(async (teamId: string, userId: string, rolePayload: UpdateTeamMemberPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.updateTeamMemberInEventTeam(isAuthenticated, eventId, teamId, userId, rolePayload); }
      catch (e) { console.error("Error in updateTeamMember hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    removeTeamMember: useCallback(async (teamId: string, userId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { await eventService.removeTeamMemberFromEventTeam(isAuthenticated, eventId, teamId, userId); }
      catch (e) { console.error("Error in removeTeamMember hook", e); setError(e as Error); throw e;}
    }, [eventId, isAuthenticated]),
    eventMessages,
    sendEventMessage: useCallback(async (payload: CreateEventMessagePayload, senderId: string) => {
      if (!eventId) throw new Error("Event ID is required.");
      try { return await eventService.sendEventMessage(isAuthenticated, eventId, payload, senderId); }
      catch (e) { console.error("Error in sendEventMessage hook", e); setError(e as Error); throw e; }
    }, [eventId, isAuthenticated]),
    seatingChart,
    isLoadingSeatingChart,
    updateSeatingChart: useCallback(async (payload: UpdateSeatingChartPayload) => {
      if (!eventId) throw new Error("Event ID is required.");
      setIsLoadingSeatingChart(true);
      try {
        const updatedChart = await eventService.updateSeatingChart(isAuthenticated, eventId, payload);
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
    updateEventOverallBudgetHook: useCallback(async (budgetAmount: number) => {
      if (!eventId) {
        setError(new Error("Event not loaded. Cannot update overall budget."));
        throw new Error("Event not loaded. Cannot update overall budget.");
      }
      setError(null);
      try {
        await eventService.updateEventOverallBudget(isAuthenticated, eventId, budgetAmount);
        setEvent(prevEvent => prevEvent ? { ...prevEvent, overallBudget: budgetAmount, updatedAt: new Date().toISOString() } : null);
      } catch (e) {
        setError(e as Error);
        console.error(`Failed to update overall budget for event ${eventId}:`, e);
        throw e;
      }
    }, [eventId, isAuthenticated]),
  };
};


