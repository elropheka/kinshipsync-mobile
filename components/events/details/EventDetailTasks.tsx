import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/eventTypes';
import { UserProfile } from '@/types/userTypes';
import TaskForm from '@/components/tasks/TaskForm';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { createEventSlabPageStyles } from '@/styles/app/(events)/eventSlabPage.styles';
import { useAppTheme } from '@/context/AppThemeContext';
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
  isOrganizer = true,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createEventDetailsStyles(currentColors);
  const pageStyles = createEventSlabPageStyles(currentColors);
  const { showSuccess, showError, showConfirm } = useAlert();
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> & { id?: string } | undefined>(undefined);

  const getUserDisplayNames = (userIds: string[]): string => {
    if (!userIds || userIds.length === 0) return '';

    const names = userIds
      .map((id) => assignableUsers.find((user) => user.userId === id))
      .filter(Boolean)
      .map((user) => user!.displayName || user!.email || user!.userId);

    return names.join(', ');
  };

  const handleOpenTaskForm = (task?: Partial<Task> & { id?: string }) => {
    setEditingTask(task);
    setIsTaskFormVisible(true);
  };

  const handleCloseTaskForm = () => {
    setEditingTask(undefined);
    setIsTaskFormVisible(false);
  };

  const handleTaskFormSubmit = async (
    taskData: CreateTaskPayload | UpdateTaskPayload,
    taskId?: string,
  ) => {
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
      console.error('Failed to submit task:', e);
      showError('Error', 'Failed to save task. Please try again.');
    }
  };

  const handleDeletePress = (taskId: string) => {
    showConfirm(
      'warning',
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      async () => {
        try {
          await onDeleteTask(taskId);
          showSuccess('Success', 'Task deleted successfully.');
        } catch {
          showError('Error', 'Failed to delete task.');
        }
      },
      {
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const assignedNames = getUserDisplayNames(item.assignedToUserIds || []);

    return (
      <TouchableOpacity
        style={[pageStyles.slab, pageStyles.taskSlab]}
        onPress={isOrganizer ? () => handleOpenTaskForm(item) : undefined}
        disabled={!isOrganizer}
        accessibilityRole="button"
        accessibilityLabel={`Task: ${item.title}`}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.description ? (
            <Text style={styles.taskDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          {assignedNames ? (
            <Text style={styles.taskAssignedTo}>Assigned to: {assignedNames}</Text>
          ) : null}
          {item.dueDate ? (
            <Text style={styles.taskDueDate}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.completed ? currentColors.success : currentColors.textSecondary}
        />
        {isOrganizer ? (
          <TouchableOpacity
            onPress={() => handleDeletePress(item.id)}
            style={{ marginLeft: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Delete task"
          >
            <Ionicons name="trash-outline" size={24} color={currentColors.error} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={pageStyles.page}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        ItemSeparatorComponent={() => <View style={pageStyles.slabGap} />}
        contentContainerStyle={pageStyles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={pageStyles.emptyContainer}>
            <Text style={pageStyles.emptyText}>
              {isOrganizer
                ? 'No tasks yet. Tap + to add your first task.'
                : 'No tasks assigned yet.'}
            </Text>
          </View>
        }
      />

      {isOrganizer ? (
        <TouchableOpacity
          style={pageStyles.fab}
          onPress={() => handleOpenTaskForm()}
          accessibilityRole="button"
          accessibilityLabel="Add task"
        >
          <Ionicons name="add" size={32} color={currentColors.primaryContrastText} />
        </TouchableOpacity>
      ) : null}

      <Modal visible={isTaskFormVisible} animationType="slide" onRequestClose={handleCloseTaskForm}>
        <TaskForm
          initialTask={editingTask}
          assignableUsers={assignableUsers}
          onSubmit={handleTaskFormSubmit}
          onCancel={handleCloseTaskForm}
          formTitle={editingTask?.id ? 'Edit Task' : 'Create New Task'}
        />
      </Modal>
    </View>
  );
};

export default EventDetailTasks;
