import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useCurrentUser } from '@/hooks/useUser';
import { getVendorByOwnerId, getVendorItemsByVendorId } from '@/services/vendorService';
import { Vendor } from '@/types/vendorTypes';
import { VendorItem } from '@/types/vendorItemTypes';
import { StyleSheet } from 'react-native';

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
    padding: 16,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
});

export default function VendorItemsScreen() {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createStyles(currentColors), [currentColors]);
  const { user: authUser } = useAppAuth();
  const { profile } = useCurrentUser();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [items, setItems] = useState<VendorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!authUser?.uid || !profile?.isVendor) {
      setIsLoading(false);
      return;
    }
    try {
      const vendorData = await getVendorByOwnerId(authUser.uid);
      setVendor(vendorData);
      if (vendorData) {
        const vendorItems = await getVendorItemsByVendorId(vendorData.id);
        setItems(vendorItems);
      }
    } catch (e) {
      console.error('Error loading vendor items:', e);
    }
    setIsLoading(false);
    setRefreshing(false);
  }, [authUser?.uid, profile?.isVendor]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const renderItem = useCallback(
    ({ item }: { item: VendorItem }) => (
      <View style={styles.itemCard}>
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
    ),
    [styles]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ title: 'My Items' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentColors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile?.isVendor) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ title: 'My Items' }} />
        <View style={styles.loadingContainer}>
          <Ionicons name="cube-outline" size={48} color={currentColors.textSecondary} />
          <Text style={styles.emptyText}>Vendor items are only available for vendor accounts.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ title: 'My Items' }} />
      
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
            <Text style={styles.headerTitle}>
              {vendor?.name ? `${vendor.name}'s Items` : 'My Items'}
            </Text>
            <Text style={{ fontSize: 14, color: currentColors.textSecondary }}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View>
            <Ionicons
              name="cube-outline"
              size={36}
              color={currentColors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              No items yet. Items added to your vendor profile will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
