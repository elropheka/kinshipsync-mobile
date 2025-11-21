import axiosInstance from './axiosInstance';
import { Team, TeamTask, TeamType, CreateTeamPayload, FamilyMemberNode } from '../types/teamTypes';
import { createTeamMemberAddedNotification, createFamilyTreeUpdateNotification, createTeamTaskUpdateNotification } from '../services/notificationService';
import { getUserProfileById as getUserById } from '../services/userService';

// import { UpdateTeamPayload } from '../types/teamTypes'; // For later

export const getTeamById = async (isAuthenticated: boolean, teamId: string): Promise<Team | null> => {
  if (!isAuthenticated) {
    // Depending on team visibility rules, you might allow unauthenticated access or throw error
    console.warn("getTeamById: User not authenticated. Access to team data might be restricted.");
    // For now, let's proceed but this should be reviewed based on security requirements.
    // throw new Error("User not authenticated."); 
  }
  if (!teamId) {
    console.error("getTeamById: teamId is required.");
    return null;
  }

  try {
    const response = await axiosInstance.get(`/teams/${teamId}`);
    if (response.data.success && response.data.data) {
      const data = response.data.data;
      return {
        id: data.id || teamId,
        name: data.name || 'Unnamed Team',
        memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
        iconName: data.iconName || 'people-outline',
        type: data.type || TeamType.OTHER,
        taskIds: Array.isArray(data.taskIds) ? data.taskIds : [],
        familyTreeRoot: data.familyTreeRoot || undefined,
      } as Team;
    }
    console.log(`Team with ID ${teamId} not found.`);
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching team ${teamId}:`, error);
    throw error;
  }
};

// Placeholder for fetching tasks for a team.
// This assumes tasks are in a subcollection 'tasks' under each team document.
export const getTasksForTeam = async (isAuthenticated: boolean, teamId: string): Promise<TeamTask[]> => {
  if (!isAuthenticated) {
    console.warn("getTasksForTeam: User not authenticated.");
    // throw new Error("User not authenticated.");
  }
   if (!teamId) {
    console.error("getTasksForTeam: teamId is required.");
    return [];
  }
  try {
    const response = await axiosInstance.get(`/teams/${teamId}/tasks`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((data: any) => ({
        id: data.id,
        teamId: data.teamId || teamId,
        title: data.title || 'Untitled Task',
        description: data.description || undefined,
        assignedToUserIds: Array.isArray(data.assignedToUserIds) ? data.assignedToUserIds : [],
        dueDate: data.dueDate || undefined,
        status: data.status || 'todo',
        createdBy: data.createdBy || 'unknown',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || undefined,
      })) as TeamTask[];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching tasks for team ${teamId}:`, error);
    throw error;
  }
};

// Future functions:
export const addMemberToTeam = async (isAuthenticated: boolean, teamId: string, userId: string, isAdmin: boolean = false): Promise<void> => {
  if (!isAuthenticated) {
    console.warn("addMemberToTeam: User not authenticated.");
    throw new Error("User not authenticated.");
  }
  if (!teamId || !userId) {
    throw new Error("Team ID and User ID are required to add a member.");
  }

  try {
    await axiosInstance.post(`/teams/${teamId}/members`, {
      userId,
      isAdmin,
    });
    console.log(`User ${userId} added to team ${teamId}. Admin status: ${isAdmin}`);

    // Create notification for all existing team members
    const team = await getTeamById(true, teamId);
    const user = await getUserById(userId);
    
    if (team && user) {
      team.memberIds.forEach(memberId => {
        if (memberId !== userId) {
          createTeamMemberAddedNotification(memberId, team.name, user.displayName || 'Unknown', team.id);
        }
      });
    }

  } catch (error) {
    console.error(`Error adding member ${userId} to team ${teamId}:`, error);
    throw error;
  }
};

