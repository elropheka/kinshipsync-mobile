import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../../../types/eventTypes';
import { UserProfile } from '../../../types/userTypes';
import TaskForm from '../../tasks/TaskForm'; // Path to existing TaskForm
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed
import { Colors } from '../../../constants/Colors';
import CustomAlert from '../../common/alert';

interface EventDetailTasksProps {
  tasks: Task[];
  assignableUsers: UserProfile[];
  onAddTask: (taskData: CreateTaskPayload) => Promise<void>;
  onUpdateTask: (taskId: string, taskData: UpdateTaskPayload) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

const EventDetailTasks: React.FC<EventDetailTasksProps> = ({ 
  tasks, 
  assignableUsers,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> & { id?: string } | undefined>(undefined);

  // Custom alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    showCancelButton?: boolean;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    showCancelButton: false,
    onConfirm: undefined,
    confirmText: 'OK',
    cancelText: 'Cancel',
  });

  const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message, showCancelButton: false });
  };

  const showConfirmAlert = (
    type: 'success' | 'error' | 'info',
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    setAlertConfig({ 
      visible: true, 
      type, 
      title, 
      message, 
      showCancelButton: true, 
      onConfirm, 
      confirmText, 
      cancelText 
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

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
        Alert.alert('Success', 'Task updated successfully.');
      } else {
        await onAddTask(taskData as CreateTaskPayload);
        Alert.alert('Success', 'Task created successfully.');
      }
      handleCloseTaskForm();
    } catch (e) {
      console.error("Failed to submit task:", e);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    }
  };

  const handleDeletePress = (taskId: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { 
          await onDeleteTask(taskId); 
          Alert.alert('Success', 'Task deleted successfully.');
        } 
        catch (e) { Alert.alert("Error", "Failed to delete task."); }
      }}
    ]);
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskItem} onPress={() => handleOpenTaskForm(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description && <Text style={styles.taskDescription} numberOfLines={1}>{item.description}</Text>}
        {item.dueDate && <Text style={styles.taskDueDate}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>}
      </View>
      <Ionicons 
        name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
        size={24} 
        color={item.completed ? Colors.light.success : Colors.light.textSecondary} 
      />
      <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={{ marginLeft: 10 }}>
          <Ionicons name="trash-outline" size={24} color={Colors.light.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <TouchableOpacity onPress={() => handleOpenTaskForm()}>
          <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
        </TouchableOpacity>
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
