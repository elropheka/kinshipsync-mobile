import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Idea, CreateIdeaPayload, UpdateIdeaPayload } from '../../types/eventTypes';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAlert } from '@/context/AlertContext';

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
  formTitle: _formTitle = 'Event Idea',
}) => {
  const { currentColors } = useAppTheme();
  const { showError } = useAlert();
  const [title, setTitle] = useState(initialIdea?.title || '');
  const [description, setDescription] = useState(initialIdea?.description || '');
  const [category, setCategory] = useState(initialIdea?.category || 'General');

  const handleSubmit = () => {
    if (!title.trim()) {
      showError('Validation Error', 'Idea title cannot be empty.');
      return;
    }

    const commonData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
    };

    if (initialIdea?.id) {
      const updatePayload: UpdateIdeaPayload = commonData;
      onSubmit(updatePayload, initialIdea.id);
    } else {
      const createPayload: CreateIdeaPayload = commonData;
      onSubmit(createPayload);
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
      height: 100,
      textAlignVertical: 'top',
    },
  }), [currentColors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={currentColors.text} />
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
            placeholderTextColor={currentColors.textSecondary}
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
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Entertainment, Food, Decoration"
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IdeaForm;
