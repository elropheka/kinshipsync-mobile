import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Platform, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../../types/eventTypes';
import { UserProfile } from '../../types/userTypes';
import { Colors } from '../../constants/Colors';
import MultiUserPicker from '../common/MultiUserPicker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type FormStatus = 'todo' | 'in-progress' | 'completed';

interface TaskFormProps {
  initialTask?: Partial<Task> & { id?: string };
  assignableUsers: UserProfile[];
  onSubmit: (taskData: CreateTaskPayload | UpdateTaskPayload, taskId?: string) => void; 
  onCancel: () => void;
  formTitle?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  assignableUsers,
  onSubmit,
  onCancel,
  formTitle = 'Task Details',
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialTask?.dueDate ? new Date(initialTask.dueDate) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialTask?.priority || 'medium'
  );
  const [status, setStatus] = useState<FormStatus>(
    initialTask?.completed ? 'completed' : (initialTask as any)?.status || 'todo'
  );
  const [assignedToUserIds, setAssignedToUserIds] = useState<string[]>(
    initialTask?.assignedToUserIds || []
  );

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Task title cannot be empty.');
      return;
    }

    const commonData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate?.toISOString().split('T')[0],
      priority,
      completed: status === 'completed',
      assignedToUserIds,
      status: status === 'completed' ? 'completed' : status === 'in-progress' ? 'in_progress' : 'pending' as 'completed' | 'in_progress' | 'pending',
    };

    if (initialTask?.id) {
      const updatePayload: UpdateTaskPayload = commonData;
      onSubmit(updatePayload, initialTask.id);
    } else {
      const createPayload: CreateTaskPayload = commonData;
      onSubmit(createPayload);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate;
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && currentDate) {
      setDueDate(currentDate);
      if (Platform.OS === 'ios') {
      }
    } else if (event.type === 'dismissed' && Platform.OS === 'ios') {
    }
  };

  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const statuses: FormStatus[] = ['todo', 'in-progress', 'completed'];

  type FormItemType = 
    | { type: 'textInput'; label: string; value: string; onChangeText: (text: string) => void; placeholder: string; required?: boolean; id: string; multiline?: boolean; numberOfLines?: number }
    | { type: 'datePicker'; label: string; value?: Date; onPress: () => void; id: string }
    | { type: 'segmentedControl'; label: string; options: string[]; selectedValue: string; onSelect: (value: any) => void; id: string }
    | { type: 'multiUserPicker'; users: UserProfile[]; selectedUserIds: string[]; onSelectionChange: (ids: string[]) => void; id: string }
    | { type: 'buttonGroup'; id: string };

  const formItems: FormItemType[] = [
    { type: 'textInput', label: 'Title', value: title, onChangeText: setTitle, placeholder: 'Enter task title', required: true, id: 'title' },
    { type: 'textInput', label: 'Description', value: description, onChangeText: setDescription, placeholder: 'Enter task description (optional)', multiline: true, numberOfLines: 3, id: 'description' },
    { type: 'datePicker', label: 'Due Date', value: dueDate, onPress: () => setShowDatePicker(true), id: 'dueDate' },
    { type: 'segmentedControl', label: 'Priority', options: priorities, selectedValue: priority, onSelect: setPriority, id: 'priority' },
    { type: 'segmentedControl', label: 'Status', options: statuses, selectedValue: status, onSelect: setStatus, id: 'status' },
    { type: 'multiUserPicker', users: assignableUsers, selectedUserIds: assignedToUserIds, onSelectionChange: setAssignedToUserIds, id: 'assignees' },
    { type: 'buttonGroup', id: 'buttons' },
  ];

  const renderFormItem = ({ item }: { item: FormItemType }) => {
    switch (item.type) {
      case 'textInput':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{item.label} {item.required && <Text style={styles.requiredStar}>*</Text>}</Text>
            <TextInput
              style={[styles.input, item.multiline && styles.textArea]}
              value={item.value}
              onChangeText={item.onChangeText}
              placeholder={item.placeholder}
              placeholderTextColor={Colors.light.textSecondary}
              multiline={item.multiline}
              numberOfLines={item.numberOfLines}
            />
          </View>
        );
      case 'datePicker':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <TouchableOpacity onPress={item.onPress} style={styles.dateDisplay}>
              <Text style={styles.dateText}>
                {item.value ? item.value.toLocaleDateString() : 'Select a date'}
              </Text>
              <Ionicons name="calendar-outline" size={22} color={Colors.light.icon} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate || new Date()} // Fallback to new Date() if dueDate is undefined
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}
            {/* On iOS, you might want to wrap the DateTimePicker in a Modal with Done/Cancel buttons */}
            {/* For simplicity, this example shows it inline or relies on default OS behavior */}
          </View>
        );
      case 'segmentedControl':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.segmentedControl}>
              {item.options.map((opt: string) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.segmentButton, item.selectedValue === opt && styles.segmentButtonActive]}
                  onPress={() => item.onSelect(opt)}
                >
                  <Text style={[styles.segmentText, item.selectedValue === opt && styles.segmentTextActive]}>{opt.replace('-', ' ')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'multiUserPicker':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Assignees</Text>
            <Text style={styles.placeholderText}>Only team members can be assigned to tasks</Text>
            <MultiUserPicker
              users={item.users}
              selectedUserIds={item.selectedUserIds}
              onSelectionChange={item.onSelectionChange}
            />
          </View>
        );
      case 'buttonGroup':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                {initialTask?.id ? 'Update Task' : 'Create Task'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{formTitle}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={formItems}
        renderItem={renderFormItem}
        keyExtractor={item => item.id}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View />}
        ListFooterComponent={<View />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.backgroundPaper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  headerButton: {
    padding: 5,
  },
  headerButtonText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  requiredStar: {
    color: Colors.light.error,
  },
  input: {
    backgroundColor: Colors.light.backgroundPaper,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 5,
    fontStyle: 'italic',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundPaper,
  },
  segmentButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  segmentText: {
    fontSize: 14,
    color: Colors.light.tint,
    textTransform: 'capitalize',
  },
  segmentTextActive: {
    color: Colors.light.primaryContrastText,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: Colors.light.backgroundPaper,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: Colors.light.primaryContrastText,
  },
  cancelButtonText: {
    color: Colors.light.textSecondary,
  },
});

export default TaskForm;
