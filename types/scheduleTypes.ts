import { Timestamp } from '@firebase/firestore';

export interface Schedule {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  startTime: Timestamp; // Stored as Firestore Timestamp
  endTime: Timestamp;   // Stored as Firestore Timestamp
  assignedUserIds: string[]; // Array of user UIDs
  createdBy: string; // User UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// For form handling, using Date objects is often easier
export interface ScheduleFormData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  assignedUserIds: string[];
}
