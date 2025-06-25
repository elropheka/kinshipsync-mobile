import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../styles/components/events/ScheduleItemForm.styles';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface ScheduleItem {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  description?: string;
  responsiblePerson?: string;
}

interface ScheduleItemFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (itemData: Omit<ScheduleItem, 'id'> & { id?: string }) => void;
  initialData?: ScheduleItem | null;
}

const ScheduleItemForm: React.FC<ScheduleItemFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');

  // Date/Time state
  const [formStartTime, setFormStartTime] = useState(new Date());
  const [formEndTime, setFormEndTime] = useState(new Date());

  const [pickerMode, setPickerMode] = useState<'date' | 'time' | 'none'>('none');
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end' | null>(null);
  // currentPickerDate is the date object that DateTimePicker will directly manipulate
  const [currentPickerDate, setCurrentPickerDate] = useState(new Date());

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setFormStartTime(new Date(initialData.startTime)); // Ensure it's a new Date object
      setFormEndTime(new Date(initialData.endTime));     // Ensure it's a new Date object
      setDescription(initialData.description || '');
      setLocation(initialData.location || '');
      setResponsiblePerson(initialData.responsiblePerson || '');
    } else {
      // Reset form for new item
      setTitle('');
      const now = new Date();
      const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
      setFormStartTime(startOfHour);
      setFormEndTime(new Date(startOfHour.getTime() + 60 * 60 * 1000)); // Default to 1 hour later
      setDescription('');
      setLocation('');
      setResponsiblePerson('');
    }
  }, [initialData, visible]); // Re-run if initialData or visibility changes

  const handlePickerChange = (event: DateTimePickerEvent, selectedValue?: Date) => {
    const currentDateValue = selectedValue || (pickerTarget === 'start' ? formStartTime : formEndTime);
    if (Platform.OS === 'android') {
      setPickerMode('none'); // Hide picker immediately on Android
    }

    if (event.type === 'dismissed' && Platform.OS === 'ios') {
      // On iOS, if "Cancel" is hit, we don't change anything, just close
      // setPickerMode('none'); // This will be handled by the Done/Cancel buttons in iOS modal
      return;
    }
    
    if (selectedValue) {
        setCurrentPickerDate(selectedValue); // Keep currentPickerDate updated for iOS spinner
        if (pickerTarget === 'start') {
            if (pickerMode === 'date') {
                const newStartTime = new Date(formStartTime);
                newStartTime.setFullYear(selectedValue.getFullYear(), selectedValue.getMonth(), selectedValue.getDate());
                setFormStartTime(newStartTime);
            } else if (pickerMode === 'time') {
                const newStartTime = new Date(formStartTime);
                newStartTime.setHours(selectedValue.getHours(), selectedValue.getMinutes(), 0, 0);
                setFormStartTime(newStartTime);
            }
        } else if (pickerTarget === 'end') {
            if (pickerMode === 'date') {
                const newEndTime = new Date(formEndTime);
                newEndTime.setFullYear(selectedValue.getFullYear(), selectedValue.getMonth(), selectedValue.getDate());
                setFormEndTime(newEndTime);
            } else if (pickerMode === 'time') {
                const newEndTime = new Date(formEndTime);
                newEndTime.setHours(selectedValue.getHours(), selectedValue.getMinutes(), 0, 0);
                setFormEndTime(newEndTime);
            }
        }
    }
    // For Android, picker is already hidden. For iOS, it's handled by Done/Cancel.
  };
  
  const showDateTimePicker = (target: 'start' | 'end', mode: 'date' | 'time') => {
    setPickerTarget(target);
    setPickerMode(mode);
    setCurrentPickerDate(target === 'start' ? new Date(formStartTime) : new Date(formEndTime)); // Ensure picker starts with current value
  };

  const handleDoneIOS = () => {
    // Apply the final value from currentPickerDate (which was updated by the spinner)
    if (pickerTarget === 'start') {
        setFormStartTime(new Date(currentPickerDate));
    } else if (pickerTarget === 'end') {
        setFormEndTime(new Date(currentPickerDate));
    }
    setPickerMode('none');
  };

  const handleCancelIOS = () => {
    setPickerMode('none');
  };


  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Please enter a title for the schedule item.');
      return;
    }
    if (formEndTime <= formStartTime) {
      alert('End time must be after start time.');
      return;
    }
    onSubmit({
      id: initialData?.id, // Include id if editing
      title,
      startTime: formStartTime,
      endTime: formEndTime,
      description,
      location,
      responsiblePerson,
    });
    onClose(); // Close modal after submit
  };

  const formatDate = (date: Date) => date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{initialData ? 'Edit Schedule Item' : 'Add Schedule Item'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title*</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="E.g., Registration" />
            </View>

            {/* Start Date */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Start Date*</Text>
              <TouchableOpacity style={styles.input} onPress={() => showDateTimePicker('start', 'date')}>
                <View style={styles.datePickerInnerContainer}>
                  <Text style={styles.datePickerText}>{formatDate(formStartTime)}</Text>
                  <Icon name="calendar-today" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Start Time */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Start Time*</Text>
              <TouchableOpacity style={styles.input} onPress={() => showDateTimePicker('start', 'time')}>
                <View style={styles.datePickerInnerContainer}>
                  <Text style={styles.datePickerText}>{formatTime(formStartTime)}</Text>
                  <Icon name="access-time" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* End Date */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>End Date*</Text>
              <TouchableOpacity style={styles.input} onPress={() => showDateTimePicker('end', 'date')}>
                <View style={styles.datePickerInnerContainer}>
                  <Text style={styles.datePickerText}>{formatDate(formEndTime)}</Text>
                  <Icon name="calendar-today" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* End Time */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>End Time*</Text>
              <TouchableOpacity style={styles.input} onPress={() => showDateTimePicker('end', 'time')}>
                <View style={styles.datePickerInnerContainer}>
                  <Text style={styles.datePickerText}>{formatTime(formEndTime)}</Text>
                  <Icon name="access-time" size={20} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {pickerMode !== 'none' && (
              <>
                {Platform.OS === 'android' && (
                  <DateTimePicker
                    value={currentPickerDate}
                    mode={pickerMode as 'date' | 'time'}
                    is24Hour={true}
                    display="default"
                    onChange={handlePickerChange}
                  />
                )}
                {Platform.OS === 'ios' && (
                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={(pickerMode === 'date') || (pickerMode === 'time')}
                    onRequestClose={handleCancelIOS}
                  >
                    <View style={styles.iosPickerModalOverlay}>
                      <View style={styles.iosPickerModalContent}>
                        <View style={styles.iosPickerHeader}>
                          <TouchableOpacity onPress={handleCancelIOS}>
                            <Text style={styles.iosPickerButtonText}>Cancel</Text>
                          </TouchableOpacity>
                          <Text style={styles.iosPickerTitle}>Select {pickerMode === 'date' ? 'Date' : 'Time'}</Text>
                          <TouchableOpacity onPress={handleDoneIOS}>
                            <Text style={styles.iosPickerButtonText}>Done</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={currentPickerDate}
                          mode={pickerMode as 'date' | 'time'}
                          is24Hour={true}
                          display="spinner"
                          onChange={handlePickerChange} // This updates currentPickerDate live
                          style={{ width: '100%' }}
                        />
                      </View>
                    </View>
                  </Modal>
                )}
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location (Optional)</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="E.g., Main Hall" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="E.g., Details about this activity"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Responsible Person/Team (Optional)</Text>
              <TextInput style={styles.input} value={responsiblePerson} onChangeText={setResponsiblePerson} placeholder="E.g., John Doe or Catering Team" />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {initialData ? 'Save Changes' : 'Add Item'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ScheduleItemForm;
