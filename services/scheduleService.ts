import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  where, // Import where if needed for more complex queries, though not used in this basic setup
} from '@firebase/firestore';
import { firestore } from './firebaseConfig';
import { Schedule, ScheduleFormData } from '../types/scheduleTypes';
import { UserProfile } from '../types/userTypes'; // If needed for assigning users, though not directly used in service params

// Helper to convert Schedule Timestamps to ISO strings for client-side consistency
const scheduleToClient = (scheduleData: any, id: string, teamId: string): Schedule => {
  return {
    ...scheduleData,
    id,
    teamId, // Ensure teamId is part of the returned object
    startTime: (scheduleData.startTime as Timestamp)?.toDate(), // Keep as Date for client
    endTime: (scheduleData.endTime as Timestamp)?.toDate(),     // Keep as Date for client
    createdAt: (scheduleData.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (scheduleData.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Schedule; // Cast, assuming data matches Schedule structure after conversion
};


export const createSchedule = async (
  isAuthenticated: boolean,
  teamId: string,
  userId: string, // ID of the user creating the schedule
  scheduleFormData: ScheduleFormData
): Promise<Schedule> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Cannot create schedule.");
  }
  if (!teamId || !userId) {
    throw new Error("Team ID and User ID are required to create a schedule.");
  }
  if (!scheduleFormData.title || !scheduleFormData.startTime || !scheduleFormData.endTime) {
    throw new Error("Title, start time, and end time are required for a schedule.");
  }

  try {
    const schedulesColRef = collection(firestore, 'teams', teamId, 'schedules');
    const newScheduleDocData = {
      teamId, // Store teamId for potential denormalized queries if schedules were in a root collection
      title: scheduleFormData.title,
      description: scheduleFormData.description || '',
      startTime: Timestamp.fromDate(new Date(scheduleFormData.startTime)), // Convert Date to Firestore Timestamp
      endTime: Timestamp.fromDate(new Date(scheduleFormData.endTime)),     // Convert Date to Firestore Timestamp
      assignedUserIds: scheduleFormData.assignedUserIds || [],
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(schedulesColRef, newScheduleDocData);
    
    // Fetch the document to get server-generated timestamps
    const newDocSnap = await getDoc(docRef);
    if (!newDocSnap.exists()) {
        throw new Error("Failed to retrieve created schedule from Firestore.");
    }
    const createdData = newDocSnap.data();

    return scheduleToClient(createdData, newDocSnap.id, teamId);

  } catch (error) {
    console.error(`Error creating schedule for team ${teamId}:`, error);
    throw error;
  }
};

export const getSchedulesForTeam = async (
  isAuthenticated: boolean,
  teamId: string
): Promise<Schedule[]> => {
  if (!isAuthenticated) {
    // Depending on your app's privacy rules, you might allow unauthenticated access
    // or throw an error. For now, proceeding but logging a warning.
    console.warn("getSchedulesForTeam: User not authenticated. Access might be restricted.");
    // throw new Error("User not authenticated.");
  }
  if (!teamId) {
    console.error("getSchedulesForTeam: teamId is required.");
    return [];
  }

  try {
    const schedulesColRef = collection(firestore, 'teams', teamId, 'schedules');
    // Order by start time, ascending
    const q = query(schedulesColRef, orderBy('startTime', 'asc'));
    const querySnapshot = await getDocs(q);
    const schedules: Schedule[] = [];
    querySnapshot.forEach((docSnap) => {
      schedules.push(scheduleToClient(docSnap.data(), docSnap.id, teamId));
    });
    return schedules;
  } catch (error) {
    console.error(`Error fetching schedules for team ${teamId}:`, error);
    throw error;
  }
};

export const updateSchedule = async (
  isAuthenticated: boolean,
  teamId: string,
  scheduleId: string,
  scheduleUpdateData: Partial<ScheduleFormData> // Allow partial updates based on form data
): Promise<Schedule | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Cannot update schedule.");
  }
  if (!teamId || !scheduleId) {
    throw new Error("Team ID and Schedule ID are required to update a schedule.");
  }

  try {
    const scheduleDocRef = doc(firestore, 'teams', teamId, 'schedules', scheduleId);
    
    // Convert Date objects to Timestamps if they are part of the update
    const updatePayload: any = { ...scheduleUpdateData };
    if (scheduleUpdateData.startTime) {
      updatePayload.startTime = Timestamp.fromDate(new Date(scheduleUpdateData.startTime));
    }
    if (scheduleUpdateData.endTime) {
      updatePayload.endTime = Timestamp.fromDate(new Date(scheduleUpdateData.endTime));
    }
    updatePayload.updatedAt = serverTimestamp();

    await updateDoc(scheduleDocRef, updatePayload);

    const updatedDocSnap = await getDoc(scheduleDocRef);
    if (updatedDocSnap.exists()) {
      return scheduleToClient(updatedDocSnap.data(), updatedDocSnap.id, teamId);
    }
    return null; // Should not happen if update was successful and doc existed
  } catch (error) {
    console.error(`Error updating schedule ${scheduleId} for team ${teamId}:`, error);
    throw error;
  }
};

export const deleteSchedule = async (
  isAuthenticated: boolean,
  teamId: string,
  scheduleId: string
): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Cannot delete schedule.");
  }
  if (!teamId || !scheduleId) {
    throw new Error("Team ID and Schedule ID are required to delete a schedule.");
  }

  try {
    const scheduleDocRef = doc(firestore, 'teams', teamId, 'schedules', scheduleId);
    await deleteDoc(scheduleDocRef);
    console.log(`Schedule ${scheduleId} deleted from team ${teamId}.`);
  } catch (error) {
    console.error(`Error deleting schedule ${scheduleId} for team ${teamId}:`, error);
    throw error;
  }
};
