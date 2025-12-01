import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/eventTypes';
import { UserProfile } from '@/types/userTypes';
import TaskForm from '@/components/tasks/TaskForm'; // Path to existing TaskForm
import { styles } from '@/styles/app/(events)/details/[id].styles';
import { Colors } from '@/constants/Colors';
import { useAlert } from '@/context/AlertContext';

interface EventDetailTasksProps {
  tasks: Task[];
  assignableUsers: UserProfile[];
  onAddTask: (taskData: CreateTaskPayload) => Promise<void>;
  onUpdateTask: (taskId: string, taskData: UpdateTaskPayload) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  isOrganizer?: boolean;
}

const EventDetailTasks: React.FC<EventDetailTasksProps> = ({ 
  tasks, 
  assignableUsers,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  isOrganizer = true
}) => {
  const { showSuccess, showError, showConfirm } = useAlert();
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> & { id?: string } | undefined>(undefined);

  // Helper function to get user display names from IDs
  const getUserDisplayNames = (userIds: string[]): string => {
    if (!userIds || userIds.length === 0) return '';
    
    const names = userIds
      .map(id => assignableUsers.find(user => user.userId === id))
      .filter(Boolean)
      .map(user => user!.displayName || user!.email || user!.userId);
    
    return names.join(', ');
  };

  // const hideAlert = () => {
  //   setAlertConfig(prev => ({ ...prev, visible: false }));
  // };

  const handleOpenTaskForm = (task?: Partial<Task> & { id?: string }) => {
    setEditingTask(task);
    setIsTaskFormVisible(true);
  };

  const handleCloseTaskForm = () => {
    setEditingTask(undefined);
    setIsTaskFormVisible(false);
  };

  const handleTaskFormSubmit = async (taskData: CreateTaskPayload | UpdateTaskPayload, taskId?: string) => {
    try {
      if (taskId) {
        await onUpdateTask(taskId, taskData as UpdateTaskPayload);
        showSuccess('Success', 'Task updated successfully.');
      } else {
        await onAddTask(taskData as CreateTaskPayload);
        showSuccess('Success', 'Task created successfully.');
      }
      handleCloseTaskForm();
    } catch (e) {
      console.error("Failed to submit task:", e);
      showError('Error', 'Failed to save task. Please try again.');
    }
  };

  const handleDeletePress = (taskId: string) => {
    showConfirm(
      'warning',
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      async () => {
        try { 
          await onDeleteTask(taskId); 
          showSuccess('Success', 'Task deleted successfully.');
        } 
        catch { 
          showError('Error', 'Failed to delete task.');
        }
      },
      {
        confirmText: "Delete",
        cancelText: "Cancel",
      }
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const assignedNames = getUserDisplayNames(item.assignedToUserIds || []);
    
    return (
      <TouchableOpacity 
        style={styles.taskItem} 
        onPress={isOrganizer ? () => handleOpenTaskForm(item) : undefined}
        disabled={!isOrganizer}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.description && <Text style={styles.taskDescription} numberOfLines={1}>{item.description}</Text>}
          {assignedNames && <Text style={styles.taskAssignedTo}>Assigned to: {assignedNames}</Text>}
          {item.dueDate && <Text style={styles.taskDueDate}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>}
        </View>
        <Ionicons 
          name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
          size={24} 
          color={item.completed ? Colors.light.success : Colors.light.textSecondary} 
        />
        {isOrganizer && (
          <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={{ marginLeft: 10 }}>
            <Ionicons name="trash-outline" size={24} color={Colors.light.error} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        {isOrganizer && (
          <TouchableOpacity onPress={() => handleOpenTaskForm()}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
      </View>
      {tasks.length > 0 ? (
        <FlatList 
          data={tasks} 
          renderItem={renderTaskItem} 
          keyExtractor={item => item.id} 
          scrollEnabled={false} 
          ItemSeparatorComponent={() => <View style={styles.taskSeparator} />} 
        />
      ) : ( 
        <Text style={styles.emptyListText}>No tasks yet. Add one!</Text> 
      )}
      <Modal visible={isTaskFormVisible} animationType="slide" onRequestClose={handleCloseTaskForm}>
        <TaskForm 
          initialTask={editingTask} 
          assignableUsers={assignableUsers} 
          onSubmit={handleTaskFormSubmit} 
          onCancel={handleCloseTaskForm} 
          formTitle={editingTask ? 'Edit Task' : 'Create New Task'} 
        />
      </Modal>
    </View>
  );
};

export default EventDetailTasks;
