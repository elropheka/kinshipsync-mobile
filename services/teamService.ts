import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  updateDoc,
  arrayUnion,
  addDoc,        // Ensured addDoc is imported
  serverTimestamp, // Added serverTimestamp
  arrayRemove, // Added arrayRemove for removing elements from an array
  deleteDoc, // For later CRUD operations
} from '@firebase/firestore';
import { firestore } from './firebaseConfig';
import { Team, TeamTask, TeamType, CreateTeamPayload, FamilyMemberNode } from '../types/teamTypes'; // Import FamilyMemberNode
import { UserProfile } from '../types/userTypes';
import { createTeamMemberAddedNotification, createFamilyTreeUpdateNotification, createTeamTaskUpdateNotification } from '../services/notificationService'; // Import new notification functions
import { getUserProfileById as getUserById } from '../services/userService'; // Import getUserById

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
    const teamDocRef = doc(firestore, 'teams', teamId);
    const docSnap = await getDoc(teamDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Explicitly map fields to ensure type safety and handle missing optional fields
      // Aligning with Team interface from types/teamTypes.ts
      const teamData: Team = {
        id: docSnap.id,
        name: data.name || 'Unnamed Team',
        memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
        // Ensure iconName is a valid keyof typeof Ionicons.glyphMap or provide a default
        iconName: data.iconName || 'people-outline', // Default icon
        type: data.type || TeamType.OTHER,
        taskIds: Array.isArray(data.taskIds) ? data.taskIds : [], // Optional field
        familyTreeRoot: data.familyTreeRoot || undefined, // Add this
      };
      return teamData;
    } else {
      console.log(`Team with ID ${teamId} not found.`);
      return null;
    }
  } catch (error) {
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
    const tasksColRef = collection(firestore, 'teams', teamId, 'tasks');
    // Add orderBy if needed, e.g., orderBy('createdAt', 'desc')
    const q = query(tasksColRef); 
    const querySnapshot = await getDocs(q);
    const tasks: TeamTask[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const taskData: TeamTask = {
        id: docSnap.id,
        teamId: data.teamId || teamId, // Ensure teamId is present, fallback to param if necessary
        title: data.title || 'Untitled Task',
        description: data.description || undefined,
        assignedToUserIds: Array.isArray(data.assignedToUserIds) ? data.assignedToUserIds : [],
        dueDate: data.dueDate ? (data.dueDate as Timestamp)?.toDate().toISOString() : undefined,
        status: data.status || 'todo', // Default status
        createdBy: data.createdBy || 'unknown', // Default creator
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt ? (data.updatedAt as Timestamp)?.toDate().toISOString() : undefined,
      };
      tasks.push(taskData);
    });
    return tasks;
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
    const teamDocRef = doc(firestore, 'teams', teamId);
    
    const updates: { memberIds: any; adminIds?: any; updatedAt: any } = { // Use 'any' for FieldValue types
      memberIds: arrayUnion(userId),
      updatedAt: serverTimestamp() // Using client-side timestamp for updatedAt, or use serverTimestamp()
      // serverTimestamp() needs to be imported: import { serverTimestamp } from '@firebase/firestore';
      // For simplicity, using Timestamp.now() for now.
    };

    if (isAdmin) {
      // The Team type in types/teamTypes.ts does not currently have adminIds.
      // If it should, it needs to be added there first.
      // For now, this part will be commented out or removed if adminIds is not a field.
      // updates.adminIds = arrayUnion(userId); 
      console.warn(`Team type does not currently support distinct adminIds array. User ${userId} added as member.`);
    }

    await updateDoc(teamDocRef, updates);
    console.log(`User ${userId} added to team ${teamId}. Admin status (if supported by type): ${isAdmin}`);

    // Create notification for all existing team members
    const team = await getTeamById(true, teamId); // Assuming getTeamById can be called with true for auth
    const user = await getUserById(userId); // Assuming getUserById exists and fetches UserProfile
    
    if (team && user) {
      team.memberIds.forEach(memberId => {
        if (memberId !== userId) { // Don't notify the new member
          createTeamMemberAddedNotification(memberId, team.name, user.displayName, team.id);
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
    const tasksColRef = collection(firestore, 'teams', teamId, 'tasks');
    const newTaskDoc = {
      ...taskData,
      teamId: teamId, // Ensure teamId is part of the document
      createdAt: serverTimestamp(), 
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(tasksColRef, newTaskDoc);
    
    // To return the full task with resolved timestamps, we'd ideally fetch it.
    // For now, constructing with assumption client can handle pending timestamps or re-fetch.
    // Or, return the ID and a partial object.
    // The calling function (TeamDashboardScreen) will likely re-fetch or update state based on this.
    const createdTaskSnapshot = await getDoc(docRef); // Fetch to get server-generated timestamps
    if (!createdTaskSnapshot.exists()) {
      throw new Error("Failed to retrieve created task.");
    }
    const createdTaskData = createdTaskSnapshot.data();

    // Send notification for task creation
    const team = await getTeamById(true, teamId);
    if (team) {
      team.memberIds.forEach(memberId => {
        createTeamTaskUpdateNotification(memberId, team.name, taskData.title, 'assigned', docRef.id);
      });
    }

    return {
      id: docRef.id,
      teamId: teamId,
      title: taskData.title,
      description: taskData.description || undefined,
      assignedToUserIds: taskData.assignedToUserIds || [],
      status: taskData.status,
      dueDate: taskData.dueDate || undefined,
      createdBy: taskData.createdBy,
      createdAt: (createdTaskData.createdAt as Timestamp)?.toDate().toISOString(),
      updatedAt: (createdTaskData.updatedAt as Timestamp)?.toDate().toISOString(),
    } as TeamTask;
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
    const taskDocRef = doc(firestore, 'teams', teamId, 'tasks', taskId);
    const updatePayload = {
      ...taskUpdateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(taskDocRef, updatePayload);
    
    const updatedDocSnap = await getDoc(taskDocRef);
    if (updatedDocSnap.exists()) {
      const data = updatedDocSnap.data();

      // Send notification for task update
      const team = await getTeamById(true, teamId);
      if (team && data.title && data.status) {
        team.memberIds.forEach(memberId => {
          createTeamTaskUpdateNotification(memberId, team.name, data.title, data.status, taskId);
        });
      }

      return {
        id: updatedDocSnap.id,
        teamId: data.teamId || teamId,
        title: data.title,
        description: data.description,
        assignedToUserIds: data.assignedToUserIds,
        dueDate: data.dueDate ? (data.dueDate as Timestamp)?.toDate().toISOString() : undefined,
        status: data.status,
        createdBy: data.createdBy,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
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
    const teamCollectionRef = collection(firestore, 'teams');
    const newTeamDoc = {
      ...payload,
      createdAt: serverTimestamp(), // Use server-side timestamp
      updatedAt: serverTimestamp(),
      taskIds: [], // Initialize with empty taskIds
      // conversationId can be added later if needed
    };
    const docRef = await addDoc(teamCollectionRef, newTeamDoc);

    // To return the full Team object, we might need to fetch it again or construct it
    // For now, constructing it based on payload and new ID.
    // Firestore timestamps will be null until server processes, so we can't return them directly from client.
    // The calling function should be aware of this or re-fetch if exact timestamps are immediately needed.
    return {
      id: docRef.id,
      ...payload,
      taskIds: [],
      // createdAt and updatedAt will be Timestamps once fetched from server
    } as Team; // Casting as Team, acknowledging timestamps are pending
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
    const teamsCollectionRef = collection(firestore, 'teams');
    const q = query(teamsCollectionRef, where('memberIds', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    const teams: Team[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      teams.push({
        id: docSnap.id,
        name: data.name || 'Unnamed Team',
        memberIds: data.memberIds || [],
        iconName: data.iconName || 'people-outline',
        type: data.type || TeamType.OTHER,
        taskIds: data.taskIds || [],
        conversationId: data.conversationId, // Optional
        // createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(), // Example if needed
        // updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(), // Example if needed
      } as Team);
    });
    return teams;
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
    const teamDocRef = doc(firestore, 'teams', teamId);
    await updateDoc(teamDocRef, {
      familyTreeRoot: rootNode, // This will set or overwrite the familyTreeRoot field
      updatedAt: serverTimestamp(),
    });
    console.log(`Family tree root updated for team ${teamId}.`);

    // Send notification for family tree update
    const team = await getTeamById(true, teamId);
    if (team && rootNode) { // Assuming rootNode implies an update
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
    const teamDocRef = doc(firestore, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);

    if (!teamSnap.exists()) {
      throw new Error(`Team with ID ${teamId} not found.`);
    }

    const teamData = teamSnap.data() as Team;
    if (!teamData.familyTreeRoot) {
      console.log(`No family tree root to modify for team ${teamId}.`);
      return; // Or throw error if a tree was expected
    }

    // Deep clone before modification to avoid issues if removeNodeRecursivelyFromData mutates
    const currentTreeRoot = JSON.parse(JSON.stringify(teamData.familyTreeRoot));
    
    const modifiedTreeRoot = removeNodeRecursivelyFromData(currentTreeRoot, memberIdToRemove);

    // If modifiedTreeRoot is undefined, it means the root itself was removed.
    // updateFamilyTreeRoot handles setting it to undefined/null in Firestore.
    await updateFamilyTreeRoot(teamId, modifiedTreeRoot); 
    console.log(`Member ${memberIdToRemove} processed for removal from family tree for team ${teamId}.`);

    // Send notification for family tree update
    const team = await getTeamById(true, teamId);
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
    const teamDocRef = doc(firestore, 'teams', teamId);
    const teamSnap = await getDoc(teamDocRef);

    if (!teamSnap.exists()) {
      throw new Error(`Team with ID ${teamId} not found.`);
    }

    const teamData = teamSnap.data() as Team;
    if (!teamData.familyTreeRoot) {
      throw new Error(`Family tree not found for team ${teamId}. Cannot add spouse.`);
    }
    
    // Deep clone to avoid issues if helper mutates
    const currentTreeRoot = JSON.parse(JSON.stringify(teamData.familyTreeRoot));

    const modifiedTreeRoot = updateSpouseInTree(currentTreeRoot, memberId, spouseData);

    if (modifiedTreeRoot) {
      await updateFamilyTreeRoot(teamId, modifiedTreeRoot);
      console.log(`Spouse added/updated for member ${memberId} in team ${teamId}.`);

      // Send notification for family tree update
      const team = await getTeamById(true, teamId);
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
    const teamDocRef = doc(firestore, 'teams', teamId);
    await updateDoc(teamDocRef, {
      memberIds: arrayRemove(userIdToRemove),
      // If you have an adminIds array, consider removing from there as well if applicable
      // adminIds: arrayRemove(userIdToRemove), 
      updatedAt: serverTimestamp(), // Update the team's last modified timestamp
    });
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
    const taskDocRef = doc(firestore, 'teams', teamId, 'tasks', taskId);
    await deleteDoc(taskDocRef);
    console.log(`Task ${taskId} deleted from team ${teamId}.`);
  } catch (error) {
    console.error(`Error deleting task ${taskId} for team ${teamId}:`, error);
    throw error;
  }
};
