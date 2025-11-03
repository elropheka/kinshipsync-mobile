import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SeatingTable } from '../../types/eventTypes'; // Assuming SeatingTable is in eventTypes
import { Colors } from '../../constants/Colors';

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
  const [name, setName] = useState(initialTable?.name || '');
  const [capacity, setCapacity] = useState<string>(initialTable?.capacity?.toString() || '8'); // Default capacity

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Table name or number cannot be empty.');
      return;
    }
    const capacityNum = parseInt(capacity, 10);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      Alert.alert('Validation Error', 'Capacity must be a positive number.');
      return;
    }

    onSubmit({
      name: name.trim(),
      capacity: capacityNum,
      assignedGuests: [],
      position: { x: 0, y: 0 },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.accent} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={Colors.light.text} />
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
              placeholderTextColor={Colors.light.textSecondary}
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
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusing similar styles from other forms
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
});

export default TableForm;
