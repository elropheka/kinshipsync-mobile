import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from '@firebase/firestore';
import { firestore } from './firebaseConfig';
import { handleSnapshotError } from '@/utils/firestoreListeners';
import { getEventWebsiteUrl, isValidSlug, withSlugCollisionSuffix } from '../utils/eventWebsiteUtils';
import { getUserProfileById, getUserProfileByEmail } from './userService';
import { createBudgetItemAddedNotification, createBudgetMilestoneNotification, createRsvpReceivedNotification, createGuestMilestoneNotification, createDietaryPreferenceNotification, createScheduleAddedNotification, createIdeaSubmittedNotification, createIdeaPopularNotification, createWebsitePublishedNotification, createEventInvitationNotification, createRsvpReminderNotification } from '../services/notificationService';
import { createDirectConversation, sendMessage } from './chatService';
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

const mapGuestStatusToRsvpStatus = (status?: string): 'pending' | 'accepted' | 'declined' | undefined => {
  if (!status) return 'pending';
  switch (status) {
    case 'accepted':
    case 'Attending':
      return 'accepted';
    case 'declined':
      return 'declined';
    case 'pending':
    case 'Invited':
    default:
      return 'pending';
  }
};

export const getEventsPaginated = async (
  isAuthenticated: boolean,
  limitNum: number = 10,
  lastFetchedEvent?: Event
): Promise<Event[]> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log('Service: Fetching paginated events from Firestore...');
  const eventsColRef = collection(firestore, 'events');
  let q;

  if (lastFetchedEvent?.createdAt) {
    const lastTimestamp = Timestamp.fromDate(new Date(lastFetchedEvent.createdAt));
    q = query(
      eventsColRef,
      orderBy('createdAt', 'desc'),
      startAfter(lastTimestamp),
      limit(limitNum)
    );
  } else {
    q = query(eventsColRef, orderBy('createdAt', 'desc'), limit(limitNum));
  }

  try {
    const querySnapshot = await getDocs(q);
    const eventsPromises = querySnapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      let totalAttendees = 0;
      let guestEmails: string[] = [];
      try {
        const guestsColRef = collection(firestore, 'events', docSnap.id, 'guests');
        const guestsSnapshot = await getDocs(guestsColRef);
        guestsSnapshot.forEach((guestDoc) => {
          const guestData = guestDoc.data() as Guest;
          totalAttendees += 1 + (guestData.plusOnes || 0);
          if (guestData.email) {
            guestEmails.push(guestData.email);
          }
        });
      } catch (guestError) {
        console.error(`Error fetching guests for event ${docSnap.id}:`, guestError);
      }

      const allowedUserIds = Array.isArray(data.allowedUserIds) ? data.allowedUserIds : [];
      const searchableKeywords = Array.isArray(data.searchableKeywords) ? data.searchableKeywords : [];
      
      return {
        id: docSnap.id,
        name: data.name,
        name_lowercase: data.name_lowercase,
        description: data.description,
        date: data.date,
        time: data.time,
        endDate: data.endDate,
        endTime: data.endTime,
        location: data.location,
        organizerId: data.organizerId,
        themeId: data.themeId,
        visibility: data.visibility,
        allowedUserIds,
        status: data.status,
        coverImageUrl: data.coverImageUrl,
        website: data.website,
        searchableKeywords,
        overallBudget: data.overallBudget,
        totalAttendees,
        guestEmails,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as Event;
    });
    const events = await Promise.all(eventsPromises);
    return events;
  } catch (error) {
    console.error("Error fetching paginated events:", error);
    throw error;
  }
};

