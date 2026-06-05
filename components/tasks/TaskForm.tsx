import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Platform, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../../types/eventTypes';
import { UserProfile } from '../../types/userTypes';
import { useAppTheme } from '@/context/AppThemeContext';
import MultiUserPicker from '../common/MultiUserPicker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAlert } from '@/context/AlertContext';

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
  const { currentColors } = useAppTheme();
  const { showError } = useAlert();
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
      showError('Validation Error', 'Task title cannot be empty.');
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
      if (event.type === 'set' && currentDate) {
        setDueDate(currentDate);
      }
    } else if (Platform.OS === 'ios') {
      if (currentDate) {
        setDueDate(currentDate);
      }
    }
  };

  const handleDatePickerDone = () => {
    setShowDatePicker(false);
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
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
              placeholderTextColor={currentColors.textSecondary}
              multiline={item.multiline}
              numberOfLines={item.numberOfLines}
              onFocus={() => setShowDatePicker(false)}
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
              <Ionicons name="calendar-outline" size={22} color={currentColors.icon} />
            </TouchableOpacity>
            {showDatePicker && (
              <>
                {Platform.OS === 'android' && (
                  <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                  />
                )}
                {Platform.OS === 'ios' && (
                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showDatePicker}
                    onRequestClose={handleDatePickerCancel}
                  >
                    <View style={styles.iosPickerModalOverlay}>
                      <View style={styles.iosPickerModalContent}>
                        <View style={styles.iosPickerHeader}>
                          <TouchableOpacity onPress={handleDatePickerCancel}>
                            <Text style={styles.iosPickerButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <Text style={styles.iosPickerTitle}>Select Date</Text>
                          <TouchableOpacity onPress={handleDatePickerDone}>
                            <Text style={styles.iosPickerButtonText}>Done</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={dueDate || new Date()}
                          mode="date"
                          display="spinner"
                          onChange={onDateChange}
                          style={styles.iosPicker}
                          textColor={currentColors.primary}
                        />
                      </View>
                    </View>
                  </Modal>
                )}
              </>
            )}
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
                  onPress={() => {
                    setShowDatePicker(false);
                    item.onSelect(opt);
                  }}
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
            <Text style={styles.placeholderText}>
              {item.users.length > 0 
                ? "Only team members can be assigned to tasks" 
                : "No team members available. Task will be assigned to you by default."}
            </Text>
            {item.users.length > 0 ? (
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <MultiUserPicker
                  users={item.users}
                  selectedUserIds={item.selectedUserIds}
                  onSelectionChange={item.onSelectionChange}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.noUsersContainer}>
                <Text style={styles.noUsersText}>No team members found</Text>
              </View>
            )}
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

  const styles = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: currentColors.backgroundPaper,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
      backgroundColor: currentColors.background,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentColors.text,
    },
    headerButton: {
      padding: 5,
    },
    headerButtonText: {
      fontSize: 16,
      color: currentColors.primary,
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
      color: currentColors.textSecondary,
      marginBottom: 8,
      fontWeight: '500',
    },
    requiredStar: {
      color: currentColors.error,
    },
    input: {
      backgroundColor: currentColors.backgroundPaper,
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: currentColors.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    dateDisplay: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: currentColors.backgroundPaper,
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    dateText: {
      fontSize: 16,
      color: currentColors.text,
    },
    placeholderText: {
      fontSize: 14,
      color: currentColors.textSecondary,
      marginTop: 5,
      fontStyle: 'italic',
    },
    segmentedControl: {
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentColors.tint,
      overflow: 'hidden',
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentColors.backgroundPaper,
    },
    segmentButtonActive: {
      backgroundColor: currentColors.tint,
    },
    segmentText: {
      fontSize: 14,
      color: currentColors.tint,
      textTransform: 'capitalize',
    },
    segmentTextActive: {
      color: currentColors.primaryContrastText,
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
      backgroundColor: currentColors.primary,
      marginLeft: 10,
    },
    cancelButton: {
      backgroundColor: currentColors.backgroundPaper,
      borderWidth: 1,
      borderColor: currentColors.border,
      marginRight: 10,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    submitButtonText: {
      color: currentColors.primaryContrastText,
    },
    cancelButtonText: {
      color: currentColors.textSecondary,
    },
    noUsersContainer: {
      backgroundColor: currentColors.backgroundPaper,
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noUsersText: {
      fontSize: 14,
      color: currentColors.textSecondary,
      fontStyle: 'italic',
    },
    iosPickerModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    iosPickerModalContent: {
      backgroundColor: currentColors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 10,
    },
    iosPickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
    },
    iosPickerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: currentColors.primary,
    },
    iosPickerButtonText: {
      fontSize: 16,
      color: currentColors.primary,
      fontWeight: '600',
    },
    iosPicker: {
      width: '100%',
    },
  }), [currentColors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={currentColors.text} />
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

export default TaskForm;
