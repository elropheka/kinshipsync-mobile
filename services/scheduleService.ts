import axiosInstance from './axiosInstance';
import { Schedule, ScheduleFormData } from '../types/scheduleTypes';

// Helper to convert backend schedule data to client format
const scheduleToClient = (scheduleData: any, id: string, teamId: string): Schedule => {
  return {
    ...scheduleData,
    id: scheduleData.id || id,
    teamId: scheduleData.teamId || teamId,
    startTime: scheduleData.startTime ? new Date(scheduleData.startTime) : new Date(),
    endTime: scheduleData.endTime ? new Date(scheduleData.endTime) : new Date(),
    createdAt: scheduleData.createdAt || new Date().toISOString(),
    updatedAt: scheduleData.updatedAt || new Date().toISOString(),
  } as Schedule;
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
    const response = await axiosInstance.post(`/teams/${teamId}/schedules`, {
      title: scheduleFormData.title,
      description: scheduleFormData.description || '',
      startTime: new Date(scheduleFormData.startTime).toISOString(),
      endTime: new Date(scheduleFormData.endTime).toISOString(),
      assignedUserIds: scheduleFormData.assignedUserIds || [],
      createdBy: userId,
    });

    if (response.data.success && response.data.data) {
      return scheduleToClient(response.data.data, response.data.data.id, teamId);
    }
    throw new Error("Failed to create schedule.");
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
    const response = await axiosInstance.get(`/teams/${teamId}/schedules`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((schedule: any) =>
        scheduleToClient(schedule, schedule.id, teamId)
      );
    }
    return [];
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
    const updatePayload: any = { ...scheduleUpdateData };
    if (scheduleUpdateData.startTime) {
      updatePayload.startTime = new Date(scheduleUpdateData.startTime).toISOString();
    }
    if (scheduleUpdateData.endTime) {
      updatePayload.endTime = new Date(scheduleUpdateData.endTime).toISOString();
    }

    const response = await axiosInstance.put(`/teams/${teamId}/schedules/${scheduleId}`, updatePayload);
    if (response.data.success && response.data.data) {
      return scheduleToClient(response.data.data, response.data.data.id, teamId);
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
    await axiosInstance.delete(`/teams/${teamId}/schedules/${scheduleId}`);
    console.log(`Schedule ${scheduleId} deleted from team ${teamId}.`);
  } catch (error) {
    console.error(`Error deleting schedule ${scheduleId} for team ${teamId}:`, error);
    throw error;
  }
};