export const getEventById = async (isAuthenticated: boolean, eventId: string): Promise<Event | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  console.log(`Service: Fetching event with id ${eventId} from Firestore...`);
  try {
    const eventDocRef = doc(firestore, 'events', eventId);
    const docSnap = await getDoc(eventDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const allowedUserIds = Array.isArray(data.allowedUserIds) ? data.allowedUserIds : [];
      const teamIds = Array.isArray(data.teamIds) ? data.teamIds : [];
      const searchableKeywords = Array.isArray(data.searchableKeywords) ? data.searchableKeywords : [];
      
      return {
        id: docSnap.id,
        ...data,
        allowedUserIds,
        teamIds,
        searchableKeywords,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as Event;
    } else {
      console.log(`Event ${eventId} not found.`);
      return null;
    }
  } catch (error) {
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
    const eventsColRef = collection(firestore, 'events');
    const keywords = generateKeywords(payload.name, payload.description, payload.location);
    const allowedUserIds = Array.isArray(payload.allowedUserIds) ? payload.allowedUserIds : [];
    
    const newEventData = {
      ...payload,
      organizerId,
      visibility: payload.visibility,
      allowedUserIds,
      searchableKeywords: keywords,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(eventsColRef, newEventData);
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created event.");
    const data = createdDoc.data();
    const teamIds = Array.isArray(data.teamIds) ? data.teamIds : [];
    const searchableKeywords = Array.isArray(data.searchableKeywords) ? data.searchableKeywords : [];
    
    return {
      id: createdDoc.id,
      name: data.name,
      date: data.date,
      description: data.description,
      time: data.time,
      location: data.location,
      organizerId: data.organizerId,
      themeId: data.themeId,
      teamIds,
      overallBudget: data.overallBudget,
      visibility: data.visibility,
      allowedUserIds,
      coverImageUrl: data.coverImageUrl,
      searchableKeywords,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Event;
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
    const eventDocRef = doc(firestore, 'events', eventId);
    
    if (currentUserId) {
      const currentEventSnap = await getDoc(eventDocRef);
      if (currentEventSnap.exists()) {
        const currentEventData = currentEventSnap.data();
        if (currentEventData.organizerId !== currentUserId) {
          throw new Error("Only the event organizer can update this event.");
        }
      } else {
        throw new Error("Event not found.");
      }
    }
    
    const updateData: any = { ...payload, updatedAt: serverTimestamp() };

    if (payload.name || payload.description || payload.location) {
      const currentEventSnap = await getDoc(eventDocRef);
      if (currentEventSnap.exists()) {
        const currentEventData = currentEventSnap.data();
        const newName = payload.name ?? currentEventData.name;
        const newDescription = payload.description ?? currentEventData.description;
        const newLocation = payload.location ?? currentEventData.location;
        updateData.searchableKeywords = generateKeywords(newName, newDescription, newLocation);
      }
    }

    await updateDoc(eventDocRef, updateData);
    const updatedDoc = await getDoc(eventDocRef);
    if (!updatedDoc.exists()) return null;
    const data = updatedDoc.data();
    const allowedUserIds = Array.isArray(data.allowedUserIds) ? data.allowedUserIds : [];
    const teamIds = Array.isArray(data.teamIds) ? data.teamIds : [];
    const searchableKeywords = Array.isArray(data.searchableKeywords) ? data.searchableKeywords : [];
    
    return {
      id: updatedDoc.id,
      ...data,
      allowedUserIds,
      teamIds,
      searchableKeywords,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Event;
  } catch (error) {
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
    const eventDocRef = doc(firestore, 'events', eventId);
    await deleteDoc(eventDocRef);
    console.log(`Event ${eventId} deleted successfully. Subcollections require server-side deletion (e.g., Cloud Function).`);
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
    const eventDocRef = doc(firestore, 'events', eventId);
    await updateDoc(eventDocRef, {
      overallBudget: budgetAmount,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating event overall budget:", error);
    throw error;
  }
};

export const listenToGuestsWithRsvp = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (guests: Guest[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to guests.");
    return () => { console.warn("Attempted to listen to guests while unauthenticated."); };
  }
  if (!eventId) {
    console.error("listenToGuestsWithRsvp: Event ID is required.");
    return () => {};
  }
  const guestsColRef = collection(firestore, 'events', eventId, 'guests');
  const q = query(guestsColRef, orderBy('name'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const guests: Guest[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const [firstName = '', lastName = ''] = (data.name || '').split(' ');
      guests.push({
        id: docSnap.id,
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
        addedAt: data.addedAt ? (data.addedAt as Timestamp).toDate().toISOString() : new Date().toISOString(),
        rsvpUpdatedAt: data.rsvpUpdatedAt ? (data.rsvpUpdatedAt as Timestamp).toDate().toISOString() : undefined,
      } as Guest);
    });
    callback(guests);
  }, (error) => handleSnapshotError(error, onError, 'Error listening to guests'));

  return unsubscribe;
};

export const addGuestToEvent = async (isAuthenticated: boolean, eventId: string, payload: CreateGuestPayload): Promise<Guest> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required to add a guest.");
  
  let guestDocRef;

  try {
    const guestsColRef = collection(firestore, 'events', eventId, 'guests');
    // Filter out undefined values from payload to avoid Firestore errors
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );
    const newGuestData = {
      ...cleanedPayload,
      eventId,
      addedAt: serverTimestamp(),
      status: payload.status || 'Invited',
    };
    guestDocRef = await addDoc(guestsColRef, newGuestData);
    const createdGuestId = guestDocRef.id;

    const event = await getEventById(isAuthenticated, eventId);
    if (!event) {
      console.error(`addGuestToEvent: Event ${eventId} not found. Cannot send notifications.`);
      return { id: createdGuestId, ...newGuestData, addedAt: new Date().toISOString() } as Guest;
    }

    let organizerName = 'The Event Organizer';
    if (event.organizerId) {
      const organizerProfile = await getUserProfileById(event.organizerId);
      if (organizerProfile?.displayName) {
        organizerName = organizerProfile.displayName;
      }
    }

    // Send event invitation notifications (in-app, email, SMS)
    createEventInvitationNotification(
      payload.email,
      payload.name,
      payload.phone,
      event.name,
      event.date,
      event.time,
      event.location,
      organizerName,
      eventId
    ).catch(error => {
      console.error('Error sending event invitation notifications:', error);
      // Don't throw - guest was created successfully, notification failure is non-critical
    });

    console.log(`Guest ${createdGuestId} added and invitation notifications sent for event ${eventId}.`);

    return {
      id: createdGuestId,
      ...newGuestData,
      addedAt: new Date().toISOString()
    } as Guest;

  } catch (error) {
    console.error("Error adding guest to event and triggering notifications:", error);
    if (guestDocRef) {
      console.warn("Guest was created, but notification trigger failed. Guest ID:", guestDocRef.id);
      const guestDataFallback = (await getDoc(guestDocRef)).data();
      return { id: guestDocRef.id, ...guestDataFallback, addedAt: new Date().toISOString() } as Guest;
    }
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
    const event = await getEventById(isAuthenticated, eventId);
    if (!event) {
      console.error(`sendRsvpReminderToGuest: Event ${eventId} not found.`);
      throw new Error(`Event ${eventId} not found.`);
    }

    const guestDocRef = doc(firestore, 'events', eventId, 'guests', guestId);
    const guestSnap = await getDoc(guestDocRef);
    if (!guestSnap.exists()) {
      console.error(`sendRsvpReminderToGuest: Guest ${guestId} not found for event ${eventId}.`);
      throw new Error(`Guest ${guestId} not found.`);
    }
    const guest = { id: guestSnap.id, ...guestSnap.data() } as Guest;

    let organizerName = 'The Event Organizer';
    if (event.organizerId) {
      const organizerProfile = await getUserProfileById(event.organizerId);
      if (organizerProfile?.displayName) {
        organizerName = organizerProfile.displayName;
      }
    }

    // Send email, SMS, and in-app notifications
    await createRsvpReminderNotification(
      guest.email,
      guest.name,
      guest.phone,
      event.name,
      event.date,
      event.time,
      event.location,
      organizerName,
      eventId
    ).catch(error => {
      console.error('Error sending RSVP reminder notifications:', error);
      // Don't throw - continue with chat message even if notifications fail
    });

    // Send chat message if guest is a registered user and organizer is available
    if (guest.email && event.organizerId) {
      try {
        const guestUser = await getUserProfileByEmail(guest.email);
        if (guestUser?.userId && guestUser.userId !== event.organizerId) {
          console.log(`Guest ${guest.email} is a registered user, sending chat message...`);
          
          try {
            const conversation = await createDirectConversation(isAuthenticated, event.organizerId, {
              recipientId: guestUser.userId,
            });

            if (conversation) {
              const reminderContent = `Reminder: Please RSVP for ${event.name} on ${event.date}${event.time ? ` at ${event.time}` : ''}${event.location ? ` (${event.location})` : ''}.`;
              await sendMessage(isAuthenticated, {
                conversationId: conversation.id,
                content: reminderContent,
                contentType: 'eventInvitation',
                eventId: eventId,
                guestId: guest.id,
                eventName: event.name,
                rsvpStatus: mapGuestStatusToRsvpStatus(guest.status),
              }, event.organizerId);
              console.log(`RSVP reminder chat message sent to ${guestUser.displayName || guestUser.email}`);
            }
          } catch (chatError: any) {
            console.error(`Failed to send RSVP reminder chat message:`, chatError.message);
            // Don't throw - chat message failure is non-critical
          }
        } else if (guestUser?.userId === event.organizerId) {
          console.log("Guest is the event organizer, no chat message sent.");
        } else {
          console.log(`Guest with email ${guest.email} is not a registered user. No chat message sent.`);
        }
      } catch (userLookupError: any) {
        console.error(`Error looking up guest user for chat message:`, userLookupError.message);
        // Don't throw - user lookup failure is non-critical
      }
    }

    console.log(`RSVP reminder sent successfully for guest ${guestId} for event ${eventId}.`);
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
    const guestDocRef = doc(firestore, 'events', eventId, 'guests', guestId);
    // Filter out undefined values from payload to avoid Firestore errors
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );
    const updateData = { ...cleanedPayload };
    if (payload.status) {
      (updateData as any).rsvpUpdatedAt = serverTimestamp();
    }
    await updateDoc(guestDocRef, updateData);
    
    const updatedDocSnap = await getDoc(guestDocRef);
    if (!updatedDocSnap.exists()) return null;

    const firestoreData = updatedDocSnap.data();
    const { name, status, email, phone, notes, plusOnes, addedAt: addedAtTimestamp, rsvpUpdatedAt: rsvpUpdatedAtTimestamp } = firestoreData as Omit<Guest, 'id' | 'eventId' | 'addedAt' | 'rsvpUpdatedAt'> & { addedAt?: Timestamp, rsvpUpdatedAt?: Timestamp };
    
    const event = await getEventById(isAuthenticated, eventId);
    if (event && payload.status) {
      createRsvpReceivedNotification(event.organizerId, name, payload.status, event.name, eventId);
    }

    const guestsSnapshot = await getDocs(collection(firestore, 'events', eventId, 'guests'));
    const confirmedGuests = guestsSnapshot.docs.filter(doc => {
      const guestData = doc.data() as Guest;
      return guestData.status === 'accepted';
    }).length;
    if (event && (confirmedGuests === 10 || confirmedGuests === 25 || confirmedGuests === 50)) {
      createGuestMilestoneNotification(event.organizerId, event.name, confirmedGuests, eventId);
    }
    if (event && payload.dietaryRestrictions) {
      createDietaryPreferenceNotification(event.organizerId, name, event.name, eventId);
    }

    const [defaultFirstName = '', defaultLastName = ''] = (name || '').split(' ');
    return {
      id: updatedDocSnap.id,
      eventId,
      name: name,
      firstName: firestoreData.firstName || defaultFirstName,
      lastName: firestoreData.lastName || defaultLastName,
      status: status,
      email: email,
      phone: phone,
      notes: notes,
      plusOnes: plusOnes,
      addedAt: addedAtTimestamp ? addedAtTimestamp.toDate().toISOString() : new Date().toISOString(),
      rsvpUpdatedAt: rsvpUpdatedAtTimestamp ? rsvpUpdatedAtTimestamp.toDate().toISOString() : undefined
    } as Guest;
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
    const guestDocRef = doc(firestore, 'events', eventId, 'guests', guestId);
    await deleteDoc(guestDocRef);
  } catch (error) {
    console.error("Error removing guest:", error);
    throw error;
  }
};

export const listenToSchedule = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (schedule: ScheduleItem[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to schedule.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToSchedule: Event ID is required.");
    return () => {};
  }
  const scheduleColRef = collection(firestore, 'events', eventId, 'schedule');
  const q = query(scheduleColRef, orderBy('startTime'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const scheduleItems: ScheduleItem[] = [];
    querySnapshot.forEach((docSnap) => {
      scheduleItems.push({
        id: docSnap.id,
        eventId,
        ...(docSnap.data() as Omit<ScheduleItem, 'id' | 'eventId'>),
      });
    });
    callback(scheduleItems);
  }, (error) => handleSnapshotError(error, onError, 'Error listening to schedule'));

  return unsubscribe;
};

export const getEventTheme = async (isAuthenticated: boolean, eventId: string, userId?: string): Promise<Theme | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    const eventDocRef = doc(firestore, 'events', eventId);
    const eventSnap = await getDoc(eventDocRef);
    if (!eventSnap.exists()) {
      console.log(`Event ${eventId} not found.`);
      return null;
    }
    
    const themeId = eventSnap.data().themeId;
    if (!themeId) return null;
    
    const themeDocRef = doc(firestore, 'themes', themeId);
    const themeSnap = await getDoc(themeDocRef);
    if (!themeSnap.exists()) return null;
    
    return {
      id: themeSnap.id,
      ...themeSnap.data()
    } as Theme;
  } catch (error) {
    console.error(`Error fetching theme for event ${eventId}:`, error);
    throw error;
  }
};

