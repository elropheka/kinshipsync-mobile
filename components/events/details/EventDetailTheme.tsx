import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../../types/eventTypes';
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed
import { Colors } from '../../../constants/Colors';

interface EventDetailThemeProps {
  currentTheme: Theme | null | undefined;
  availableThemes: Theme[];
  onSetEventTheme: (themeId: string) => Promise<void>;
}

const EventDetailTheme: React.FC<EventDetailThemeProps> = ({
  currentTheme,
  availableThemes,
  onSetEventTheme,
}) => {
  const [isThemePickerVisible, setIsThemePickerVisible] = useState(false);

  const handleThemeSelection = async (themeId: string) => {
    try {
      await onSetEventTheme(themeId);
      setIsThemePickerVisible(false);
      const selectedTheme = availableThemes.find(t => t.id === themeId);
      Alert.alert("Success", `Theme "${selectedTheme?.name || ''}" applied.`);
    } catch (error) {
      Alert.alert("Error", "Failed to apply theme.");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Event Theme</Text>
        <TouchableOpacity onPress={() => setIsThemePickerVisible(true)}>
          <Ionicons name="color-palette-outline" size={28} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.detailText}>
        Current Theme: {currentTheme ? currentTheme.name : 'None Selected'}
      </Text>
      {/* Consider adding a small preview of the theme if applicable, e.g., primary color swatch */}

      <Modal
        visible={isThemePickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsThemePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Theme</Text>
            <FlatList
              data={availableThemes}
              keyExtractor={(item) => item.id}
              renderItem={({ item: theme }) => (
                <TouchableOpacity 
                  style={[
                    styles.themeItem, 
                    currentTheme?.id === theme.id && styles.themeItemSelected
                  ]} 
                  onPress={() => handleThemeSelection(theme.id)}
                >
                  <Text style={styles.themeName}>{theme.name}</Text>
                  {/* Optionally display theme colors here */}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.taskSeparator} />}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsThemePickerVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventDetailTheme;
