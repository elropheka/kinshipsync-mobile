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
import { Team, TeamTask, TeamType, CreateTeamPayload, FamilyMemberNode } from '../types/teamTypes';
import { UserProfile } from '../types/userTypes';
import { createTeamMemberAddedNotification, createFamilyTreeUpdateNotification, createTeamTaskUpdateNotification } from '../services/notificationService';
import { getUserProfileById as getUserById } from '../services/userService';

export const getTeamById = async (isAuthenticated: boolean, teamId: string): Promise<Team | null> => {
  if (!isAuthenticated) {
    console.warn("getTeamById: User not authenticated. Access to team data might be restricted.");
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
      const teamData: Team = {
        id: docSnap.id,
        name: data.name || 'Unnamed Team',
        memberIds: Array.isArray(data.memberIds) ? data.memberIds : [],
        iconName: data.iconName || 'people-outline',
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

export const getTasksForTeam = async (isAuthenticated: boolean, teamId: string): Promise<TeamTask[]> => {
  if (!isAuthenticated) {
    console.warn("getTasksForTeam: User not authenticated.");
  }
   if (!teamId) {
    console.error("getTasksForTeam: teamId is required.");
    return [];
  }
  try {
    const tasksColRef = collection(firestore, 'teams', teamId, 'tasks');
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
    
    const updates: { memberIds: any; adminIds?: any; updatedAt: any } = {
      memberIds: arrayUnion(userId),
      updatedAt: serverTimestamp()
    };

    if (isAdmin) {
      console.warn(`Team type does not currently support distinct adminIds array. User ${userId} added as member.`);
    }

    await updateDoc(teamDocRef, updates);
    console.log(`User ${userId} added to team ${teamId}. Admin status (if supported by type): ${isAdmin}`);

    const team = await getTeamById(true, teamId);
    const user = await getUserById(userId);
    
    if (team && user) {
      team.memberIds.forEach(memberId => {
        if (memberId !== userId) {
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
  taskData: Omit<TeamTask, 'id' | 'teamId' | 'createdAt' | 'updatedAt'> & { title: string }
): Promise<TeamTask> => {
  if (!isAuthenticated) {
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
    
    const createdTaskSnapshot = await getDoc(docRef);
    if (!createdTaskSnapshot.exists()) {
      throw new Error("Failed to retrieve created task.");
    }
    const createdTaskData = createdTaskSnapshot.data();

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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      taskIds: [],
    };
    const docRef = await addDoc(teamCollectionRef, newTeamDoc);

    return {
      id: docRef.id,
      ...payload,
      taskIds: [],
    } as Team;
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
        conversationId: data.conversationId,
      } as Team);
    });
    return teams;
  } catch (error) {
    console.error(`Error fetching teams for user ${userId}:`, error);
    throw error;
  }
};

export const updateFamilyTreeRoot = async (teamId: string, rootNode: Team['familyTreeRoot']): Promise<void> => {
  if (!teamId) {
    throw new Error("Team ID is required to update family tree root.");
  }

  try {
    const teamDocRef = doc(firestore, 'teams', teamId);
    await updateDoc(teamDocRef, {
      familyTreeRoot: rootNode,
      updatedAt: serverTimestamp(),
    });
    console.log(`Family tree root updated for team ${teamId}.`);

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

const removeNodeRecursivelyFromData = (
  currentNode: FamilyMemberNode | undefined, 
  idToRemove: string
): FamilyMemberNode | undefined => {
  if (!currentNode) return undefined;

  if (currentNode.id === idToRemove) {
    return undefined;
  }

  if (currentNode.spouse?.id === idToRemove) {
    return { ...currentNode, spouse: undefined };
  }

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
  
  if (!childrenModified && currentNode.spouse?.id !== idToRemove) {
      if (childrenModified) {
         return { ...currentNode, children: newChildren };
      }
      return currentNode; 
  }
  
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

    await updateFamilyTreeRoot(teamId, modifiedTreeRoot); 
    console.log(`Member ${memberIdToRemove} processed for removal from family tree for team ${teamId}.`);

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

const updateSpouseInTree = (
  currentNode: FamilyMemberNode, 
  targetNodeId: string, 
  spouseData: Pick<FamilyMemberNode, 'id' | 'name' | 'imageUrl'>
): FamilyMemberNode | null => {
  if (currentNode.id === targetNodeId) {
    return { ...currentNode, spouse: spouseData };
  }

  if (currentNode.children) {
    for (let i = 0; i < currentNode.children.length; i++) {
      const result = updateSpouseInTree(currentNode.children[i], targetNodeId, spouseData);
      if (result) {
        const updatedNode = { ...currentNode };
        updatedNode.children = [...(updatedNode.children || [])];
        updatedNode.children[i] = result;
        return updatedNode;
      }
    }
  }
  return null;
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
    
    const currentTreeRoot = JSON.parse(JSON.stringify(teamData.familyTreeRoot));

    const modifiedTreeRoot = updateSpouseInTree(currentTreeRoot, memberId, spouseData);

    if (modifiedTreeRoot) {
      await updateFamilyTreeRoot(teamId, modifiedTreeRoot);
      console.log(`Spouse added/updated for member ${memberId} in team ${teamId}.`);

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
      updatedAt: serverTimestamp(),
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