export const listenToEventTasks = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (tasks: Task[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to tasks.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToEventTasks: Event ID is required.");
    return () => {};
  }
  const tasksColRef = collection(firestore, 'events', eventId, 'tasks');
  const q = query(tasksColRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tasks: Task[] = [];
    querySnapshot.forEach((docSnap) => {
      tasks.push({
        id: docSnap.id,
        eventId,
        ...(docSnap.data() as Omit<Task, 'id' | 'eventId'>),
      });
    });
    callback(tasks);
  }, (error) => handleSnapshotError(error, onError, 'Error listening to tasks'));

  return unsubscribe;
};

export const listenToBudgetItems = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (budgetItems: BudgetItem[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to budget items.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToBudgetItems: Event ID is required.");
    return () => {};
  }
  const budgetColRef = collection(firestore, 'events', eventId, 'budgetItems');
  const q = query(budgetColRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const items: BudgetItem[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        eventId,
        ...(docSnap.data() as Omit<BudgetItem, 'id' | 'eventId'>),
      });
    });
    callback(items);
  }, (error) => handleSnapshotError(error, onError, 'Error listening to budget items'));

  return unsubscribe;
};

export const listenToIdeas = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (ideas: Idea[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to ideas.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToIdeas: Event ID is required.");
    return () => {};
  }
  const ideasColRef = collection(firestore, 'events', eventId, 'ideas');
  const q = query(ideasColRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const ideas: Idea[] = [];
    querySnapshot.forEach((docSnap) => {
      ideas.push({
        id: docSnap.id,
        eventId,
        ...(docSnap.data() as Omit<Idea, 'id' | 'eventId'>),
      });
    });
    callback(ideas);
  }, (error) => handleSnapshotError(error, onError, 'Error listening to ideas'));

  return unsubscribe;
};

