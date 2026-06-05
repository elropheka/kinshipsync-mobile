import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Switch, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { BudgetItem, CreateBudgetItemPayload, UpdateBudgetItemPayload } from '../../types/eventTypes';
import { Vendor } from '../../types/vendorTypes';
import { VendorItem } from '../../types/vendorItemTypes';
import { useVendorSearch, useVendorItemsSearch } from '../../hooks/useVendors';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAlert } from '@/context/AlertContext';

interface BudgetFormProps {
  initialBudgetItem?: Partial<BudgetItem> & { id?: string };
  onSubmit: (
    itemData: CreateBudgetItemPayload | UpdateBudgetItemPayload,
    itemId?: string,
    originalLinkedVendorId?: string 
  ) => void;
  onCancel: () => void;
  formTitle?: string;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  initialBudgetItem,
  onSubmit,
  onCancel,
  formTitle: _formTitle = 'Budget Item',
}) => {
  const [itemName, setItemName] = useState(initialBudgetItem?.itemName || '');
  const [category, setCategory] = useState(initialBudgetItem?.category || '');
  const [estimatedCost, setEstimatedCost] = useState<string>(
    initialBudgetItem?.estimatedCost?.toString() || ''
  );
  const [actualCost, setActualCost] = useState<string>(
    initialBudgetItem?.actualCost?.toString() || ''
  );
  const [paid, setPaid] = useState(initialBudgetItem?.paid || false);
  const [notes, setNotes] = useState(initialBudgetItem?.notes || '');

  const [vendorEntryMode, setVendorEntryMode] = useState<'manual' | 'select'>(
    initialBudgetItem?.linkedVendorId ? 'select' : 'manual'
  );
  const [manualVendorNameInput, setManualVendorNameInput] = useState(initialBudgetItem?.manualVendorName || '');
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(initialBudgetItem?.linkedVendorId);

  const [itemEntryMode, setItemEntryMode] = useState<'manual' | 'select'>(
    initialBudgetItem?.linkedVendorId && initialBudgetItem?.linkedVendorItemId ? 'select' : 'manual'
  );
  const [selectedVendorItemId, setSelectedVendorItemId] = useState<string | undefined>(initialBudgetItem?.linkedVendorItemId);

  const { vendors, isLoading: loadingVendors, error: vendorsError } = useVendorSearch({});
  const { 
    displayItems: vendorItems,
    isLoading: loadingVendorItems, 
    error: vendorItemsError,
    performItemSearch,
  } = useVendorItemsSearch({ vendorId: selectedVendorId });
  const { currentColors } = useAppTheme();
  const { showError } = useAlert();


  useEffect(() => {
    if (initialBudgetItem) {
      setItemName(initialBudgetItem.itemName || '');
      setCategory(initialBudgetItem.category || '');
      setEstimatedCost(initialBudgetItem.estimatedCost?.toString() || '');
      setActualCost(initialBudgetItem.actualCost?.toString() || '');
      setPaid(initialBudgetItem.paid || false);
      setNotes(initialBudgetItem.notes || '');

      if (initialBudgetItem.linkedVendorId) {
        setVendorEntryMode('select');
        setSelectedVendorId(initialBudgetItem.linkedVendorId);
        setManualVendorNameInput('');
        if (initialBudgetItem.linkedVendorItemId) {
          setItemEntryMode('select');
          setSelectedVendorItemId(initialBudgetItem.linkedVendorItemId);
        } else {
          setItemEntryMode('manual');
          setSelectedVendorItemId(undefined);
        }
      } else {
        setVendorEntryMode('manual');
        setSelectedVendorId(undefined);
        setManualVendorNameInput(initialBudgetItem.manualVendorName || '');
        setItemEntryMode('manual');
        setSelectedVendorItemId(undefined);
      }
    }
  }, [initialBudgetItem]);

  useEffect(() => {
    if (vendorEntryMode === 'select' && selectedVendorId) {
      performItemSearch({ vendorId: selectedVendorId });
      setSelectedVendorItemId(undefined); 
    } else {
      performItemSearch({ vendorId: undefined }); 
      setItemEntryMode('manual');
      setSelectedVendorItemId(undefined);
    }
  }, [selectedVendorId, vendorEntryMode, performItemSearch]);


  const handleSubmit = () => {
    if (!itemName.trim()) {
      showError('Validation Error', 'Item Name cannot be empty.');
      return;
    }
    if (vendorEntryMode === 'manual' && !manualVendorNameInput.trim()) {
      showError('Validation Error', 'Manual Vendor Name cannot be empty if "Enter Vendor Manually" is selected.');
      return;
    }
    if (vendorEntryMode === 'select' && !selectedVendorId) {
      showError('Validation Error', 'Please select a vendor or switch to manual vendor entry.');
      return;
    }
    if (vendorEntryMode === 'select' && itemEntryMode === 'select' && !selectedVendorItemId) {
      showError('Validation Error', 'Please select a vendor item or switch to manual item entry.');
      return;
    }

    const estimatedCostNum = parseFloat(estimatedCost);
    if (isNaN(estimatedCostNum) || estimatedCostNum < 0) {
      showError('Validation Error', 'Please enter a valid estimated cost.');
      return;
    }
    const actualCostNum = actualCost ? parseFloat(actualCost) : undefined;
    if (actualCost && (isNaN(actualCostNum!) || actualCostNum! < 0)) {
      showError('Validation Error', 'Please enter a valid actual cost or leave it empty.');
      return;
    }

    const budgetItemData: CreateBudgetItemPayload | UpdateBudgetItemPayload = {
      itemName: itemName.trim(),
      category: category.trim() || undefined,
      estimatedCost: estimatedCostNum,
      actualCost: actualCostNum,
      paid,
      notes: notes.trim() || undefined,
      linkedVendorId: vendorEntryMode === 'select' ? selectedVendorId : undefined,
      manualVendorName: vendorEntryMode === 'manual' ? (manualVendorNameInput.trim() || undefined) : undefined,
      linkedVendorItemId: vendorEntryMode === 'select' && itemEntryMode === 'select' ? selectedVendorItemId : undefined,
    };

    if (initialBudgetItem?.id) {
      onSubmit(budgetItemData as UpdateBudgetItemPayload, initialBudgetItem.id, initialBudgetItem.linkedVendorId);
    } else {
      onSubmit(budgetItemData as CreateBudgetItemPayload);
    }
  };

  const handleSelectVendorItem = (itemId?: string) => {
    setSelectedVendorItemId(itemId);
    if (itemId) {
      const item = vendorItems.find((i: VendorItem) => i.id === itemId);
      if (item) {
        setItemName(item.name);
        if (typeof item.price === 'number') {
          setEstimatedCost(item.price.toString());
        }
      }
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: currentColors.backgroundPaper,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentColors.text,
      marginBottom: 15,
      marginTop: 10,
    },
    disabledText: {
      color: currentColors.grey, 
    },
    readOnlyInput: {
      backgroundColor: currentColors.divider, 
      color: currentColors.textSecondary,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    entryModeContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: 8,
      overflow: 'hidden',
    },
    entryModeButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentColors.backgroundPaper,
    },
    entryModeButtonActive: {
      backgroundColor: currentColors.primary,
    },
    entryModeText: {
      fontSize: 14,
      fontWeight: '600',
      color: currentColors.primary,
    },
    entryModeTextActive: {
      color: currentColors.backgroundPaper,
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: 8,
      backgroundColor: currentColors.backgroundPaper,
      justifyContent: 'center',
    },
    picker: {
      color: currentColors.text,
    },
    pickerItem: {
      color: currentColors.text,
    },
    pickerItemPlaceholder: {
      color: currentColors.textSecondary,
    },
    errorText: {
      color: currentColors.error,
      fontSize: 14,
      marginTop: 5,
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
      height: 80,
      textAlignVertical: 'top',
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }), [currentColors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={currentColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{initialBudgetItem?.id ? 'Edit Budget Item' : 'Add Budget Item'}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Vendor Details</Text>
        <View style={styles.entryModeContainer}>
          <TouchableOpacity
            style={[styles.entryModeButton, vendorEntryMode === 'manual' && styles.entryModeButtonActive]}
            onPress={() => { 
              setVendorEntryMode('manual'); 
              setSelectedVendorId(undefined);
              setItemEntryMode('manual');
              setSelectedVendorItemId(undefined);
            }}
          >
            <Text style={[styles.entryModeText, vendorEntryMode === 'manual' && styles.entryModeTextActive]}>Enter Vendor Manually</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.entryModeButton, vendorEntryMode === 'select' && styles.entryModeButtonActive]}
            onPress={() => {
              setVendorEntryMode('select');
              setManualVendorNameInput('');
            }}
          >
            <Text style={[styles.entryModeText, vendorEntryMode === 'select' && styles.entryModeTextActive]}>Select Existing Vendor</Text>
          </TouchableOpacity>
        </View>

        {vendorEntryMode === 'manual' ? (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Vendor Name <Text style={styles.requiredStar}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={manualVendorNameInput}
              onChangeText={setManualVendorNameInput}
              placeholder="e.g., John Doe Photography"
              placeholderTextColor={currentColors.textSecondary}
            />
          </View>
        ) : (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Select Vendor <Text style={styles.requiredStar}>*</Text></Text>
            {loadingVendors && <ActivityIndicator size="small" color={currentColors.primary} />}
            {vendorsError && <Text style={styles.errorText}>Error loading vendors.</Text>}
            {!loadingVendors && !vendorsError && (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedVendorId}
                  onValueChange={(itemValue) => {
                    setSelectedVendorId(itemValue as string | undefined);
                  }}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="-- Select a Vendor --" value={undefined} style={styles.pickerItemPlaceholder} />
                  {vendors.map((vendor: Vendor) => (
                    <Picker.Item key={vendor.id} label={vendor.name} value={vendor.id} />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Item/Service Details</Text>
        {vendorEntryMode === 'select' && selectedVendorId && (
          <View style={styles.entryModeContainer}>
            <TouchableOpacity
              style={[styles.entryModeButton, itemEntryMode === 'manual' && styles.entryModeButtonActive]}
              onPress={() => {
                setItemEntryMode('manual');
                setSelectedVendorItemId(undefined);
              }}
            >
              <Text style={[styles.entryModeText, itemEntryMode === 'manual' && styles.entryModeTextActive]}>Enter Item Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.entryModeButton, itemEntryMode === 'select' && styles.entryModeButtonActive]}
              onPress={() => setItemEntryMode('select')}
              disabled={!selectedVendorId}
            >
              <Text style={[styles.entryModeText, itemEntryMode === 'select' && styles.entryModeTextActive, !selectedVendorId && styles.disabledText]}>Select Vendor&apos;s Item</Text>
            </TouchableOpacity>
          </View>
        )}

        { (vendorEntryMode === 'manual' || (vendorEntryMode === 'select' && itemEntryMode === 'manual')) && (
            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Item/Service Name <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="e.g., Wedding Package, DJ Services"
                placeholderTextColor={currentColors.textSecondary}
                />
            </View>
        )}

        {vendorEntryMode === 'select' && selectedVendorId && itemEntryMode === 'select' && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Select Vendor Item <Text style={styles.requiredStar}>*</Text></Text>
            {loadingVendorItems && <ActivityIndicator size="small" color={currentColors.primary} />}
            {vendorItemsError && <Text style={styles.errorText}>Error loading vendor items.</Text>}
            {!loadingVendorItems && !vendorItemsError && (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedVendorItemId}
                  onValueChange={(itemValue) => handleSelectVendorItem(itemValue as string | undefined)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  enabled={!!selectedVendorId}
                >
                  <Picker.Item label="-- Select an Item --" value={undefined} style={styles.pickerItemPlaceholder} />
                  {vendorItems.map((item: VendorItem) => (
                    <Picker.Item key={item.id} label={`${item.name} (${typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price})`} value={item.id} />
                  ))}
                </Picker>
              </View>
            )}
             <Text style={styles.label}>Item Name (from selected item) <Text style={styles.requiredStar}>*</Text></Text>
             <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={itemName}
                editable={false}
              />
          </View>
        )}
        
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Food, Decorations"
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Estimated Cost <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={estimatedCost}
            onChangeText={setEstimatedCost}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Actual Cost</Text>
          <TextInput
            style={styles.input}
            value={actualCost}
            onChangeText={setActualCost}
            placeholder="0.00 (optional)"
            keyboardType="numeric"
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>
        
        <View style={[styles.fieldContainer, styles.switchContainer]}>
          <Text style={styles.label}>Paid</Text>
          <Switch
            trackColor={{ false: "#767577", true: currentColors.tint }}
            thumbColor={paid ? currentColors.primary : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setPaid}
            value={paid}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional details..."
            multiline
            numberOfLines={3}
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>

              </ScrollView>
      </SafeAreaView>
  );
};

export default BudgetForm;