export const createTaskForTeam = async (
  isAuthenticated: boolean, 
  teamId: string, 
  taskData: Omit<TeamTask, 'id' | 'teamId' | 'createdAt' | 'updatedAt'> & { title: string } // Ensure title is present
): Promise<TeamTask> => {
  if (!isAuthenticated) {
    // Handle authentication based on your app's requirements
    throw new Error("User not authenticated.");
  }
  if (!teamId) {
    throw new Error("Team ID is required to create a task.");
  }

  try {
    const response = await axiosInstance.post(`/teams/${teamId}/tasks`, {
      ...taskData,
      teamId: teamId,
    });

    if (response.data.success && response.data.data) {
      const createdTask = response.data.data;

      // Send notification for task creation
      const team = await getTeamById(true, teamId);
      if (team) {
        team.memberIds.forEach(memberId => {
          createTeamTaskUpdateNotification(memberId, team.name, taskData.title, 'assigned', createdTask.id);
        });
      }

      return {
        id: createdTask.id,
        teamId: teamId,
        title: createdTask.title || taskData.title,
        description: createdTask.description || taskData.description || undefined,
        assignedToUserIds: createdTask.assignedToUserIds || taskData.assignedToUserIds || [],
        status: createdTask.status || taskData.status,
        dueDate: createdTask.dueDate || taskData.dueDate || undefined,
        createdBy: createdTask.createdBy || taskData.createdBy,
        createdAt: createdTask.createdAt || new Date().toISOString(),
        updatedAt: createdTask.updatedAt || new Date().toISOString(),
      } as TeamTask;
    }
    throw new Error("Failed to create task.");
  } catch (error) {
    console.error(`Error creating task for team ${teamId}:`, error);
    throw error;
  }
};

export const updateTaskForTeam = async (
  isAuthenticated: boolean,
  teamId: string,
  taskId: string,
  taskUpdateData: Partial<Omit<TeamTask, 'id' | 'teamId' | 'createdAt'>> // Allow updating most fields
): Promise<TeamTask | null> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated.");
  }
  if (!teamId || !taskId) {
    throw new Error("Team ID and Task ID are required to update a task.");
  }

  try {
    const response = await axiosInstance.put(`/teams/${teamId}/tasks/${taskId}`, taskUpdateData);
    
    if (response.data.success && response.data.data) {
      const data = response.data.data;

      // Send notification for task update
      const team = await getTeamById(true, teamId);
      if (team && data.title && data.status) {
        team.memberIds.forEach(memberId => {
          createTeamTaskUpdateNotification(memberId, team.name, data.title, data.status, taskId);
        });
      }

      return {
        id: data.id || taskId,
        teamId: data.teamId || teamId,
        title: data.title,
        description: data.description,
        assignedToUserIds: data.assignedToUserIds || [],
        dueDate: data.dueDate || undefined,
        status: data.status,
        createdBy: data.createdBy,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as TeamTask;
    }
    return null;
  } catch (error) {
    console.error(`Error updating task ${taskId} for team ${teamId}:`, error);
    throw error;
  }
};