export const listenToEventTeams = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (teams: EventTeam[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to teams.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToEventTeams: Event ID is required.");
    return () => {};
  }
  const teamsColRef = collection(firestore, 'events', eventId, 'teams');
  const q = query(teamsColRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const teams: EventTeam[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<EventTeam, 'id' | 'eventId'>;
      teams.push({
        id: docSnap.id,
        eventId,
        ...data,
        members: data.members ?? [],
      });
    });
    callback(teams);
  }, (error) => handleSnapshotError(error, onError, 'Error listening to teams'));

  return unsubscribe;
};

export const listenToEventMessages = (
  isAuthenticated: boolean,
  eventId: string,
  callback: (messages: EventMessage[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!isAuthenticated) {
    console.error("User not authenticated. Cannot listen to messages.");
    return () => {};
  }
  if (!eventId) {
    console.error("listenToEventMessages: Event ID is required.");
    return () => {};
  }
  const messagesColRef = collection(firestore, 'events', eventId, 'messages');
  const q = query(messagesColRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: EventMessage[] = [];
    querySnapshot.forEach((docSnap) => {
      messages.push({
        id: docSnap.id,
        eventId,
        ...(docSnap.data() as Omit<EventMessage, 'id' | 'eventId'>),
      });
    });
    callback(messages);
  }, (error) => handleSnapshotError(error, onError, 'Error listening to event messages'));

  return unsubscribe;
};

