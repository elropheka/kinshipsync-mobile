import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors'; // Adjust path as needed
import { styles as globalStyles } from '../../styles/app/(events)/guests.styles'; // Reuse some global styles if applicable, or create new ones
import { CreateGuestPayload, GuestStatus } from '../../types/eventTypes'; // Adjust path
import CustomAlert from '../common/alert';

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'error';
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, type: 'error', title, message });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const handleFormSubmit = async () => {
    if (!name.trim()) {
      showAlert('Validation Error', 'Guest name is required.');
      return;
    }
    if (email.trim() && !email.includes('@')) {
        showAlert('Validation Error', 'Please enter a valid email address.');
        return;
    }

    setIsSubmitting(true);
    const guestData: CreateGuestPayload = {
      name: name.trim(),
      firstName: name.trim().split(' ')[0] || '',
      lastName: name.trim().split(' ').slice(1).join(' ') || '',
      email: email.trim() || undefined, // Send undefined if empty, not an empty string
      phone: phone.trim() || undefined,
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
              <TextInput
                style={styles.input}
                placeholder="(Optional)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.light.grey}
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
      
      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={hideAlert}
        position="top"
        showIcon={true}
        closable={true}
      />
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
});

export default InviteGuestModal;