export const createTeam = async (payload: CreateTeamPayload): Promise<Team> => {
  try {
    const response = await axiosInstance.post('/teams', {
      ...payload,
      taskIds: [],
    });

    if (response.data.success && response.data.data) {
      return {
        id: response.data.data.id,
        ...response.data.data,
        taskIds: response.data.data.taskIds || [],
      } as Team;
    }
    throw new Error("Failed to create team.");
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

export const getTeamsForUser = async (userId: string): Promise<Team[]> => {
  if (!userId) {
    console.error("getTeamsForUser: userId is required.");
    return [];
  }
  try {
    const response = await axiosInstance.get(`/users/${userId}/teams`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((data: any) => ({
        id: data.id,
        name: data.name || 'Unnamed Team',
        memberIds: data.memberIds || [],
        iconName: data.iconName || 'people-outline',
        type: data.type || TeamType.OTHER,
        taskIds: data.taskIds || [],
        conversationId: data.conversationId,
      })) as Team[];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching teams for user ${userId}:`, error);
    throw error;
  }
};

// export const updateTeam = async (teamId: string, payload: UpdateTeamPayload): Promise<Team | null> => { ... };
// export const deleteTeam = async (teamId: string): Promise<void> => { ... };

export const updateFamilyTreeRoot = async (teamId: string, rootNode: Team['familyTreeRoot']): Promise<void> => {
  if (!teamId) {
    throw new Error("Team ID is required to update family tree root.");
  }
  // rootNode can be FamilyMemberNode | undefined as per Team['familyTreeRoot']
  // If undefined is passed, it effectively clears the tree root.
  // If null is desired for clearing, the type Team['familyTreeRoot'] might need to be FamilyMemberNode | null | undefined
  // For now, we assume undefined or a valid node is passed. Firestore handles 'undefined' by removing the field.

  try {
    await axiosInstance.put(`/teams/${teamId}/family-tree`, {
      familyTreeRoot: rootNode,
    });
    console.log(`Family tree root updated for team ${teamId}.`);

    // Send notification for family tree update
    const team = await getTeamById(true, teamId);
    if (team && rootNode) {
      team.memberIds.forEach(memberId => {
        createFamilyTreeUpdateNotification(memberId, team.name, 'a member was added or updated', team.id);
      });
    }

  } catch (error) {
    console.error(`Error updating family tree root for team ${teamId}:`, error);
    throw error;
  }
};

// Recursive helper to remove a node (and its descendants) or a spouse from the tree
const removeNodeRecursivelyFromData = (
  currentNode: FamilyMemberNode | undefined, 
  idToRemove: string
): FamilyMemberNode | undefined => {
  if (!currentNode) return undefined;

  // Case 1: Current node is the one to remove (main node, not spouse)
  if (currentNode.id === idToRemove) {
    return undefined; // This node and its entire branch are removed
  }

  // Case 2: Spouse of the current node is the one to remove
  if (currentNode.spouse?.id === idToRemove) {
    return { ...currentNode, spouse: undefined };
  }

  // Case 3: Recursively process children
  let childrenModified = false;
  let newChildren: FamilyMemberNode[] | undefined = currentNode.children;

  if (currentNode.children) {
    const processedChildren = currentNode.children
      .map((child: FamilyMemberNode) => removeNodeRecursivelyFromData(child, idToRemove)) // Added type for child
      .filter((child): child is FamilyMemberNode => child !== undefined); // Type guard for filter
    
    if (processedChildren.length !== currentNode.children.length) {
      childrenModified = true;
    } else { // Check if any child object instance changed
      for(let i=0; i < processedChildren.length; i++) {
        if(processedChildren[i] !== currentNode.children[i]) {
          childrenModified = true;
          break;
        }
      }
    }
    newChildren = processedChildren.length > 0 ? processedChildren : undefined;
  }
  
  // If nothing in the current node's branch (self, spouse, children) was modified, return original node
  if (!childrenModified && currentNode.spouse?.id !== idToRemove) { // Check spouse again in case it was the only change
      // If only children were modified, but the current node itself or its spouse wasn't the target
      if (childrenModified) {
         return { ...currentNode, children: newChildren };
      }
      // If no modifications happened in this branch at all
      return currentNode; 
  }
  
  // If current node itself wasn't removed, but its spouse or children might have been
  return { ...currentNode, children: newChildren };
};


export const removeFamilyTreeNode = async (teamId: string, memberIdToRemove: string): Promise<void> => {
  if (!teamId || !memberIdToRemove) {
    throw new Error("Team ID and Member ID to remove are required.");
  }

  try {
    const team = await getTeamById(true, teamId);
    if (!team) {
      throw new Error(`Team with ID ${teamId} not found.`);
    }

    if (!team.familyTreeRoot) {
      console.log(`No family tree root to modify for team ${teamId}.`);
      return;
    }

    // Deep clone before modification
    const currentTreeRoot = JSON.parse(JSON.stringify(team.familyTreeRoot));
    const modifiedTreeRoot = removeNodeRecursivelyFromData(currentTreeRoot, memberIdToRemove);

    await updateFamilyTreeRoot(teamId, modifiedTreeRoot);
    console.log(`Member ${memberIdToRemove} processed for removal from family tree for team ${teamId}.`);

    // Send notification for family tree update
    if (team) {
      team.memberIds.forEach(memberId => {
        createFamilyTreeUpdateNotification(memberId, team.name, `member ${memberIdToRemove} was removed`, team.id);
      });
    }

  } catch (error) {
    console.error(`Error removing member ${memberIdToRemove} from family tree for team ${teamId}:`, error);
    throw error;
  }
};

// Recursive helper to add or update a spouse for a given node ID
const updateSpouseInTree = (
  currentNode: FamilyMemberNode, 
  targetNodeId: string, 
  spouseData: Pick<FamilyMemberNode, 'id' | 'name' | 'imageUrl'>
): FamilyMemberNode | null => { // Return modified node or null if not found/modified
  if (currentNode.id === targetNodeId) {
    // Add/update spouse. If spouseData is null/undefined, it can clear the spouse.
    return { ...currentNode, spouse: spouseData };
  }

  if (currentNode.children) {
    for (let i = 0; i < currentNode.children.length; i++) {
      const result = updateSpouseInTree(currentNode.children[i], targetNodeId, spouseData);
      if (result) { // If a child branch was modified
        const updatedNode = { ...currentNode };
        updatedNode.children = [...(updatedNode.children || [])];
        updatedNode.children[i] = result;
        return updatedNode;
      }
    }
  }
  // Spouse is a Pick<>, so no recursion into currentNode.spouse for finding targetNodeId
  return null; // Target node not found in this branch
};

export const addSpouseToFamilyMember = async (
  teamId: string, 
  memberId: string, // ID of the member to whom the spouse is being added
  spouseData: Pick<FamilyMemberNode, 'id' | 'name' | 'imageUrl'>
): Promise<void> => {
  if (!teamId || !memberId) {
    throw new Error("Team ID and Member ID are required to add a spouse.");
  }
  if (!spouseData || !spouseData.id || !spouseData.name) {
    throw new Error("Spouse data (id, name) is required.");
  }

  try {
    const team = await getTeamById(true, teamId);
    if (!team) {
      throw new Error(`Team with ID ${teamId} not found.`);
    }

    if (!team.familyTreeRoot) {
      throw new Error(`Family tree not found for team ${teamId}. Cannot add spouse.`);
    }
    
    // Deep clone to avoid issues if helper mutates
    const currentTreeRoot = JSON.parse(JSON.stringify(team.familyTreeRoot));
    const modifiedTreeRoot = updateSpouseInTree(currentTreeRoot, memberId, spouseData);

    if (modifiedTreeRoot) {
      await updateFamilyTreeRoot(teamId, modifiedTreeRoot);
      console.log(`Spouse added/updated for member ${memberId} in team ${teamId}.`);

      // Send notification for family tree update
      if (team) {
        createFamilyTreeUpdateNotification(memberId, team.name, `spouse added/updated for ${spouseData.name}`, team.id);
      }

    } else {
      throw new Error(`Member with ID ${memberId} not found in the family tree.`);
    }
  } catch (error) {
    console.error(`Error adding spouse to member ${memberId} for team ${teamId}:`, error);
    throw error;
  }
};


export const removeMemberFromTeam = async (isAuthenticated: boolean, teamId: string, userIdToRemove: string): Promise<void> => {
  if (!isAuthenticated) {
    console.warn("removeMemberFromTeam: User not authenticated.");
    throw new Error("User not authenticated.");
  }
  if (!teamId || !userIdToRemove) {
    throw new Error("Team ID and User ID to remove are required.");
  }

  try {
    await axiosInstance.delete(`/teams/${teamId}/members/${userIdToRemove}`);
    console.log(`User ${userIdToRemove} removed from team ${teamId}.`);
  } catch (error) {
    console.error(`Error removing member ${userIdToRemove} from team ${teamId}:`, error);
    throw error;
  }
};

export const deleteTaskForTeam = async (isAuthenticated: boolean, teamId: string, taskId: string): Promise<void> => {
  if (!isAuthenticated) {
    throw new Error("User not authenticated.");
  }
  if (!teamId || !taskId) {
    throw new Error("Team ID and Task ID are required to delete a task.");
  }

  try {
    await axiosInstance.delete(`/teams/${teamId}/tasks/${taskId}`);
    console.log(`Task ${taskId} deleted from team ${teamId}.`);
  } catch (error) {
    console.error(`Error deleting task ${taskId} for team ${teamId}:`, error);
    throw error;
  }
};
