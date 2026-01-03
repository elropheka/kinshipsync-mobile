import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Schedule, ScheduleFormData } from '../../../types/scheduleTypes';
import { UserProfile } from '../../../types/userTypes';
import { useAppTheme } from '@/context/AppThemeContext';
import MultiUserPicker from '../../common/MultiUserPicker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAlert } from '@/context/AlertContext';

interface ScheduleFormProps {
  initialSchedule?: Partial<Schedule> & { id?: string };
  assignableUsers: UserProfile[];
  onSubmit: (scheduleData: ScheduleFormData, scheduleId?: string) => void;
  onCancel: () => void;
  formTitle?: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialSchedule,
  assignableUsers,
  onSubmit,
  onCancel,
  formTitle = 'Schedule Details',
}) => {
  const { currentColors } = useAppTheme();
  const { showError } = useAlert();
  const [title, setTitle] = useState(initialSchedule?.title || '');
  const [description, setDescription] = useState(initialSchedule?.description || '');
  
  const [startTime, setStartTime] = useState<Date | undefined>(
    initialSchedule?.startTime ? new Date(initialSchedule.startTime as any) : undefined
  );
  const [endTime, setEndTime] = useState<Date | undefined>(
    initialSchedule?.endTime ? new Date(initialSchedule.endTime as any) : undefined
  );

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [assignedToUserIds, setAssignedToUserIds] = useState<string[]>(
    initialSchedule?.assignedUserIds || []
  );

  useEffect(() => {
    if (initialSchedule) {
      setTitle(initialSchedule.title || '');
      setDescription(initialSchedule.description || '');
      setStartTime(initialSchedule.startTime ? new Date(initialSchedule.startTime as any) : undefined);
      setEndTime(initialSchedule.endTime ? new Date(initialSchedule.endTime as any) : undefined);
      setAssignedToUserIds(initialSchedule.assignedUserIds || []);
    }
  }, [initialSchedule]);

  const handleSubmit = () => {
    if (!title.trim()) {
      showError('Validation Error', 'Schedule title cannot be empty.');
      return;
    }
    if (!startTime) {
      showError('Validation Error', 'Start time is required.');
      return;
    }
    if (!endTime) {
      showError('Validation Error', 'End time is required.');
      return;
    }
    if (endTime <= startTime) {
      showError('Validation Error', 'End time must be after start time.');
      return;
    }

    const scheduleData: ScheduleFormData = {
      title: title.trim(),
      description: description.trim(),
      startTime,
      endTime,
      assignedUserIds: assignedToUserIds,
    };

    onSubmit(scheduleData, initialSchedule?.id);
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate: Date | undefined, type: 'start' | 'end') => {
    const currentDate = selectedDate;
    if (Platform.OS === 'android') {
      if (type === 'start') {
        setShowStartTimePicker(false);
      } else {
        setShowEndTimePicker(false);
      }
    }

    if (event.type === 'set' && currentDate) {
      if (type === 'start') {
        setStartTime(currentDate);
      } else {
        setEndTime(currentDate);
      }
    }
  };
  
  const formatDate = (date?: Date) => {
    return date ? date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Select date & time';
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
  }), [currentColors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={currentColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{formTitle}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter schedule title"
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter schedule description (optional)"
            placeholderTextColor={currentColors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Start Time <Text style={styles.requiredStar}>*</Text></Text>
          <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.dateDisplay}>
            <Text style={styles.dateText}>{formatDate(startTime)}</Text>
            <Ionicons name="time-outline" size={22} color={currentColors.icon} />
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime || new Date()}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => onTimeChange(event, date, 'start')}
            />
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>End Time <Text style={styles.requiredStar}>*</Text></Text>
          <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.dateDisplay}>
            <Text style={styles.dateText}>{formatDate(endTime)}</Text>
            <Ionicons name="time-outline" size={22} color={currentColors.icon} />
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime || startTime || new Date()}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => onTimeChange(event, date, 'end')}
              minimumDate={startTime}
            />
          )}
        </View>
        
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>Assign Members</Text>
            <MultiUserPicker
                users={assignableUsers}
                selectedUserIds={assignedToUserIds}
                onSelectionChange={setAssignedToUserIds}
            />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={[styles.buttonText, styles.submitButtonText]}>
              {initialSchedule?.id ? 'Update Schedule' : 'Create Schedule'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleForm;
