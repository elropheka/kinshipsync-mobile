import React, { useState, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'; // Adjust path as needed
// Styles imported from component-specific styles file
import { CreateGuestPayload, GuestStatus } from '../../types/eventTypes'; // Adjust path
import { useAlert } from '@/context/AlertContext';
import PhoneInputLibrary from '@perttu/react-native-phone-number-input';
import { isValidE164Format } from '../../utils/phoneUtils';

// Type assertion to fix React 19 compatibility issue with class components
const PhoneInput = PhoneInputLibrary as any as React.ComponentType<any>;

interface InviteGuestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (guestData: CreateGuestPayload) => Promise<void>; // Make onSubmit async
  currentEventName?: string;
}

const GUEST_STATUS_OPTIONS_FOR_INVITE: GuestStatus[] = ['Invited', 'accepted', 'pending', 'declined'];


const InviteGuestModal: React.FC<InviteGuestModalProps> = ({ visible, onClose, onSubmit, currentEventName }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<GuestStatus>('Invited');
  const [plusOnes, setPlusOnes] = useState<number>(0);
  const [defaultCountryCode, setDefaultCountryCode] = useState<string>('US');
  const phoneInputRef = useRef<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useAlert();

  const handleFormSubmit = async () => {
    if (!name.trim()) {
      showError('Validation Error', 'Guest name is required.');
      return;
    }
    if (email.trim() && !email.includes('@')) {
        showError('Validation Error', 'Please enter a valid email address.');
        return;
    }

    // Get phone number from ref if available, otherwise use state
    let phoneNumberFromRef: string | undefined = undefined;
    if (phoneInputRef.current) {
      try {
        // Get the formatted phone number from the ref
        const phoneData = phoneInputRef.current.getNumberAfterPossiblyEliminatingZero?.();
        if (phoneData?.formattedNumber && phoneData.formattedNumber.trim()) {
          phoneNumberFromRef = phoneData.formattedNumber.trim();
        }
      } catch (e) {
        console.log("Could not get phone number from ref:", e);
      }
    }

    // Validate phone number - ensure it's in E164 format if provided
    let phoneNumberToSave: string | undefined = undefined;
    const phoneToValidate = phoneNumberFromRef || phone.trim();
    if (phoneToValidate) {
      // Check if it's a valid E164 format and has more than just a country code
      // E164 format: +[country code][number], minimum length is usually +[1-3 digits][at least 4-7 digits]
      if (isValidE164Format(phoneToValidate) && phoneToValidate.length > 4) {
        phoneNumberToSave = phoneToValidate;
      } else if (phoneToValidate.length <= 4) {
        // If it's too short, it's likely just a country code
        showError("Invalid Phone Number", "Please enter a complete phone number, not just the country code.");
        return;
      } else {
        // If phone number is provided but not in E164 format, show error
        showError("Invalid Phone Number", "Please enter a valid phone number in international format.");
        return;
      }
    }

    setIsSubmitting(true);
    const guestData: CreateGuestPayload = {
      name: name.trim(),
      firstName: name.trim().split(' ')[0] || '',
      lastName: name.trim().split(' ').slice(1).join(' ') || '',
      email: email.trim() || undefined, // Send undefined if empty, not an empty string
      phone: phoneNumberToSave,
      notes: notes.trim() || '',
      status,
      plusOnes: Number(plusOnes) || 0,
    };

    try {
      await onSubmit(guestData);
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setStatus('Invited');
      setPlusOnes(0);
    } catch (error) {
      console.error("Error submitting guest invite form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    // Reset form fields when closing
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setStatus('Invited');
    setPlusOnes(0);
    onClose();
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Guest{currentEventName ? ` to ${currentEventName}` : ''}</Text>
              <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
                <Ionicons name="close-circle-outline" size={28} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter guest's full name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={Colors.light.grey}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="guest@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.light.grey}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <PhoneInput
                ref={phoneInputRef}
                defaultValue={phone}
                defaultCode={defaultCountryCode}
                layout="first"
                onChangeText={(text: string) => {
                  // This gives us the raw number without country code
                  // We'll rely on onChangeFormattedText for the full number
                }}
                onChangeFormattedText={(formattedText: string) => {
                  // This gives us the full E164 formatted number with country code
                  setPhone(formattedText);
                }}
                containerStyle={styles.phoneInputContainer}
                textContainerStyle={styles.phoneInputTextContainer}
                textInputStyle={styles.phoneInputText}
                codeTextStyle={styles.phoneInputCodeText}
                flagButtonStyle={styles.phoneInputFlagButton}
                countryPickerButtonStyle={styles.phoneInputCountryPicker}
                textInputProps={{
                  placeholder: "(Optional)",
                  placeholderTextColor: Colors.light.grey,
                }}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number of +1s</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={String(plusOnes)}
                onChangeText={(text) => setPlusOnes(Number(text) || 0)}
                keyboardType="number-pad"
                placeholderTextColor={Colors.light.grey}
              />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Initial RSVP Status</Text>
                <View style={styles.statusSelectionContainer}>
                    {GUEST_STATUS_OPTIONS_FOR_INVITE.map(s => (
                        <TouchableOpacity 
                            key={s} 
                            style={[styles.statusChip, status === s && styles.statusChipSelected]}
                            onPress={() => setStatus(s)}
                        >
                            <Text style={[styles.statusChipText, status === s && styles.statusChipTextSelected]}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any additional details (e.g., dietary restrictions, relationship to host)"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                placeholderTextColor={Colors.light.grey}
              />
            </View>

            <TouchableOpacity 
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
                onPress={handleFormSubmit}
                disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>{isSubmitting ? 'Inviting...' : 'Send Invitation'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose} disabled={isSubmitting}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns modal to bottom
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%', // Max height to ensure it doesn't cover entire screen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 5,
    fontWeight: '500',
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow chips to wrap
    justifyContent: 'flex-start', // Align chips to the start
    marginBottom: 10,
  },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundPaper,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginRight: 8,
    marginBottom: 8,
  },
  statusChipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  statusChipText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  statusChipTextSelected: {
    color: Colors.dark.text, // Assuming primary contrast text is dark
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.primaryLight,
  },
  submitButtonText: {
    color: Colors.dark.text, // Assuming primary contrast text is dark
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: Colors.light.textSecondary,
    borderWidth: 1,
    marginBottom: 10, // Space at the bottom
  },
  cancelButtonText: {
    color: Colors.light.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInputContainer: {
    backgroundColor: Colors.light.backgroundPaper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    width: '100%',
  },
  phoneInputTextContainer: {
    backgroundColor: Colors.light.backgroundPaper,
    paddingVertical: 0,
  },
  phoneInputText: {
    fontSize: 16,
    color: Colors.light.text,
    padding: 10,
  },
  phoneInputCodeText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  phoneInputFlagButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  phoneInputCountryPicker: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

export default InviteGuestModal;
