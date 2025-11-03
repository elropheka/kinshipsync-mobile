import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Modal,  StatusBar, Image, ActivityIndicator, ScrollView } from 'react-native';
import RichTextEditor from '@/components/common/RichTextEditor';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/services/storageService';
import { WebsitePayload, UpdateEventWebsiteDetailsPayload, EventWebsiteSection, Theme } from '@/types/eventTypes';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { generateSlug, isValidSlug, suggestEventSlug } from '../../utils/eventWebsiteUtils';

interface EventWebsiteFormProps {
  eventId?: string; 
  initialWebsiteData?: WebsitePayload;
  onSubmit: (websiteData: UpdateEventWebsiteDetailsPayload) => void;
  onCancel: () => void;
}

const EventWebsiteForm: React.FC<EventWebsiteFormProps> = ({
  eventId: propEventId,
  initialWebsiteData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialWebsiteData?.title || '');
  const [customUrlSlug, setCustomUrlSlug] = useState(initialWebsiteData?.customUrlSlug || '');
  const [headerImageUrl, setHeaderImageUrl] = useState(initialWebsiteData?.headerImageUrl || '');
  const [isUploadingHeader, setIsUploadingHeader] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(initialWebsiteData?.welcomeMessage || '');
  const [sections, setSections] = useState<EventWebsiteSection[]>(initialWebsiteData?.sections || []);
  const [published, setPublished] = useState(initialWebsiteData?.published || false); 
  const { availableThemes, theme: currentGlobalTheme} = useTheme();
  const [selectedWebsiteThemeId, setSelectedWebsiteThemeId] = useState<string | undefined>(
    initialWebsiteData?.websiteThemeId || currentGlobalTheme.id
  );
  const [isThemePickerVisible, setThemePickerVisible] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);


  const eventId = propEventId;

  useEffect(() => {
    const selectedThemeObject = availableThemes.find(t => t.id === selectedWebsiteThemeId);
    if (selectedThemeObject) {
      setPreviewTheme(selectedThemeObject);
    } else {
      setPreviewTheme(null);
    }
  }, [selectedWebsiteThemeId, availableThemes]);

  const handleSectionChange = (index: number, field: keyof EventWebsiteSection, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const addSection = () => {
   
    const newSectionId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setSections([...sections, { id: newSectionId, title: '', content: '', order: sections.length }]);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
   
    setSections(updatedSections.map((s, i) => ({ ...s, order: i })));
  };

  const handlePickHeaderImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access camera roll is required.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], 
      quality: 0.8,
    });

    if (pickerResult.canceled === true) {
      return;
    }

    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const imageUri = pickerResult.assets[0].uri;
      setIsUploadingHeader(true);
      try {
        const uploadResult = await uploadImage(imageUri, 'event_website_headers', eventId); 
        setHeaderImageUrl(uploadResult.imageUrl);
        Alert.alert("Image Uploaded", "Header image has been updated.");
      } catch (uploadError: any) {
        console.error("Header image upload failed:", uploadError);
        Alert.alert("Upload Failed", `Could not upload header image: ${uploadError.message}`);
      } finally {
        setIsUploadingHeader(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Website title cannot be empty.');
      return;
    }

    const trimmedCustomUrlSlug = customUrlSlug.trim();
    if (trimmedCustomUrlSlug && !isValidSlug(trimmedCustomUrlSlug)) {
      Alert.alert(
        'Invalid URL Slug',
        'URL slug can only contain lowercase letters, numbers, and hyphens. It cannot start or end with a hyphen.'
      );
      return;
    }
   
    const trimmedWelcomeMessage = welcomeMessage.trim();

    const payload: UpdateEventWebsiteDetailsPayload = {
      title: title.trim(),
      headerImageUrl: headerImageUrl || undefined, 
      sections: sections.map(s => ({ id: s.id, title: s.title.trim(), content: s.content.trim(), order: s.order })), 
      websiteThemeId: selectedWebsiteThemeId,
      published: published, 
    };

    if (trimmedCustomUrlSlug) {
      payload.customUrlSlug = trimmedCustomUrlSlug;
    }
    if (trimmedWelcomeMessage) {
      payload.welcomeMessage = trimmedWelcomeMessage;
    }
    

    onSubmit(payload);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.accent} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Event Website</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Website Title <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="My Awesome Event Page"
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Custom URL Slug (Optional)</Text>
          <View>
            <TextInput
              style={styles.input}
              value={customUrlSlug}
              onChangeText={(text) => setCustomUrlSlug(generateSlug(text))}
              placeholder="e.g., my-event-2025"
              autoCapitalize="none"
              placeholderTextColor={Colors.light.textSecondary}
            />
            {!customUrlSlug && title && (
              <TouchableOpacity 
                style={styles.suggestButton}
                onPress={() => {
                  const date = new Date().toISOString();
                  setCustomUrlSlug(suggestEventSlug(title, date));
                }}
              >
                <Text style={styles.suggestButtonText}>Suggest URL from title</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Header Image (Optional)</Text>
          {headerImageUrl ? (
            <Image source={{ uri: headerImageUrl }} style={styles.headerPreviewImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color={Colors.light.textSecondary} />
              <Text style={styles.imagePlaceholderText}>No header image selected</Text>
            </View>
          )}
          <TouchableOpacity style={styles.uploadButton} onPress={handlePickHeaderImage} disabled={isUploadingHeader}>
            {isUploadingHeader ? (
              <ActivityIndicator size="small" color={Colors.light.primaryContrastText} />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Header Image</Text>
            )}
          </TouchableOpacity>
          {headerImageUrl && (
             <TouchableOpacity style={[styles.uploadButton, styles.removeImageButton]} onPress={() => setHeaderImageUrl('')} disabled={isUploadingHeader}>
                <Text style={[styles.uploadButtonText, styles.removeImageButtonText]}>Remove Image</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Welcome Message (Optional)</Text>
          <View style={styles.richEditorContainer}>
            <RichTextEditor
              initialContent={welcomeMessage}
              onChangeContent={setWelcomeMessage}
              placeholder="Welcome to our event! We're so excited to celebrate with you."
              minHeight={150}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Website Theme</Text>
          <TouchableOpacity
            style={styles.themeSelectorButton}
            onPress={() => setThemePickerVisible(true)}
          >
            <Text style={styles.themeSelectorButtonText}>
              {availableThemes.find(t => t.id === selectedWebsiteThemeId)?.name || 'Select a theme'}
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          {previewTheme && (
            <View style={[styles.themePreviewContainer, { backgroundColor: previewTheme.colors.background }]}>
              <Text style={[styles.themePreviewTitle, { color: previewTheme.colors.text, fontFamily: previewTheme.fonts.heading.fontFamily }]}>
                {title || "Website Title Preview"}
              </Text>
              <Text style={[styles.themePreviewText, { color: previewTheme.colors.text, fontFamily: previewTheme.fonts.body.fontFamily }]}>
                {welcomeMessage || "Welcome message preview..."}
              </Text>
              <View style={[styles.themePreviewButton, { backgroundColor: previewTheme.colors.primary }]}>
                <Text style={[styles.themePreviewButtonText, { color: previewTheme.colors.text }]}>
                  Button
                </Text>
              </View>
            </View>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isThemePickerVisible}
          onRequestClose={() => setThemePickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Theme</Text>
              <Picker
                selectedValue={selectedWebsiteThemeId}
                onValueChange={(itemValue: string | undefined) => {
                  setSelectedWebsiteThemeId(itemValue);
                }}
                style={styles.pickerInModal}
              >
                {availableThemes.map((themeOption) => (
                  <Picker.Item key={themeOption.id} label={themeOption.name} value={themeOption.id} />
                ))}
              </Picker>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setThemePickerVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Publish Website</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setPublished(!published)}
          >
            <Text style={styles.toggleButtonText}>
              {published ? 'Published (Visible to Public)' : 'Draft (Not Visible)'}
            </Text>
            <Ionicons
              name={published ? 'toggle-sharp' : 'toggle-outline'} 
              size={32}
              color={published ? Colors.light.primary : Colors.light.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionsHeader}>Website Sections</Text>
        <Text style={styles.dragHint}>Hold and drag sections to reorder</Text>
        <DraggableFlatList
            data={sections}
            onDragEnd={({ data }) => setSections(data.map((item, index) => ({ ...item, order: index })))}
            keyExtractor={(item) => item.id}
            renderItem={({ item, drag, isActive, getIndex }) => {
              const index = getIndex() ?? sections.indexOf(item);
              return (
                <ScaleDecorator>
                  <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                      styles.sectionItem,
                      { opacity: isActive ? 0.9 : 1 },
                      isActive && styles.sectionItemDragging
                    ]}
                  >
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionNumber}>Section {index + 1}</Text>
                      <TouchableOpacity onPress={() => index !== undefined ? removeSection(index) : null} style={styles.removeSectionButton}>
                        <Text style={styles.removeSectionButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                      style={styles.input}
                      value={item.title}
                      onChangeText={(text) => index !== undefined ? handleSectionChange(index, 'title', text) : null}
                      placeholder="e.g., Our Story, Schedule, Gallery"
                      placeholderTextColor={Colors.light.textSecondary}
                    />
                    
                    <Text style={[styles.label, {marginTop: 10}]}>Content</Text>
                    <View style={styles.richEditorContainer}>
                      <RichTextEditor
                        initialContent={item.content}
                        onChangeContent={(text) => index !== undefined ? handleSectionChange(index, 'content', text) : null}
                        placeholder="Enter content for this section..."
                        minHeight={200}
                      />
                    </View>
                    
                    <View style={styles.dragHandle}>
                      <Ionicons name="menu" size={24} color={Colors.light.textSecondary} />
                    </View>
                  </TouchableOpacity>
                </ScaleDecorator>
              );
            }}
          />
          <TouchableOpacity onPress={addSection} style={styles.addSectionButton}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.light.primary} style={{marginRight: 5}}/>
            <Text style={styles.addSectionButtonText}>Add Section</Text>
          </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    backgroundColor: Colors.light.backgroundPrimary,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  headerPreviewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: Colors.light.border, 
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  uploadButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: 16,
    fontWeight: '600',
  },
  removeImageButton: {
    backgroundColor: Colors.light.error + '30',
    marginTop: 8,
  },
  removeImageButtonText: {
    color: Colors.light.error,
  },
  sectionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 10,
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    paddingTop: 15,
  },
  sectionItem: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
  },
  addSectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint + '30', 
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addSectionButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  removeSectionButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  removeSectionButtonText: {
    color: Colors.light.error,
    fontSize: 14,
  },
  themeSelectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12, 
    minHeight: 48, 
  },
  themeSelectorButtonText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundPaper,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  toggleButtonText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.light.background, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, 
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerInModal: {
    width: '100%',
 
    color: Colors.light.text,
    backgroundColor: Colors.light.backgroundPaper, 
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: Colors.light.primaryContrastText,
    fontSize: 16,
    fontWeight: '600',
  },
  dragHint: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    fontSize: 14,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  sectionItemDragging: {
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  dragHandle: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themePreviewContainer: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  themePreviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  themePreviewText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  themePreviewButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  themePreviewButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  richEditorContainer: {
    minHeight: 200,
    marginBottom: 10,
  },
  suggestButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  suggestButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EventWebsiteForm;
