import { Ionicons } from '@expo/vector-icons';

export enum TeamType {
  FRIENDS = 'friends',
  FAMILY = 'family',
  OTHER = 'other',
}

export interface Team {
  id: string;
  name: string;
  memberIds: string[]; // Changed from members: number
  iconName: keyof typeof Ionicons.glyphMap;
  type: TeamType;
  taskIds?: string[]; // Added for linking tasks
  conversationId?: string; // Optional: For team-specific chat
  familyTreeRoot?: FamilyMemberNode; // Add this line
  // Add other team-specific properties here if needed
}

// Interface for Team Tasks
export interface TeamTask {
  id: string;
  teamId: string; // Links task to a team
  title: string;
  description?: string;
  assignedToUserIds?: string[]; // User IDs of the assigned members
  dueDate?: string; // ISO date string, e.g., "2024-12-31"
  status: 'todo' | 'in-progress' | 'completed';
  createdBy: string; // User ID of the task creator
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

// Interface for the Family Tree Node, if we decide to structure it this way
export interface FamilyMemberNode {
  id: string;
  name: string;
  // relationship: 'Parent' | 'Child' | 'Sibling' | 'Spouse'; // This might be re-evaluated or removed
  imageUrl?: string;
  spouse?: Pick<FamilyMemberNode, 'id' | 'name' | 'imageUrl'>; // Spouse details
  children?: FamilyMemberNode[];
  parentIds?: string[]; // IDs of the parents of this node
}

export interface FamilyTree {
  teamId: string; 
  rootMember: FamilyMemberNode; 
}

// SuggestedTeam interface can also be moved here or kept if it's more generic
export interface SuggestedTeam {
  id: string;
  description: string;
  actionText: string;
}

export interface CreateTeamPayload {
  name: string;
  memberIds: string[];
  type: TeamType;
  iconName: keyof typeof Ionicons.glyphMap;
  createdBy: string; // User ID of the creator
  // conversationId will be handled separately if needed upon team creation or later
}
