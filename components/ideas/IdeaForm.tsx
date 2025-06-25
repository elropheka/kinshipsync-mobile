import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Idea, CreateIdeaPayload, UpdateIdeaPayload } from '../../types/eventTypes';
import { Colors } from '../../constants/Colors';

interface IdeaFormProps {
  initialIdea?: Partial<Idea> & { id?: string };
  onSubmit: (ideaData: CreateIdeaPayload | UpdateIdeaPayload, ideaId?: string) => void;
  onCancel: () => void;
  formTitle?: string;
}

const IdeaForm: React.FC<IdeaFormProps> = ({
  initialIdea,
  onSubmit,
  onCancel,
  formTitle = 'Event Idea',
}) => {
  const [title, setTitle] = useState(initialIdea?.title || '');
  const [description, setDescription] = useState(initialIdea?.description || '');
  // Votes are typically handled by a separate action, not directly in the form for creation/update of title/desc

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Idea title cannot be empty.');
      return;
    }

    const commonData = {
      title: title.trim(),
      description: description.trim(),
    };

    if (initialIdea?.id) {
      // For updating, we only send title and description. Votes are updated separately.
      const updatePayload: UpdateIdeaPayload = commonData;
      onSubmit(updatePayload, initialIdea.id);
    } else {
      // For creating, submittedBy and initial votes are handled by the service/hook.
      const createPayload: CreateIdeaPayload = commonData;
      onSubmit(createPayload);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundPrimary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{initialIdea?.id ? 'Edit Idea' : 'Add New Idea'}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Idea Title <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Photo Booth, Live Band"
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Details about the idea (optional)"
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusing similar styles
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
    height: 100,
    textAlignVertical: 'top',
  },
});

export default IdeaForm;
