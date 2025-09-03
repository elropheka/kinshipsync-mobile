// Base Event Structure
export interface Event {
  id: string;
  name: string;
  name_lowercase?: string;
  description?: string;
  date: string;
  time?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  organizerId: string;
  themeId?: string;
  teamIds?: string[];
  createdAt: string;
  updatedAt: string;
  overallBudget?: number;
  visibility: 'public' | 'private' | 'unlisted';
  allowedUserIds?: string[];
  totalAttendees?: number;
  guestEmails?: string[];
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  website?: WebsitePayload;
  searchableKeywords?: string[];
}

// Guest Types
export type GuestStatus = 'pending' | 'accepted' | 'declined' | 'Attending' | 'Invited';

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: GuestStatus;
  plusOnes?: number;
  dietaryRestrictions?: string;
  notes?: string;
  addedAt: string;
  rsvpUpdatedAt?: string;
}

// Budget Types
export interface BudgetItem {
  id: string;
  eventId: string;
  itemName: string;
  category?: string;
  estimatedCost: number;
  actualCost?: number;
  paid: boolean;
  notes?: string;
  linkedVendorId?: string;
  manualVendorName?: string;
  linkedVendorItemId?: string;
}

// Idea Types
export interface Idea {
  id: string;
  eventId: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  votes: number;
  submitterName?: string;
}

// Schedule Types
export interface ScheduleItem {
  id: string;
  eventId: string;
  title: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description?: string;
  assignedTo?: string[];
}

// Task Types
export interface Task {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedToUserIds?: string[];
  completed?: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
  searchableKeywords?: string[];
}

// Theme Types
export interface FontSettings {
  fontFamily: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  fontStyle?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
    cardBackground?: string;
    borderColor?: string;
  };
  fonts: {
    heading: FontSettings;
    body: FontSettings;
  };
  isPredefined?: boolean;
}

// RSVP Types
export interface RSVP {
  id: string;
  guestId: string;
  status: GuestStatus;
  plusOne?: boolean;
  dietaryRestrictions?: string;
  notes?: string;
}

// Seating Chart Types
export interface SeatingTable {
  id: string;
  name: string;
  capacity: number;
  assignedGuests: string[];
  position: { x: number; y: number };
}

export interface SeatingChart {
  id: string;
  eventId: string;
  tables: SeatingTable[];
  lastUpdated: string;
}

// Event Message Types
export interface EventMessage {
  id: string;
  eventId: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'announcement' | 'update' | 'reminder';
}

// Event Team Types
export interface TeamMember {
  userId: string;
  role: 'admin' | 'coordinator' | 'helper';
  responsibilities?: string[];
}

export interface EventTeam {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  members: TeamMember[];
}

// Idea Comment Types
export interface IdeaComment {
  id: string;
  ideaId: string;
  eventId: string;
  content: string;
  author: string;
  createdAt: string;
}

// Event Website Types
export interface EventWebsiteSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

// Payload Types
export type WebsitePayload = {
  title?: string;
  customUrlSlug?: string;
  headerImageUrl?: string;
  welcomeMessage?: string;
  sections?: EventWebsiteSection[];
  websiteThemeId?: string;
  published?: boolean;
};

export interface CreateEventPayload {
  name: string;
  description?: string;
  date: string;
  time?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  overallBudget?: number;
  themeId?: string;
  teamIds?: string[];
  visibility: Event['visibility'];
  allowedUserIds?: string[];
  website?: WebsitePayload;
}

export interface CreateGuestPayload {
  name: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  plusOnes?: number;
  dietaryRestrictions?: string;
  notes?: string;
  status?: GuestStatus;
}

export interface CreateBudgetItemPayload {
  itemName: string;
  category?: string;
  estimatedCost: number;
  actualCost?: number;
  paid?: boolean;
  notes?: string;
  linkedVendorId?: string;
  manualVendorName?: string;
  linkedVendorItemId?: string;
}

export interface CreateIdeaPayload {
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
}

export interface CreateScheduleItemPayload {
  title: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description?: string;
  assignedTo?: string[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Task['priority'];
  assignedToUserIds?: string[];
  category?: string;
  completed?: boolean;
  status: Task['status'];
}

export interface CreateEventMessagePayload {
  content: string;
  type: EventMessage['type'];
  isAnnouncement?: boolean;
}

export interface CreateEventTeamPayload {
  name: string;
  description?: string;
  members: TeamMember[];
}

export interface CreateIdeaCommentPayload {
  content: string;
}

// Update Payload Types
export type UpdateEventPayload = Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'organizerId' | 'website'>> & {
  website?: WebsitePayload;
};

export type UpdateGuestPayload = Partial<Omit<Guest, 'id' | 'eventId' | 'addedAt' | 'rsvpUpdatedAt'>>;
export type UpdateBudgetItemPayload = Partial<Omit<BudgetItem, 'id' | 'eventId'>>;
export type UpdateIdeaPayload = Partial<Omit<Idea, 'id' | 'createdBy' | 'createdAt'>>;
export type UpdateScheduleItemPayload = Partial<Omit<ScheduleItem, 'id' | 'eventId'>>;
export type UpdateTaskPayload = Partial<Omit<Task, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>>;
export type UpdateRSVPPayload = Partial<Omit<RSVP, 'id' | 'guestId'>>;
export type UpdateSeatingChartPayload = { tables: Omit<SeatingTable, 'id'>[]; };
export type UpdateEventTeamPayload = Partial<Omit<EventTeam, 'id' | 'eventId'>>;
export type UpdateTeamMemberPayload = Partial<Omit<TeamMember, 'userId'>>;
export type UpdateEventWebsiteDetailsPayload = WebsitePayload;

// Additional Payload Types
export interface AddTeamMemberPayload {
  userId: string;
  role: TeamMember['role'];
  responsibilities?: string[];
}