export const getAvailableThemes = async (isAuthenticated: boolean, userId: string | null): Promise<Theme[]> => {
  try {
    console.log('getAvailableThemes called', { isAuthenticated, userId });
    
    if (!isAuthenticated) {
      try {
        const { predefinedThemes } = await import('../constants/themes');
        console.log('Returning predefined themes for unauthenticated user:', predefinedThemes.length);
        return predefinedThemes;
      } catch (importError) {
        console.error('Error importing predefined themes:', importError);
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
      console.log('Fetching themes from Firestore...');
      const themesColRef = collection(firestore, 'themes');
      const q = query(themesColRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const themes: Theme[] = [];
      querySnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          const theme: Theme = {
            id: doc.id,
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
          };
          themes.push(theme);
        } catch (themeError) {
          console.error('Error processing theme from Firestore:', themeError, doc.id);
        }
      });
      
      try {
        const { predefinedThemes } = await import('../constants/themes');
        const result = [...predefinedThemes, ...themes];
        console.log('Returning combined themes:', result.length);
        return result;
      } catch (importError) {
        console.error('Error importing predefined themes for authenticated user:', importError);
        return themes;
      }
    } catch (firestoreError) {
      console.error("Error fetching themes from Firestore:", firestoreError);
      try {
        const { predefinedThemes } = await import('../constants/themes');
        console.log('Fallback to predefined themes due to Firestore error');
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
    const eventDocRef = doc(firestore, 'events', eventId);
    await updateDoc(eventDocRef, {
      themeId: themeId,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error setting theme for event ${eventId}:`, error);
    throw error;
  }
};

export const checkSlugAvailability = async (
  isAuthenticated: boolean,
  slug: string,
  excludeEventId?: string,
): Promise<boolean> => {
  if (!isAuthenticated) {
    throw new Error('User not authenticated. Please sign in.');
  }
  if (!slug || !isValidSlug(slug)) {
    return false;
  }

  const eventsRef = collection(firestore, 'events');
  const slugQuery = query(eventsRef, where('website.customUrlSlug', '==', slug));
  const snapshot = await getDocs(slugQuery);

  if (snapshot.empty) {
    return true;
  }

  if (excludeEventId) {
    return snapshot.docs.every((docSnapshot) => docSnapshot.id === excludeEventId);
  }

  return false;
};

export const resolveUniqueWebsiteSlug = async (
  isAuthenticated: boolean,
  baseSlug: string,
  excludeEventId?: string,
): Promise<string> => {
  let attempt = 1;
  let candidate = baseSlug;

  while (attempt <= 20) {
    const isAvailable = await checkSlugAvailability(isAuthenticated, candidate, excludeEventId);
    if (isAvailable) {
      return candidate;
    }
    attempt += 1;
    candidate = withSlugCollisionSuffix(baseSlug, attempt);
  }

  throw new Error('Unable to generate a unique website URL. Please try a different slug.');
};

export const getEventWebsite = async (isAuthenticated: boolean, eventId: string): Promise<WebsitePayload | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Please sign in.");
  }
  if (!eventId) throw new Error("Event ID is required.");
  
  try {
    const websiteDocRef = doc(firestore, 'events', eventId, 'website', 'details');
    const websiteSnap = await getDoc(websiteDocRef);
    if (!websiteSnap.exists()) return null;
    
    const data = websiteSnap.data();
    return {
      id: websiteSnap.id,
      published: data?.published ?? false,
      title: data?.title,
      customUrlSlug: data?.customUrlSlug,
      headerImageUrl: data?.headerImageUrl,
      welcomeMessage: data?.welcomeMessage,
      sections: data?.sections ?? [],
      websiteThemeId: data?.websiteThemeId,
      updatedAt: data?.updatedAt ? (data.updatedAt as Timestamp).toDate().toISOString() : new Date().toISOString()
    } as WebsitePayload;
  } catch (error) {
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
    const websiteDocRef = doc(firestore, 'events', eventId, 'website', 'details');
    // Filter out undefined values as Firebase doesn't support them
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );
    await setDoc(websiteDocRef, {
      ...cleanedPayload,
      updatedAt: serverTimestamp()
    }, { merge: true });

    if (cleanedPayload.customUrlSlug !== undefined || cleanedPayload.published !== undefined) {
      const eventDocRef = doc(firestore, 'events', eventId);
      const eventSnap = await getDoc(eventDocRef);
      const existingWebsite = eventSnap.data()?.website ?? {};
      await updateDoc(eventDocRef, {
        website: {
          ...existingWebsite,
          ...(cleanedPayload.customUrlSlug !== undefined && {
            customUrlSlug: cleanedPayload.customUrlSlug,
          }),
          ...(cleanedPayload.published !== undefined && {
            published: cleanedPayload.published,
          }),
        },
        updatedAt: serverTimestamp(),
      });
    }

    const updatedDoc = await getDoc(websiteDocRef);
    if (!updatedDoc.exists()) return null;

    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      published: data?.published ?? false,
      title: data?.title,
      customUrlSlug: data?.customUrlSlug,
      headerImageUrl: data?.headerImageUrl,
      welcomeMessage: data?.welcomeMessage,
      sections: data?.sections ?? [],
      websiteThemeId: data?.websiteThemeId,
      updatedAt: data?.updatedAt ? (data.updatedAt as Timestamp).toDate().toISOString() : new Date().toISOString()
    } as WebsitePayload;
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
    const tasksColRef = collection(firestore, 'events', eventId, 'tasks');
    const newTaskData = {
      ...payload,
      eventId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: payload.status || 'pending',
      searchableKeywords: generateKeywords(payload.title, payload.description),
    };
    const docRef = await addDoc(tasksColRef, newTaskData);
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created task.");
    
    const data = createdDoc.data();
    return {
      id: createdDoc.id,
      eventId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      assignedToUserIds: data.assignedToUserIds,
      completed: data.completed,
      category: data.category,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      searchableKeywords: data.searchableKeywords,
    } as Task;
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
    const taskDocRef = doc(firestore, 'events', eventId, 'tasks', taskId);
    const updateData = {
      ...payload,
      updatedAt: serverTimestamp(),
    };
    if (payload.title || payload.description) {
      updateData.searchableKeywords = generateKeywords(
        payload.title || (await getDoc(taskDocRef)).data()?.title || '',
        payload.description || (await getDoc(taskDocRef)).data()?.description || ''
      );
    }
    await updateDoc(taskDocRef, updateData);
    
    const updatedDoc = await getDoc(taskDocRef);
    if (!updatedDoc.exists()) throw new Error("Task not found after update.");
    
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      eventId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      assignedToUserIds: data.assignedToUserIds,
      completed: data.completed,
      category: data.category,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      searchableKeywords: data.searchableKeywords,
    } as Task;
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
    const taskDocRef = doc(firestore, 'events', eventId, 'tasks', taskId);
    await deleteDoc(taskDocRef);
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
    const ideasColRef = collection(firestore, 'events', eventId, 'ideas');
    const newIdeaData = {
      ...payload,
      eventId,
      createdBy: userId,
      createdAt: serverTimestamp(),
      votes: 0,
      status: 'pending',
    };
    const docRef = await addDoc(ideasColRef, newIdeaData);
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created idea.");
    
    const data = createdDoc.data();
    const event = await getEventById(isAuthenticated, eventId);
    if (event) {
      createIdeaSubmittedNotification(event.organizerId, payload.title, event.name, eventId);
    }

    return {
      id: createdDoc.id,
      eventId,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category,
      status: data.status,
      createdBy: data.createdBy,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      votes: data.votes,
      submitterName: data.submitterName,
    } as Idea;
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
    const ideaDocRef = doc(firestore, 'events', eventId, 'ideas', ideaId);
    await updateDoc(ideaDocRef, payload);
    
    const updatedDoc = await getDoc(ideaDocRef);
    if (!updatedDoc.exists()) throw new Error("Idea not found after update.");
    
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      eventId,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category,
      status: data.status,
      createdBy: data.createdBy,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      votes: data.votes,
      submitterName: data.submitterName,
    } as Idea;
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
    const ideaDocRef = doc(firestore, 'events', eventId, 'ideas', ideaId);
    await deleteDoc(ideaDocRef);
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
    const ideaDocRef = doc(firestore, 'events', eventId, 'ideas', ideaId);
    const ideaSnap = await getDoc(ideaDocRef);
    if (!ideaSnap.exists()) throw new Error("Idea not found.");
    
    const currentVotes = ideaSnap.data().votes || 0;
    const newVotes = currentVotes + increment;
    
    await updateDoc(ideaDocRef, { votes: newVotes });
    
    const event = await getEventById(isAuthenticated, eventId);
    if (event && newVotes >= 10) {
      createIdeaPopularNotification(event.organizerId, ideaSnap.data().title, event.name, newVotes, eventId);
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
    const seatingChartDocRef = doc(firestore, 'events', eventId, 'seatingChart', 'current');
    const seatingChartSnap = await getDoc(seatingChartDocRef);
    if (!seatingChartSnap.exists()) return null;
    
    const data = seatingChartSnap.data();
    return {
      id: seatingChartSnap.id,
      eventId,
      tables: data.tables || [],
      lastUpdated: (data.lastUpdated as Timestamp)?.toDate().toISOString() || new Date().toISOString()
    } as SeatingChart;
  } catch (error) {
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
    const seatingChartDocRef = doc(firestore, 'events', eventId, 'seatingChart', 'current');
    await setDoc(seatingChartDocRef, {
      tables: payload.tables,
      lastUpdated: serverTimestamp()
    }, { merge: true });

    const updatedDoc = await getDoc(seatingChartDocRef);
    if (!updatedDoc.exists()) throw new Error("Failed to retrieve updated seating chart.");
    
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      eventId,
      tables: data.tables || [],
      lastUpdated: (data.lastUpdated as Timestamp)?.toDate().toISOString() || new Date().toISOString()
    } as SeatingChart;
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
    const scheduleColRef = collection(firestore, 'events', eventId, 'schedule');
    const newScheduleData = {
      ...payload,
      eventId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(scheduleColRef, newScheduleData);
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created schedule item.");
    
    const data = createdDoc.data();
    const event = await getEventById(isAuthenticated, eventId);
    if (event) {
      createScheduleAddedNotification(event.organizerId, payload.title, event.name, eventId);
    }

    return {
      id: createdDoc.id,
      eventId,
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      description: data.description,
      assignedTo: data.assignedTo,
    } as ScheduleItem;
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
    const itemDocRef = doc(firestore, 'events', eventId, 'schedule', itemId);
    await updateDoc(itemDocRef, {
      ...payload,
      updatedAt: serverTimestamp(),
    });
    
    const updatedDoc = await getDoc(itemDocRef);
    if (!updatedDoc.exists()) throw new Error("Schedule item not found after update.");
    
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      eventId,
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      description: data.description,
      assignedTo: data.assignedTo,
    } as ScheduleItem;
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
    const itemDocRef = doc(firestore, 'events', eventId, 'schedule', itemId);
    await deleteDoc(itemDocRef);
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
    const teamsColRef = collection(firestore, 'events', eventId, 'teams');
    const newTeamData = {
      ...payload,
      eventId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(teamsColRef, newTeamData);
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created team.");
    
    const data = createdDoc.data();
    return {
      id: createdDoc.id,
      eventId,
      name: data.name,
      description: data.description,
      members: data.members,
    } as EventTeam;
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
    const teamDocRef = doc(firestore, 'events', eventId, 'teams', teamId);
    await updateDoc(teamDocRef, {
      ...payload,
      updatedAt: serverTimestamp(),
    });
    
    const updatedDoc = await getDoc(teamDocRef);
    if (!updatedDoc.exists()) throw new Error("Team not found after update.");
    
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      eventId,
      name: data.name,
      description: data.description,
      members: data.members,
    } as EventTeam;
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
    const teamDocRef = doc(firestore, 'events', eventId, 'teams', teamId);
    await deleteDoc(teamDocRef);
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
    const teamDocRef = doc(firestore, 'events', eventId, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);
    if (!teamSnap.exists()) throw new Error("Team not found.");
    
    const currentMembers = teamSnap.data().members || [];
    if (currentMembers.some((m: TeamMember) => m.userId === memberPayload.userId)) {
      throw new Error("Member already exists in team.");
    }
    
    await updateDoc(teamDocRef, {
      members: arrayUnion(memberPayload),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
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
    const teamDocRef = doc(firestore, 'events', eventId, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);
    if (!teamSnap.exists()) throw new Error("Team not found.");
    
    const currentMembers = teamSnap.data().members || [];
    const updatedMembers = currentMembers.map((member: TeamMember) => {
      if (member.userId === userId) {
        return { ...member, ...rolePayload };
      }
      return member;
    });
    
    await updateDoc(teamDocRef, {
      members: updatedMembers,
      updatedAt: serverTimestamp(),
    });
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
    const teamDocRef = doc(firestore, 'events', eventId, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);
    if (!teamSnap.exists()) throw new Error("Team not found.");
    
    const currentMembers = teamSnap.data().members || [];
    const memberToRemove = currentMembers.find((m: TeamMember) => m.userId === userId);
    if (memberToRemove) {
      await updateDoc(teamDocRef, {
        members: arrayRemove(memberToRemove),
        updatedAt: serverTimestamp(),
      });
    }
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
    const messagesColRef = collection(firestore, 'events', eventId, 'messages');
    const newMessageData = {
      ...payload,
      eventId,
      sender: senderId,
      timestamp: serverTimestamp(),
    };
    const docRef = await addDoc(messagesColRef, newMessageData);
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created message.");
    
    const data = createdDoc.data();
    return {
      id: createdDoc.id,
      eventId,
      sender: data.sender,
      content: data.content,
      timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      type: data.type,
    } as EventMessage;
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
    const itemDocRef = doc(firestore, 'events', eventId, 'budgetItems', itemId);
    await updateDoc(itemDocRef, {
      ...payload,
      updatedAt: serverTimestamp(),
    });
    
    const updatedDoc = await getDoc(itemDocRef);
    if (!updatedDoc.exists()) throw new Error("Budget item not found after update.");
    
    const data = updatedDoc.data();
    return {
      id: updatedDoc.id,
      eventId: data.eventId,
      itemName: data.itemName,
      category: data.category,
      estimatedCost: data.estimatedCost,
      actualCost: data.actualCost,
      paid: data.paid,
      notes: data.notes,
      linkedVendorId: data.linkedVendorId,
      manualVendorName: data.manualVendorName,
      linkedVendorItemId: data.linkedVendorItemId,
    } as BudgetItem;
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
    const itemDocRef = doc(firestore, 'events', eventId, 'budgetItems', itemId);
    await deleteDoc(itemDocRef);
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
    const websiteDocRef = doc(firestore, 'events', eventId, 'website', 'details');
    await updateDoc(websiteDocRef, {
      published: true,
      updatedAt: serverTimestamp(),
    });

    const eventDocRef = doc(firestore, 'events', eventId);
    const eventSnap = await getDoc(eventDocRef);
    const existingWebsite = eventSnap.data()?.website ?? {};
    await updateDoc(eventDocRef, {
      website: { ...existingWebsite, published: true },
      updatedAt: serverTimestamp(),
    });

    const event = await getEventById(isAuthenticated, eventId);
    const websiteDetails = await getEventWebsite(isAuthenticated, eventId);
    if (event && websiteDetails?.customUrlSlug) {
      createWebsitePublishedNotification(
        event.organizerId,
        event.name,
        getEventWebsiteUrl(websiteDetails.customUrlSlug),
        eventId,
      );
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
    const websiteDocRef = doc(firestore, 'events', eventId, 'website', 'details');
    await updateDoc(websiteDocRef, {
      published: false,
      updatedAt: serverTimestamp(),
    });

    const eventDocRef = doc(firestore, 'events', eventId);
    const eventSnap = await getDoc(eventDocRef);
    const existingWebsite = eventSnap.data()?.website ?? {};
    await updateDoc(eventDocRef, {
      website: { ...existingWebsite, published: false },
      updatedAt: serverTimestamp(),
    });
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
    const eventsRef = collection(firestore, 'events');
    const eventsSnapshot = await getDocs(eventsRef);
    const eventDoc = eventsSnapshot.docs.find((docSnapshot) => {
      const data = docSnapshot.data();
      return data.website?.customUrlSlug === slug;
    });

    if (!eventDoc) return null;

    const data = eventDoc.data();
    return {
      id: eventDoc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    } as Event;
  } catch (error) {
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
    const budgetColRef = collection(firestore, 'events', eventId, 'budgetItems');
    
    const firestoreData: Record<string, any> = {
      eventId,
      itemName: payload.itemName,
      estimatedCost: payload.estimatedCost,
      paid: payload.paid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (payload.category !== undefined && payload.category !== null) firestoreData.category = payload.category;
    if (payload.actualCost !== undefined) firestoreData.actualCost = payload.actualCost; else if (payload.hasOwnProperty('actualCost')) firestoreData.actualCost = null;
    if (payload.notes !== undefined && payload.notes !== null) firestoreData.notes = payload.notes;
    if (payload.linkedVendorId !== undefined) firestoreData.linkedVendorId = payload.linkedVendorId;
    if (payload.manualVendorName !== undefined && payload.manualVendorName !== null) firestoreData.manualVendorName = payload.manualVendorName;
    if (payload.linkedVendorItemId !== undefined) firestoreData.linkedVendorItemId = payload.linkedVendorItemId;

    const docRef = await addDoc(budgetColRef, firestoreData);
    const createdDoc = await getDoc(docRef);
    if (!createdDoc.exists()) throw new Error("Failed to retrieve created budget item.");
    
    const dataFromDB = createdDoc.data();
    if (!dataFromDB) throw new Error("Budget item data not found after creation.");

    if (dataFromDB.linkedVendorId) {
      try {
        const vendorDocRef = doc(firestore, 'vendors', dataFromDB.linkedVendorId);
        await updateDoc(vendorDocRef, {
          associatedEventIds: arrayUnion(eventId)
        });
        console.log(`Associated event ${eventId} with vendor ${dataFromDB.linkedVendorId}`);
      } catch (vendorUpdateError) {
        console.error(`Failed to associate event with vendor ${dataFromDB.linkedVendorId}:`, vendorUpdateError);
      }
    }

    const event = await getEventById(isAuthenticated, eventId);
    if (event) {
      createBudgetItemAddedNotification(event.organizerId, payload.itemName, event.name, eventId);
    }

    const budgetItems = await getDocs(collection(firestore, 'events', eventId, 'budgetItems'));
    const totalEstimatedCost = budgetItems.docs.reduce((sum, doc) => sum + (doc.data() as BudgetItem).estimatedCost, 0);
    if (event && event.overallBudget && totalEstimatedCost > 0) {
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

    return {
      id: createdDoc.id,
      eventId: dataFromDB.eventId,
      itemName: dataFromDB.itemName,
      category: dataFromDB.category,
      estimatedCost: dataFromDB.estimatedCost,
      actualCost: dataFromDB.actualCost,
      paid: dataFromDB.paid,
      notes: dataFromDB.notes,
      linkedVendorId: dataFromDB.linkedVendorId,
      manualVendorName: dataFromDB.manualVendorName,
      linkedVendorItemId: dataFromDB.linkedVendorItemId,
    } as BudgetItem;
  } catch (error) {
    console.error("Error adding budget item:", error);
    throw error;
  }
};
