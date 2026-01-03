import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SeatingTable } from '../../types/eventTypes'; // Assuming SeatingTable is in eventTypes
import { useAppTheme } from '@/context/AppThemeContext';
import { useAlert } from '@/context/AlertContext';

interface TableFormProps {
  initialTable?: Partial<SeatingTable>; // For editing
  onSubmit: (tableData: Omit<SeatingTable, 'id' | 'assignedGuestIds'>) => void;
  onCancel: () => void;
}

const TableForm: React.FC<TableFormProps> = ({
  initialTable,
  onSubmit,
  onCancel,
}) => {
  const { currentColors } = useAppTheme();
  const { showError } = useAlert();
  const [name, setName] = useState(initialTable?.name || '');
  const [capacity, setCapacity] = useState<string>(initialTable?.capacity?.toString() || '8'); // Default capacity

  const handleSubmit = () => {
    if (!name.trim()) {
      showError('Validation Error', 'Table name or number cannot be empty.');
      return;
    }
    const capacityNum = parseInt(capacity, 10);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      showError('Validation Error', 'Capacity must be a positive number.');
      return;
    }

    onSubmit({
      name: name.trim(),
      capacity: capacityNum,
      assignedGuests: [],
      position: { x: 0, y: 0 },
    });
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
  }), [currentColors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={currentColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{initialTable?.id ? 'Edit Table' : 'Add New Table'}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Table Name/Number <Text style={styles.requiredStar}>*</Text></Text>
                      <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Table 1, Main Table"
              placeholderTextColor={currentColors.textSecondary}
            />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Capacity <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={capacity}
            onChangeText={setCapacity}
            placeholder="e.g., 8"
            keyboardType="number-pad"
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TableForm;
