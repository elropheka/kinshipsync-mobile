import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BudgetItem, CreateBudgetItemPayload, UpdateBudgetItemPayload } from '../../../types/eventTypes';
import BudgetForm from '../../budget/BudgetForm'; // Path to existing BudgetForm
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed
import { Colors } from '../../../constants/Colors';

interface EventDetailBudgetProps {
  budgetItems: BudgetItem[];
  onAddBudgetItem: (itemData: CreateBudgetItemPayload) => Promise<void>;
  onUpdateBudgetItem: (itemId: string, itemData: UpdateBudgetItemPayload) => Promise<void>;
  onDeleteBudgetItem: (itemId: string) => Promise<void>;
  isOrganizer?: boolean;
}

const EventDetailBudget: React.FC<EventDetailBudgetProps> = ({
  budgetItems,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
  isOrganizer = true
}) => {
  const [isBudgetFormVisible, setIsBudgetFormVisible] = useState(false);
  const [editingBudgetItem, setEditingBudgetItem] = useState<Partial<BudgetItem> & { id?: string } | undefined>(undefined);

  const handleOpenBudgetForm = (item?: Partial<BudgetItem> & { id?: string }) => {
    setEditingBudgetItem(item);
    setIsBudgetFormVisible(true);
  };

  const handleCloseBudgetForm = () => {
    setEditingBudgetItem(undefined);
    setIsBudgetFormVisible(false);
  };

  const handleBudgetFormSubmit = async (itemData: CreateBudgetItemPayload | UpdateBudgetItemPayload, itemId?: string) => {
    try {
      if (itemId) {
        await onUpdateBudgetItem(itemId, itemData as UpdateBudgetItemPayload);
        Alert.alert('Success', 'Budget item updated.');
      } else {
        await onAddBudgetItem(itemData as CreateBudgetItemPayload);
        Alert.alert('Success', 'Budget item added.');
      }
      handleCloseBudgetForm();
    } catch (e) {
      console.error("Failed to submit budget item:", e);
      Alert.alert('Error', 'Failed to save budget item.');
    }
  };

  const handleDeletePress = (itemId: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this budget item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { 
          await onDeleteBudgetItem(itemId); 
          Alert.alert('Success', 'Budget item deleted.');
        } 
        catch (e) { Alert.alert("Error", "Failed to delete budget item."); }
      }}
    ]);
  };

  const renderBudgetItem = ({ item }: { item: BudgetItem }) => (
    <TouchableOpacity 
      style={styles.taskItem} 
      onPress={isOrganizer ? () => handleOpenBudgetForm(item) : undefined}
      disabled={!isOrganizer}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{item.itemName} {item.category ? `(${item.category})` : ''}</Text>
        <Text style={styles.taskDescription}>
          Est: ${item.estimatedCost.toFixed(2)}
          {item.actualCost !== undefined && item.actualCost !== null && ` / Actual: $${item.actualCost.toFixed(2)}`}
          {item.paid ? ' (Paid)' : ' (Unpaid)'}
        </Text>
        {item.notes && <Text style={styles.taskDueDate} numberOfLines={1}>Notes: {item.notes}</Text>}
      </View>
      {isOrganizer && (
        <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={{ marginLeft: 10 }}>
          <Ionicons name="trash-outline" size={24} color={Colors.light.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Budget</Text>
        {isOrganizer && (
          <TouchableOpacity onPress={() => handleOpenBudgetForm()}>
            <Ionicons name="add-circle-outline" size={28} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
      </View>
      {budgetItems.length > 0 ? (
        <FlatList 
          data={budgetItems} 
          renderItem={renderBudgetItem} 
          keyExtractor={item => item.id} 
          scrollEnabled={false} 
          ItemSeparatorComponent={() => <View style={styles.taskSeparator} />} 
        />
      ) : ( 
        <Text style={styles.emptyListText}>No budget items yet. Add one!</Text> 
      )}
      <Modal visible={isBudgetFormVisible} animationType="slide" onRequestClose={handleCloseBudgetForm}>
        <BudgetForm 
          initialBudgetItem={editingBudgetItem} 
          onSubmit={handleBudgetFormSubmit} 
          onCancel={handleCloseBudgetForm} 
          formTitle={editingBudgetItem ? 'Edit Budget Item' : 'Add Budget Item'} 
        />
      </Modal>
    </View>
  );
};

export default EventDetailBudget;
