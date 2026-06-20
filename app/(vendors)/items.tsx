import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useCurrentUser } from '@/hooks/useUser';
import { useAlert } from '@/context/AlertContext';
import VendorItemForm from '@/components/vendors/VendorItemForm';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';
import {
  getVendorByOwnerId,
  getVendorItemsByVendorId,
  createVendorItem,
  updateVendorItem,
  deleteVendorItem,
} from '@/services/vendorService';
import { Vendor } from '@/types/vendorTypes';
import {
  VendorItem,
  CreateVendorItemPayload,
  UpdateVendorItemPayload,
} from '@/types/vendorItemTypes';

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  itemCard: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemContent: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  itemCategory: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.accent,
    marginTop: 6,
  },
  itemDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
    marginTop: 40,
    fontSize: 14,
  },
  emptyIcon: {
    textAlign: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerTitleBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function VendorItemsScreen() {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createStyles(currentColors), [currentColors]);
  const { user: authUser } = useAppAuth();
  const { profile, isLoadingProfile } = useCurrentUser();
  const { showSuccess, showError, showConfirm, showWarning } = useAlert();
  const { openAdd } = useLocalSearchParams<{ openAdd?: string }>();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [items, setItems] = useState<VendorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasHandledOpenAddParam = useRef(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!authUser?.uid || isLoadingProfile) {
      return;
    }

    if (!profile?.isVendor) {
      setIsLoading(false);
      setRefreshing(false);
      return;
    }

    if (!isRefresh) {
      setIsLoading(true);
    }

    try {
      const vendorData = await getVendorByOwnerId(authUser.uid);
      const effectiveVendorId = vendorData?.id ?? authUser.uid;
      setVendor(vendorData ?? {
        id: authUser.uid,
        name: profile?.displayName ?? '',
        description: '',
        categories: [],
        ownerId: authUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const vendorItems = await getVendorItemsByVendorId(effectiveVendorId);
      setItems(vendorItems);

      if (!vendorData?.name && vendorItems.length === 0) {
        showWarning(
          'Offline Mode',
          'Could not reach Firestore. Some vendor details may be unavailable until you reconnect.'
        );
      }
    } catch (e) {
      console.error('Error loading vendor items:', e);
      showError('Load Failed', 'Could not load vendor items. Check your connection and try again.');
    }
    setIsLoading(false);
    setRefreshing(false);
  }, [authUser?.uid, profile?.isVendor, profile?.displayName, isLoadingProfile, showError, showWarning]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (openAdd !== '1') {
      hasHandledOpenAddParam.current = false;
      return;
    }
    if (!hasHandledOpenAddParam.current && !isLoading && profile?.isVendor) {
      hasHandledOpenAddParam.current = true;
      setEditingItem(null);
      setIsFormVisible(true);
    }
  }, [openAdd, isLoading, profile?.isVendor]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  const handleOpenAddForm = useCallback(() => {
    setEditingItem(null);
    setIsFormVisible(true);
  }, []);

  const handleOpenEditForm = useCallback((item: VendorItem) => {
    setEditingItem(item);
    setIsFormVisible(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    if (isSubmitting) {
      return;
    }
    setIsFormVisible(false);
    setEditingItem(null);
  }, [isSubmitting]);

  const handleFormSubmit = useCallback(
    async (data: CreateVendorItemPayload | UpdateVendorItemPayload, itemId?: string) => {
      if (!vendor?.id) {
        showError('Vendor Not Found', 'Set up your vendor profile before adding items.');
        return;
      }

      setIsSubmitting(true);
      try {
        if (itemId) {
          const updated = await updateVendorItem(itemId, data);
          setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
          showSuccess('Item Updated', 'Your item was updated successfully.');
        } else {
          const created = await createVendorItem(vendor.id, data as CreateVendorItemPayload);
          setItems((prev) => [created, ...prev]);
          showSuccess('Item Added', 'Your new item was added successfully.');
        }
        setIsFormVisible(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error saving vendor item:', error);
        showError('Save Failed', `Failed to ${itemId ? 'update' : 'add'} item. Please try again.`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [vendor?.id, showError, showSuccess]
  );

  const handleDeleteItem = useCallback(
    (item: VendorItem) => {
      showConfirm(
        'warning',
        'Delete Item',
        `Delete "${item.name}"? This action cannot be undone.`,
        async () => {
          try {
            await deleteVendorItem(item.id);
            setItems((prev) => prev.filter((existing) => existing.id !== item.id));
            showSuccess('Item Deleted', 'The item was removed from your catalog.');
          } catch (error) {
            console.error('Error deleting vendor item:', error);
            showError('Delete Failed', 'Could not delete this item. Please try again.');
          }
        }
      );
    },
    [showConfirm, showError, showSuccess]
  );

  const renderItem = useCallback(
    ({ item }: { item: VendorItem }) => (
      <TouchableOpacity
        style={styles.itemCard}
        activeOpacity={0.85}
        onPress={() => handleOpenEditForm(item)}
      >
        <View style={styles.itemHeaderRow}>
          <View style={styles.itemContent}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemPrice}>
              {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}
            </Text>
            {item.description ? (
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </View>
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleOpenEditForm(item)}
            >
              <Ionicons name="create-outline" size={20} color={currentColors.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteItem(item)}
            >
              <Ionicons name="trash-outline" size={20} color={currentColors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [styles, currentColors.accent, currentColors.error, handleDeleteItem, handleOpenEditForm]
  );

  const isPageLoading = isLoading || isLoadingProfile || !authUser?.uid;

  if (isPageLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Items' }} />
        <View style={styles.loadingContainer}>
          <BrandLoadingSpinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile?.isVendor) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Items' }} />
        <View style={styles.loadingContainer}>
          <Ionicons name="cube-outline" size={48} color={currentColors.textSecondary} />
          <Text style={styles.emptyText}>Vendor items are only available for vendor accounts.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Items' }} />

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={currentColors.accent} />
        }
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <View style={styles.headerTitleBlock}>
              <Text style={styles.headerTitle}>
                {vendor?.name ? `${vendor.name}'s Items` : 'Manage Items'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {items.length} item{items.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleOpenAddForm}>
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          items.length === 0 ? (
            <View>
              <Ionicons
                name="cube-outline"
                size={36}
                color={currentColors.textSecondary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyText}>
                No items yet. Tap Add Item to publish your first service or product.
              </Text>
            </View>
          ) : null
        }
      />

      <VendorItemForm
        visible={isFormVisible}
        vendorId={vendor?.id}
        initialItem={editingItem}
        isSubmitting={isSubmitting}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />
    </SafeAreaView>
  );
}
