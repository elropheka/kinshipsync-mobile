import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, ActivityIndicator, Image, StatusBar } from 'react-native'; // Added Image
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Team, TeamTask } from '../../../types/teamTypes';
import { UserProfile } from '../../../types/userTypes';
import { Schedule, ScheduleFormData } from '../../../types/scheduleTypes'; // Added Schedule types
import { CreateTaskPayload, UpdateTaskPayload } from '../../../types/eventTypes';
import TaskForm from '../../../components/tasks/TaskForm';
import ScheduleForm from '../../../components/schedules/form/ScheduleForm'; // Added ScheduleForm
import ScheduleListItem from '../../../components/schedules/list/ScheduleListItem'; // Added ScheduleListItem
import { Colors } from '../../../constants/Colors';
import { useAppAuth } from '../../../hooks/useAppAuth';
import { getTeamById, getTasksForTeam, createTaskForTeam, updateTaskForTeam, removeMemberFromTeam, deleteTaskForTeam } from '../../../services/teamService';
import * as scheduleService from '../../../services/scheduleService'; // Added scheduleService
import { getUserProfile } from '../../../services/userService';

// Mock data removed

const TeamDashboardScreen = () => {
  const router = useRouter();
  const { teamId, initialTab } = useLocalSearchParams<{ teamId: string; initialTab?: string }>();
  const { user: currentUser, token, isInitialized } = useAppAuth();
  const isAuthenticated = !!currentUser && !!token && isInitialized;

  const [activeTab, setActiveTab] = useState(initialTab || 'Members');
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TeamTask | undefined>(undefined);

  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [teamTasks, setTeamTasks] = useState<TeamTask[]>([]);
  const [teamSchedules, setTeamSchedules] = useState<Schedule[]>([]); // Added state for schedules
  const [isScheduleFormVisible, setIsScheduleFormVisible] = useState(false); // Added state for schedule form
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>(undefined); // Added state for editing schedule
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure teamService is imported if not already (it is in the provided file)
  // import { getTeamById, getTasksForTeam, createTaskForTeam, updateTaskForTeam, removeMemberFromTeam, deleteTaskForTeam } from '../../../services/teamService';
  // Make sure deleteTaskForTeam is added to the import statement for teamService.
  // Based on the provided file, it seems teamService functions are directly imported.

  useEffect(() => {
    if (!teamId || !isAuthenticated) {
      setError("Team ID missing or user not authenticated.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTeam = await getTeamById(isAuthenticated, teamId);
        setTeam(fetchedTeam);

        if (fetchedTeam && fetchedTeam.memberIds && fetchedTeam.memberIds.length > 0) {
          const memberPromises = fetchedTeam.memberIds.map(memberId =>
            getUserProfile(isAuthenticated, memberId)
          );
          const fetchedMemberProfiles = (await Promise.all(memberPromises)).filter(
            profile => profile !== null
          ) as UserProfile[];
          setTeamMembers(fetchedMemberProfiles);
        } else {
          setTeamMembers([]);
        }

        const fetchedTasks = await getTasksForTeam(isAuthenticated, teamId);
        setTeamTasks(fetchedTasks);

        const fetchedSchedules = await scheduleService.getSchedulesForTeam(isAuthenticated, teamId); // Fetch schedules
        setTeamSchedules(fetchedSchedules);

      } catch (err: any) {
        console.error("Failed to fetch team data:", err);
        setError(err.message || "Failed to load team data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teamId, isAuthenticated]);

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!teamId || !isAuthenticated || !currentUser?.uid) {
      Alert.alert("Error", "Cannot delete task: Missing team ID, authentication, or user information.");
      return;
    }
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the task "${taskTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTaskForTeam(isAuthenticated, teamId, taskId); // Assuming deleteTaskForTeam is imported from teamService
              setTeamTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
              Alert.alert("Success", `Task "${taskTitle}" deleted successfully.`);
            } catch (e: any) {
              console.error("Failed to delete task:", e);
              Alert.alert("Error", `Failed to delete task: ${e.message}`);
            }
          },
        },
      ]
    );
  };

  const handleRemoveMember = async (memberIdToRemove: string, memberName?: string) => {
    if (!teamId || !isAuthenticated) {
      Alert.alert("Error", "Cannot remove member: Missing team ID or user authentication.");
      return;
    }
    // Optional: Add a check to prevent removing the current user if they are the only admin/creator,
    // or prevent removing oneself if that's not allowed.

    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove ${memberName || 'this member'} from the team?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMemberFromTeam(isAuthenticated, teamId, memberIdToRemove);
              setTeamMembers(prevMembers => prevMembers.filter(member => member.userId !== memberIdToRemove));
              // Also update the main team object's memberIds if it's used directly elsewhere for member count etc.
              if (team) {
                setTeam(prevTeam => prevTeam ? ({ ...prevTeam, memberIds: prevTeam.memberIds.filter(id => id !== memberIdToRemove) }) : null);
              }
              Alert.alert("Success", `${memberName || 'Member'} removed successfully.`);
            } catch (e: any) {
              console.error("Failed to remove member:", e);
              Alert.alert("Error", `Failed to remove member: ${e.message}`);
            }
          },
        },
      ]
    );
  };

  const handleOpenTaskForm = (task?: TeamTask) => {
    setEditingTask(task);
    setIsTaskFormVisible(true);
  };

  const handleCloseTaskForm = () => {
    setEditingTask(undefined);
    setIsTaskFormVisible(false);
  };

  const handleTaskSubmit = async (taskFormData: CreateTaskPayload | UpdateTaskPayload, taskIdFromForm?: string) => {
    if (!teamId || !currentUser?.uid || !isAuthenticated) {
        Alert.alert("Error", "Cannot submit task: Missing team ID, user authentication, or auth status.");
        return;
    }

    let derivedStatus: TeamTask['status'] = 'todo';
    if ('completed' in taskFormData && taskFormData.completed !== undefined) {
        derivedStatus = taskFormData.completed ? 'completed' : (editingTask?.status === 'in-progress' ? 'in-progress' : 'todo');
    } else if (editingTask) {
        derivedStatus = editingTask.status; // Keep original status if 'completed' not in form data
    }

    try {
      if (editingTask && editingTask.id) { // Editing existing task
        const taskUpdatePayload: Partial<Omit<TeamTask, 'id' | 'teamId' | 'createdAt'>> = {
          title: taskFormData.title || editingTask.title,
          description: taskFormData.description || editingTask.description,
          assignedToUserIds: taskFormData.assignedToUserIds || editingTask.assignedToUserIds,
          dueDate: taskFormData.dueDate || editingTask.dueDate,
          status: derivedStatus,
          // 'updatedAt' will be set by the service function
        };
        const updatedTask = await updateTaskForTeam(isAuthenticated, teamId, editingTask.id, taskUpdatePayload);
        if (updatedTask) {
          setTeamTasks(prevTasks => prevTasks.map(t => t.id === editingTask.id ? updatedTask : t));
          Alert.alert('Task Updated', `Task "${updatedTask.title}" has been updated.`);
        } else {
          Alert.alert('Error', 'Failed to update task. Task not found or an error occurred.');
        }
      } else { // Creating new task
        const newTaskPayload: Omit<TeamTask, 'id' | 'teamId' | 'createdAt' | 'updatedAt'> & { title: string } = {
          title: taskFormData.title || 'Untitled Task',
          description: taskFormData.description || undefined,
          assignedToUserIds: taskFormData.assignedToUserIds || [],
          status: derivedStatus,
          dueDate: taskFormData.dueDate || undefined,
          createdBy: currentUser.uid,
        };
        const createdTask = await createTaskForTeam(isAuthenticated, teamId, newTaskPayload);
        setTeamTasks(prevTasks => [...prevTasks, createdTask]);
        Alert.alert('Task Created', `Task "${createdTask.title}" has been created.`);
      }
      handleCloseTaskForm();
    } catch (error: any) {
      console.error("Failed to submit task:", error);
      Alert.alert("Error Submitting Task", error.message || "An unexpected error occurred.");
    }
  };
  
  const handleAddItem = () => {
    if (activeTab === 'Members') {
      if (teamId) {
        router.push({ pathname: '/(teams)/addFamilyMember/[memberId]', params: { memberId: 'new', teamId: teamId } });
      } else {
        Alert.alert("Error", "Team ID is not available to add a member.");
      }
    } else if (activeTab === 'Tasks') {
      handleOpenTaskForm();
    } else if (activeTab === 'Schedules') {
      handleOpenScheduleForm();
    }
  };

  const handleOpenScheduleForm = (schedule?: Schedule) => {
    setEditingSchedule(schedule);
    setIsScheduleFormVisible(true);
  };

  const handleCloseScheduleForm = () => {
    setEditingSchedule(undefined);
    setIsScheduleFormVisible(false);
  };

  const handleScheduleSubmit = async (formData: ScheduleFormData, scheduleIdToUpdate?: string) => {
    if (!teamId || !currentUser?.uid || !isAuthenticated) {
      Alert.alert("Error", "Cannot submit schedule: Missing team ID, user authentication, or auth status.");
      return;
    }
    try {
      if (editingSchedule && editingSchedule.id) {
        const updatedSchedule = await scheduleService.updateSchedule(isAuthenticated, teamId, editingSchedule.id, formData);
        if (updatedSchedule) {
          setTeamSchedules(prevSchedules => prevSchedules.map(s => s.id === editingSchedule.id ? updatedSchedule : s));
          Alert.alert('Schedule Updated', `Schedule "${updatedSchedule.title}" has been updated.`);
        } else {
          Alert.alert('Error', 'Failed to update schedule.');
        }
      } else {
        const createdSchedule = await scheduleService.createSchedule(isAuthenticated, teamId, currentUser.uid, formData);
        setTeamSchedules(prevSchedules => [...prevSchedules, createdSchedule]);
        Alert.alert('Schedule Created', `Schedule "${createdSchedule.title}" has been created.`);
      }
      handleCloseScheduleForm();
    } catch (e: any) {
      console.error("Failed to submit schedule:", e);
      Alert.alert("Error Submitting Schedule", e.message || "An unexpected error occurred.");
    }
  };

  const handleDeleteSchedule = async (scheduleId: string, scheduleTitle: string) => {
    if (!teamId || !isAuthenticated || !currentUser?.uid) {
      Alert.alert("Error", "Cannot delete schedule: Missing team ID, authentication, or user information.");
      return;
    }
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the schedule "${scheduleTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await scheduleService.deleteSchedule(isAuthenticated, teamId, scheduleId);
              setTeamSchedules(prevSchedules => prevSchedules.filter(s => s.id !== scheduleId));
              Alert.alert("Success", `Schedule "${scheduleTitle}" deleted successfully.`);
            } catch (e: any) {
              console.error("Failed to delete schedule:", e);
              Alert.alert("Error", `Failed to delete schedule: ${e.message}`);
            }
          },
        },
      ]
    );
  };
  
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{marginTop: 10}}>Loading team data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
        <Text style={{color: 'red', marginBottom: 10}}>{error}</Text>
        {/* Optionally add a retry button here */}
      </SafeAreaView>
    );
  }
  
  if (!team) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
        <Stack.Screen options={{ title: 'Team Not Found' }} />
        <Text>Team not found.</Text>
      </SafeAreaView>
    );
  }
  
  const renderMemberItem = ({ item }: { item: UserProfile }) => (
    <View style={styles.listItem}>
      {item.avatarUrl ? (
        <Image source={{uri: item.avatarUrl}} style={styles.avatarImage} />
      ) : (
        <Ionicons name={"person-circle-outline"} size={40} color="#4F4F4F" style={styles.itemIcon} />
      )}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.displayName}</Text>
        <Text style={styles.itemSubtitle}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveMember(item.userId, item.displayName)}>
        <Ionicons name="trash-outline" size={24} color={Colors.light.error} />
      </TouchableOpacity>
    </View>
  );

  const renderTaskItem = ({ item }: { item: TeamTask }) => {
    const assignedUsers = item.assignedToUserIds
      ?.map(userId => teamMembers.find(u => u.userId === userId)?.displayName || userId.substring(0,6) + "...")
      .filter(Boolean) 
      .join(', ');

    return (
      // Main item press can be for viewing details if a detail view exists, or removed if actions are only via icons
      <View style={styles.listItem}> 
        <TouchableOpacity onPress={() => handleOpenTaskForm(item)} style={{flexDirection: 'row', alignItems: 'center', flex:1}}>
            <Ionicons 
              name={item.status === 'completed' ? "checkmark-circle" : item.status === 'in-progress' ? "ellipsis-horizontal-circle" : "ellipse-outline"} 
              size={24} 
              color={item.status === 'completed' ? Colors.light.success : item.status === 'in-progress' ? Colors.light.warning : Colors.light.icon} 
              style={styles.itemIcon} 
            />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">
                Assigned to: {assignedUsers || 'Unassigned'}
              </Text>
              {item.dueDate && <Text style={styles.itemSubtitle}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>}
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOpenTaskForm(item)} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <Ionicons name="pencil-outline" size={22} color={Colors.light.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id, item.title)} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
        <Ionicons name="trash-outline" size={22} color={Colors.light.error} />
      </TouchableOpacity>
    </View>
  );
};

  const renderScheduleItem = ({ item }: { item: Schedule }) => (
    <ScheduleListItem
      schedule={item}
      teamMembers={teamMembers}
      onPress={() => handleOpenScheduleForm(item)}
      onDelete={() => handleDeleteSchedule(item.id, item.title)}
    />
  );


  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
      <Stack.Screen
        options={{
          title: team.name || 'Team Dashboard',
          headerRight: () => (
            <TouchableOpacity onPress={handleAddItem} style={{ marginRight: 15 }}>
              <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.tabsContainer}>
        {['Members', 'Tasks', 'Schedules'].map(tabName => (
          <TouchableOpacity
            key={tabName}
            style={[styles.tab, activeTab === tabName && styles.activeTab]}
            onPress={() => setActiveTab(tabName)}
          >
            <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{tabName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Members' && (
        <FlatList
          data={teamMembers}
          renderItem={renderMemberItem}
          keyExtractor={item => item.userId}
          ListHeaderComponent={<Text style={styles.listHeader}>Team Members ({teamMembers.length})</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.emptyListText}>No members in this team yet.</Text>}
        />
      )}

      {activeTab === 'Tasks' && (
        <FlatList
          data={teamTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={<Text style={styles.listHeader}>Team Tasks ({teamTasks.length})</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.emptyListText}>No tasks assigned to this team yet.</Text>}
        />
      )}

      {activeTab === 'Schedules' && (
        <FlatList
          data={teamSchedules}
          renderItem={renderScheduleItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={<Text style={styles.listHeader}>Team Schedules ({teamSchedules.length})</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={styles.emptyListText}>No schedules for this team yet.</Text>}
        />
      )}

      <Modal
        visible={isTaskFormVisible}
        animationType="slide"
        onRequestClose={handleCloseTaskForm}
      >
        <TaskForm
          initialTask={editingTask ? {
            id: editingTask.id,
            title: editingTask.title,
            description: editingTask.description,
            dueDate: editingTask.dueDate,
            priority: editingTask.status === 'completed' ? 'high' : editingTask.status === 'in-progress' ? 'medium' : 'low',
            status: editingTask.status === 'completed' ? 'completed' : editingTask.status === 'in-progress' ? 'in_progress' : 'pending',
            assignedToUserIds: editingTask.assignedToUserIds || [],
            completed: editingTask.status === 'completed',
          } : undefined}
          assignableUsers={teamMembers}
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseTaskForm}
          formTitle={editingTask ? 'Edit Task' : 'Create New Task'}
        />
      </Modal>

      <Modal
        visible={isScheduleFormVisible}
        animationType="slide"
        onRequestClose={handleCloseScheduleForm}
      >
        <ScheduleForm
          initialSchedule={editingSchedule}
          assignableUsers={teamMembers}
          onSubmit={handleScheduleSubmit}
          onCancel={handleCloseScheduleForm}
          formTitle={editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundLight, 
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background, 
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text, 
    padding: 15,
    backgroundColor: Colors.light.backgroundPaper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: Colors.light.background,
  },
  itemIcon: {
    marginRight: 15,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: Colors.light.divider, // Placeholder bg
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  itemSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginLeft: 15 + 40 + 15, 
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.light.textSecondary,
  }
});

export default TeamDashboardScreen;
