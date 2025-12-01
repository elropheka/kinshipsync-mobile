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
  where,
} from '@firebase/firestore';
import { firestore } from './firebaseConfig';
import { Schedule, ScheduleFormData } from '../types/scheduleTypes';

const scheduleToClient = (scheduleData: any, id: string, teamId: string): Schedule => {
  return {
    ...scheduleData,
    id,
    teamId,
    startTime: (scheduleData.startTime as Timestamp)?.toDate(),
    endTime: (scheduleData.endTime as Timestamp)?.toDate(),
    createdAt: (scheduleData.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (scheduleData.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Schedule;
};


export const createSchedule = async (
  isAuthenticated: boolean,
  teamId: string,
  userId: string,
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
      teamId,
      title: scheduleFormData.title,
      description: scheduleFormData.description || '',
      startTime: Timestamp.fromDate(new Date(scheduleFormData.startTime)),
      endTime: Timestamp.fromDate(new Date(scheduleFormData.endTime)),
      assignedUserIds: scheduleFormData.assignedUserIds || [],
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(schedulesColRef, newScheduleDocData);
    
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
    console.warn("getSchedulesForTeam: User not authenticated. Access might be restricted.");
  }
  if (!teamId) {
    console.error("getSchedulesForTeam: teamId is required.");
    return [];
  }

  try {
    const schedulesColRef = collection(firestore, 'teams', teamId, 'schedules');
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
  scheduleUpdateData: Partial<ScheduleFormData>
): Promise<Schedule | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated. Cannot update schedule.");
  }
  if (!teamId || !scheduleId) {
    throw new Error("Team ID and Schedule ID are required to update a schedule.");
  }

  try {
    const scheduleDocRef = doc(firestore, 'teams', teamId, 'schedules', scheduleId);
    
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
    return null;
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
