import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../styles/components/events/RsvpPreferenceForm.styles';

interface RsvpPreferences {
  dietaryRestrictions?: string[];
  plusOne?: boolean;
  plusOneName?: string;
  otherNotes?: string;
}

interface RsvpItem {
  id: string;
  guestName: string;
  eventName: string;
  status: 'Attending' | 'Not Attending' | 'Pending';
  preferences?: RsvpPreferences;
}

interface RsvpPreferenceFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (itemData: RsvpItem) => void;
  initialRsvpData: RsvpItem | null; // Changed to RsvpItem | null
}

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Nut-Free', 'Halal', 'Kosher', 'Pescatarian', 'Other'
];

const RsvpPreferenceForm: React.FC<RsvpPreferenceFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialRsvpData,
}) => {
  const [status, setStatus] = useState<'Attending' | 'Not Attending' | 'Pending'>('Pending');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [otherNotes, setOtherNotes] = useState('');

  useEffect(() => {
    if (initialRsvpData) {
      setStatus(initialRsvpData.status);
      setSelectedDietary(initialRsvpData.preferences?.dietaryRestrictions || []);
      setPlusOne(initialRsvpData.preferences?.plusOne || false);
      setPlusOneName(initialRsvpData.preferences?.plusOneName || '');
      setOtherNotes(initialRsvpData.preferences?.otherNotes || '');
    } else {
      setStatus('Pending');
      setSelectedDietary([]);
      setPlusOne(false);
      setPlusOneName('');
      setOtherNotes('');
    }
  }, [initialRsvpData, visible]);

  const handleDietarySelect = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (!initialRsvpData) return; // Should always have initial data

    const updatedPreferences: RsvpPreferences = {
      dietaryRestrictions: selectedDietary.length > 0 ? selectedDietary : undefined,
      plusOne: status === 'Attending' ? plusOne : undefined, // Only relevant if attending
      plusOneName: status === 'Attending' && plusOne ? plusOneName.trim() : undefined,
      otherNotes: otherNotes.trim() ? otherNotes.trim() : undefined,
    };
    
    Object.keys(updatedPreferences).forEach(key => {
        const K = key as keyof RsvpPreferences;
        if (updatedPreferences[K] === undefined || (Array.isArray(updatedPreferences[K]) && (updatedPreferences[K] as string[]).length === 0)) {
            delete updatedPreferences[K];
        }
    });


    onSubmit({
      ...initialRsvpData,
      status,
      preferences: Object.keys(updatedPreferences).length > 0 ? updatedPreferences : undefined,
    });
    onClose();
  };
  
  const statusOptions: RsvpItem['status'][] = ['Attending', 'Not Attending', 'Pending'];

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit RSVP: {initialRsvpData?.guestName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.eventNameText}>Event: {initialRsvpData?.eventName}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>RSVP Status*</Text>
              <View style={styles.statusSelectorContainer}>
                {statusOptions.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.statusButton, status === opt && styles.statusButtonSelected]}
                    onPress={() => setStatus(opt)}
                  >
                    <Text style={[styles.statusButtonText, status === opt && styles.statusButtonTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {status === 'Attending' && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Dietary Restrictions</Text>
                  <View style={styles.dietaryOptionsContainer}>
                    {DIETARY_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dietaryOptionButton,
                          selectedDietary.includes(option) && styles.dietaryOptionButtonSelected,
                        ]}
                        onPress={() => handleDietarySelect(option)}
                      >
                        <Text
                          style={[
                            styles.dietaryOptionText,
                            selectedDietary.includes(option) && styles.dietaryOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                        {selectedDietary.includes(option) && (
                           <Icon name="check-circle" size={18} color="#fff" style={styles.checkIcon}/>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.inputLabel}>Bringing a +1 Guest?</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={plusOne ? "#007AFF" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={setPlusOne}
                            value={plusOne}
                        />
                    </View>
                </View>

                {plusOne && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>+1 Guest Name</Text>
                    <TextInput
                      style={styles.input}
                      value={plusOneName}
                      onChangeText={setPlusOneName}
                      placeholder="Enter guest's name"
                    />
                  </View>
                )}
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Other Notes</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={otherNotes}
                onChangeText={setOtherNotes}
                placeholder="E.g., Special requests, comments"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Save RSVP</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RsvpPreferenceForm;
