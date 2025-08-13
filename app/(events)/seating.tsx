import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, Modal, FlatList, StatusBar } from 'react-native'; // Added FlatList
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(events)/seating.styles'; // Styles will need to be adapted
import { useEventDetail } from '../../hooks/useEvents';
import { SeatingTable, Guest, Event } from '../../types/eventTypes'; // Omit<SeatingTable, 'id' | 'assignedGuestIds'> for payload
import { Colors } from '../../constants/Colors';
import TableForm from '../../components/events/TableForm'; 

const SeatingChartScreen = () => {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  
  const { 
    event, 
    seatingChart, 
    guests, 
    updateSeatingChart, 
    isLoading: isLoadingEventData, 
    error: eventError 
  } = useEventDetail(eventId);

  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isTableFormVisible, setIsTableFormVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<Partial<SeatingTable> & { id?: string } | undefined>(undefined);

  const [isGuestPickerVisible, setIsGuestPickerVisible] = useState(false);
  const [assigningToTableId, setAssigningToTableId] = useState<string | null>(null);
  const [assigningToChairIndex, setAssigningToChairIndex] = useState<number | null>(null);


  useEffect(() => {
    if (seatingChart?.tables) {
      setTables(JSON.parse(JSON.stringify(seatingChart.tables))); // Deep copy for local editing
    } else {
      setTables([]);
    }
  }, [seatingChart]);

  const handleSaveChart = async () => {
    if (!eventId) return;
    setIsLoading(true);
    try {
      await updateSeatingChart({ tables });
      Alert.alert("Success", "Seating chart saved!");
    } catch (error) {
      console.error("Failed to save seating chart:", error);
      Alert.alert("Error", "Could not save seating chart.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Table Form Handlers
  const handleOpenTableForm = (table?: Partial<SeatingTable> & { id?: string }) => {
    setEditingTable(table);
    setIsTableFormVisible(true);
  };

  const handleCloseTableForm = () => {
    setEditingTable(undefined);
    setIsTableFormVisible(false);
  };

  const handleTableFormSubmit = (tableData: Omit<SeatingTable, 'id' | 'assignedGuestIds'>) => {
    if (editingTable?.id) { // Editing existing table
      setTables(prevTables => prevTables.map(t => 
        t.id === editingTable.id ? { ...t, ...tableData } : t
      ));
    } else { // Adding new table
      const newTable: SeatingTable = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, // Temporary local ID
        ...tableData,
        assignedGuests: Array(tableData.capacity).fill(null), // Initialize with empty seats
      };
      setTables(prevTables => [...prevTables, newTable]);
    }
    handleCloseTableForm();
  };
  
  const handleAddTable = () => { // This now just opens the form
    handleOpenTableForm(); 
  };

  const handleEditTable = (table: SeatingTable) => { // This now opens the form with initial data
    handleOpenTableForm(table);
  };

  // Deleting a table
  const handleDeleteTable = (tableId: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this table and unassign its guests?", [
        {text: "Cancel", style: "cancel"},
        {text: "Delete", style: "destructive", onPress: () => {
            setTables(prev => prev.filter(t => t.id !== tableId));
        }}
    ]);
  };

  // Guest Assignment Handlers
  const handleAssignGuest = (tableId: string, chairIndex: number) => {
    setAssigningToTableId(tableId);
    setAssigningToChairIndex(chairIndex);
    setIsGuestPickerVisible(true);
  };
  
  const handleSelectGuestForChair = (guestId: string) => {
    if (assigningToTableId === null || assigningToChairIndex === null) return;

    setTables(prevTables => prevTables.map(table => {
      if (table.id === assigningToTableId) {
        const newAssignedGuests = [...table.assignedGuests];
        // Ensure no duplicate assignment across all tables for this guest
        const isGuestAlreadySeated = prevTables.some(t => t.assignedGuests.includes(guestId));
        if (isGuestAlreadySeated) {
            Alert.alert("Already Seated", "This guest is already assigned to another seat.");
            return table; // Return original table if guest is already seated
        }
        newAssignedGuests[assigningToChairIndex] = guestId;
        return { ...table, assignedGuests: newAssignedGuests };
      }
      return table;
    }));
    setIsGuestPickerVisible(false);
    setAssigningToTableId(null);
    setAssigningToChairIndex(null);
  };
  
  // Unassigning a guest
  const handleUnassignGuest = (tableId: string, chairIndex: number) => {
     setTables(prevTables => prevTables.map(table => {
        if (table.id === tableId) {
            const newAssignedGuests = [...table.assignedGuests];
            newAssignedGuests[chairIndex] = ''; // or null, depending on how you mark empty
            return {...table, assignedGuests: newAssignedGuests};
        }
        return table;
     }));
  };


  if (isLoadingEventData) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.light.primary} /><Text>Loading event data...</Text></View>;
  }

  if (eventError) {
    return <View style={styles.centered}><Text style={styles.errorText}>Error loading event data: {eventError.message}</Text></View>;
  }
  
  if (!event) {
    return <View style={styles.centered}><Text>Event not found.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
      {/* Header */}
      <Stack.Screen options={{ title: `Seating - ${event.name}` }} />
      <View style={styles.headerControls}>
        <TouchableOpacity style={styles.controlButton} onPress={handleAddTable}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.light.primary} />
            <Text style={styles.controlButtonText}>Add Table</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.saveButton]} onPress={handleSaveChart} disabled={isLoading}>
            <Ionicons name="save-outline" size={24} color={Colors.light.primaryContrastText} />
            <Text style={[styles.controlButtonText, {color: Colors.light.primaryContrastText}]}>
                {isLoading ? "Saving..." : "Save Chart"}
            </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tables.map((table) => (
          <View key={table.id} style={styles.tableContainer}>
            <View style={styles.tableHeader}>
                <Text style={styles.tableName}>{table.name} (Capacity: {table.capacity})</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => handleEditTable(table)} style={{marginRight: 10}}>
                        <Ionicons name="pencil-outline" size={20} color={Colors.light.tint} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteTable(table.id)}>
                        <Ionicons name="trash-outline" size={20} color={Colors.light.error} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.chairsContainer}>
              {[...Array(table.capacity)].map((_, chairIndex) => {
                const guestId = table.assignedGuests[chairIndex];
                // Ensure guests array is available and not undefined before calling find
                const guest = guestId && guests ? guests.find(g => g.id === guestId) : null;
                return (
                  <TouchableOpacity 
                    key={chairIndex} 
                    style={[styles.chair, guest ? styles.chairOccupied : styles.chairAvailable]}
                    onPress={() => guest ? handleUnassignGuest(table.id, chairIndex) : handleAssignGuest(table.id, chairIndex)}
                  >
                    <Text style={styles.chairText}>{guest ? guest.name.substring(0,3)+"." : chairIndex + 1}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        {tables.length === 0 && <Text style={styles.emptyText}>No tables added yet. Click "Add Table" to start.</Text>}
      </ScrollView>
      
      <Modal
        visible={isTableFormVisible}
        animationType="slide"
        onRequestClose={handleCloseTableForm}
      >
        <TableForm
          initialTable={editingTable}
          onSubmit={handleTableFormSubmit}
          onCancel={handleCloseTableForm}
        />
      </Modal>
      
      {/* Guest Picker Modal */}
      <Modal
        visible={isGuestPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsGuestPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Guest to Chair</Text>
            <FlatList
              data={guests.filter(g => !tables.some(t => t.assignedGuests.includes(g.id)))} // Only show unassigned guests
              keyExtractor={(item) => item.id}
              renderItem={({ item: guest }) => (
                <TouchableOpacity 
                  style={styles.guestPickerItem} 
                  onPress={() => handleSelectGuestForChair(guest.id)}
                >
                  <Text style={styles.guestPickerItemText}>{guest.name}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.guestPickerSeparator} />}
              ListEmptyComponent={<Text style={styles.emptyText}>All guests are seated or no guests available.</Text>}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsGuestPickerVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default SeatingChartScreen;
