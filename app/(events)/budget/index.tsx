import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Modal } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createIndexStyles } from '../../../styles/app/(events)/budget/index.styles';
import { useAppTheme } from '@/context/AppThemeContext'; // Will need new styles
import { useAppAuth } from '../../../hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import { useAllEvents, useEventDetail } from '../../../hooks/useEvents';
import { Event as EventType, BudgetItem as BudgetItemType, CreateBudgetItemPayload, UpdateBudgetItemPayload } from '../../../types/eventTypes';
import BudgetForm from '../../../components/budget/BudgetForm'; // Re-use BudgetForm
import { Spacing } from 'constants/dimensions'; // Import Spacing
import { LoadingScreen } from '@/components/common/LoadingScreen';

const EventBudgetScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createIndexStyles(currentColors);


  const params = useLocalSearchParams<{ eventId?: string }>();
  const { user: currentUser } = useAppAuth();
  const { showError, showSuccess, showConfirm } = useAlert();
  
  const { events: allEvents, isLoading: isLoadingAllEvents } = useAllEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(params.eventId || null);

  const {
    event: selectedEvent,
    budgetItems,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    updateEventOverallBudgetHook, // New hook function
    isLoading: isLoadingEventDetail,
  } = useEventDetail(selectedEventId || undefined); // Ensure undefined if null

  const [eventsOrganizedByUser, setEventsOrganizedByUser] = useState<EventType[]>([]);
  const [currentOverallBudgetInput, setCurrentOverallBudgetInput] = useState<string>('');
  const [isBudgetFormVisible, setIsBudgetFormVisible] = useState(false);
  const [editingBudgetItem, setEditingBudgetItem] = useState<Partial<BudgetItemType> & { id?: string } | undefined>(undefined);
  const [isSavingOverallBudget, setIsSavingOverallBudget] = useState(false);

  useEffect(() => {
    if (currentUser?.uid && allEvents.length > 0) {
      setEventsOrganizedByUser(allEvents.filter(event => event.organizerId === currentUser.uid));
    }
  }, [allEvents, currentUser?.uid]);

  useEffect(() => {
    if (selectedEvent?.overallBudget !== undefined) {
      setCurrentOverallBudgetInput(selectedEvent.overallBudget.toString());
    } else {
      setCurrentOverallBudgetInput('');
    }
  }, [selectedEvent]);

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleSaveOverallBudget = async () => {
    if (!selectedEventId || currentOverallBudgetInput.trim() === '') {
      showError("Invalid Input", "Please enter a valid budget amount.");
      return;
    }
    const budgetAmount = parseFloat(currentOverallBudgetInput);
    if (isNaN(budgetAmount) || budgetAmount < 0) {
      showError("Invalid Input", "Budget amount must be a non-negative number.");
      return;
    }
    setIsSavingOverallBudget(true);
    try {
      await updateEventOverallBudgetHook(budgetAmount);
      showSuccess("Success", "Overall budget updated.");
    } catch (error) {
      showError("Error", "Failed to update overall budget.");
      console.error("Error saving overall budget:", error);
    } finally {
      setIsSavingOverallBudget(false);
    }
  };

  const handleOpenBudgetForm = (item?: BudgetItemType) => {
    setEditingBudgetItem(item);
    setIsBudgetFormVisible(true);
  };

  const handleCloseBudgetForm = () => {
    setEditingBudgetItem(undefined);
    setIsBudgetFormVisible(false);
  };

  const handleBudgetFormSubmit = async (itemData: CreateBudgetItemPayload | UpdateBudgetItemPayload, itemId?: string) => {
    if (!selectedEventId) return;
    try {
      if (itemId) {
        await updateBudgetItem(itemId, itemData as UpdateBudgetItemPayload);
        showSuccess('Success', 'Expense item updated.');
      } else {
        await addBudgetItem(itemData as CreateBudgetItemPayload);
        showSuccess('Success', 'Expense item added.');
      }
      handleCloseBudgetForm();
    } catch {
      showError('Error', 'Failed to save expense item.');
    }
  };

  const handleDeleteBudgetItem = (itemId: string) => {
    if (!selectedEventId) return;
    showConfirm(
      'warning',
      "Confirm Delete",
      "Are you sure you want to delete this expense item?",
      async () => {
        try { 
          await deleteBudgetItem(itemId);
        } catch { 
          showError("Error", "Failed to delete expense item.");
        }
      },
      {
        confirmText: "Delete",
        cancelText: "Cancel",
      }
    );
  };

  const totalSpent = useMemo(() => {
    return budgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0);
  }, [budgetItems]);

  const remainingBudget = useMemo(() => {
    const overall = selectedEvent?.overallBudget || 0;
    return overall - totalSpent;
  }, [selectedEvent?.overallBudget, totalSpent]);


  if (isLoadingAllEvents && eventsOrganizedByUser.length === 0 && !selectedEventId) {
    return <LoadingScreen />;
  }

  if (!selectedEventId) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: "Select Event for Budget" }} />
        {eventsOrganizedByUser.length === 0 && !isLoadingAllEvents && (
            <View style={styles.centered}><Text style={styles.emptyText}>You haven&apos;t organized any events yet.</Text></View>
        )}
        <FlatList
          data={eventsOrganizedByUser}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.eventItemSelect} onPress={() => handleSelectEvent(item.id)}>
              <Text style={styles.eventItemSelectText}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: Spacing.m }}
        />
      </SafeAreaView>
    );
  }

  if (isLoadingEventDetail && !selectedEvent) {
     return <LoadingScreen />;
  }
  if (!selectedEvent) {
    return <SafeAreaView style={styles.centered} edges={['left', 'right', 'bottom']}><Text style={styles.errorText}>Event details not found.</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: `${selectedEvent.name} - Budget` }} />

      {/* ScrollView removed, FlatList will handle scrolling */}
      <FlatList
        data={budgetItems}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Budget</Text>
              <View style={styles.overallBudgetInputContainer}>
            <TextInput
              style={styles.overallBudgetInput}
              value={currentOverallBudgetInput}
              onChangeText={setCurrentOverallBudgetInput}
              placeholder="Enter total budget"
              keyboardType="numeric"
              placeholderTextColor={currentColors.textSecondary}
            />
                <TouchableOpacity
                    style={[styles.saveOverallBudgetButton, isSavingOverallBudget && styles.disabledButton]}
                    onPress={handleSaveOverallBudget}
                    disabled={isSavingOverallBudget}
                >
                  {isSavingOverallBudget ? <ActivityIndicator color="#fff" size="small"/> : <Text style={styles.saveOverallBudgetButtonText}>Save</Text>}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Allotted:</Text>
                <Text style={styles.summaryValue}>${(selectedEvent.overallBudget || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Spent:</Text>
                <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.summaryRemainingLabel]}>Remaining:</Text>
                <Text style={[styles.summaryValue, remainingBudget < 0 && styles.summaryValueNegative]}>
                  ${remainingBudget.toFixed(2)}
                </Text>
              </View>
              {/* Optional: Progress Bar */}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderAction}>
                <Text style={styles.sectionTitle}>Expenses</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleOpenBudgetForm()}>
                  <Ionicons name="add-circle-outline" size={26} color={currentColors.primary} />
                  <Text style={styles.addButtonText}>Add Expense</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.budgetItem}>
            <View style={styles.budgetItemInfo}>
              <Text style={styles.budgetItemName}>{item.itemName}</Text>
              {item.category && <Text style={styles.budgetItemCategory}>Category: {item.category}</Text>}
              <Text style={styles.budgetItemCosts}>
                Est: ${item.estimatedCost.toFixed(2)} / Actual: ${ (item.actualCost || 0).toFixed(2)}
                {item.paid ? ' (Paid)' : ''}
              </Text>
            </View>
            <View style={styles.budgetItemActions}>
              <TouchableOpacity onPress={() => handleOpenBudgetForm(item)} style={{marginRight: Spacing.m}}>
                <Ionicons name="pencil-outline" size={22} color={currentColors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteBudgetItem(item.id)}>
                <Ionicons name="trash-outline" size={22} color={currentColors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListEmptyComponent={() => (
          <View style={styles.section}> {/* Ensure consistent styling for empty text if needed */}
            <Text style={styles.emptyText}>No expenses added yet.</Text>
          </View>
        )}
        contentContainerStyle={styles.scrollContainer} // Apply scrollContainer styles here if needed for padding etc.
      />

      <Modal
        visible={isBudgetFormVisible}
        animationType="slide"
        onRequestClose={handleCloseBudgetForm}
      >
        <BudgetForm
          initialBudgetItem={editingBudgetItem}
          onSubmit={handleBudgetFormSubmit}
          onCancel={handleCloseBudgetForm}
          formTitle={editingBudgetItem ? 'Edit Expense' : 'Add New Expense'}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default EventBudgetScreen;
