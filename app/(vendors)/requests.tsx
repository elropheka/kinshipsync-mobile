import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useCurrentUser } from '@/hooks/useUser';
import { listenToVendorRequests } from '@/services/vendorRequestService';
import { VendorRequest, RequestStatus } from '@/types/vendorRequestTypes';
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
  filterScroll: {
    marginHorizontal: -16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.border,
    flexShrink: 0,
  },
  filterChipActive: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
  filterText: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  eventName: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  serviceDesc: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 6,
  },
  dateText: {
    fontSize: 11,
    color: theme.textSecondary,
    marginTop: 4,
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
});

const FILTERS: { label: string; value: RequestStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Fulfilled', value: 'fulfilled' },
  { label: 'Declined', value: 'declined' },
];

const getStatusStyle = (status: string, colors: any) => {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#FFF3CD', color: '#856404' };
    case 'accepted':
      return { backgroundColor: '#D4EDDA', color: '#155724' };
    case 'declined':
      return { backgroundColor: '#F8D7DA', color: '#721C24' };
    case 'fulfilled':
      return { backgroundColor: '#CCE5FF', color: '#004085' };
    default:
      return { backgroundColor: '#E2E3E5', color: '#383D41' };
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function VendorRequestsScreen() {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createStyles(currentColors), [currentColors]);
  const { user: authUser } = useAppAuth();
  const { profile } = useCurrentUser();

  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<RequestStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authUser?.uid || !profile?.isVendor) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = listenToVendorRequests(
      authUser.uid,
      (reqs) => {
        setRequests(reqs);
        setIsLoading(false);
        setRefreshing(false);
      },
      () => {
        setIsLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, [authUser?.uid, profile?.isVendor]);

  const filteredRequests = useMemo(() => {
    if (activeFilter === 'all') return requests;
    return requests.filter((r) => r.status === activeFilter);
  }, [requests, activeFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: VendorRequest }) => {
      const badge = getStatusStyle(item.status, currentColors);
      return (
        <TouchableOpacity
          style={styles.requestCard}
          onPress={() => router.push(`/(vendors)/request/${item.id}` as any)}
        >
          <View style={styles.requestHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>{item.customerName}</Text>
              <Text style={styles.eventName}>{item.eventName}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: badge.backgroundColor }]}>
              <Text style={[styles.statusText, { color: badge.color }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          {item.serviceDescription && (
            <Text style={styles.serviceDesc}>{item.serviceDescription}</Text>
          )}
          <Text style={styles.dateText}>{formatTime(item.createdAt)}</Text>
        </TouchableOpacity>
      );
    },
    [currentColors, styles]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Requests' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentColors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile?.isVendor) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Requests' }} />
        <View style={styles.loadingContainer}>
          <Ionicons name="chatbox-ellipses-outline" size={48} color={currentColors.textSecondary} />
          <Text style={styles.emptyText}>Vendor requests are only available for vendor accounts.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Requests' }} />
      
      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={currentColors.accent} />
        }
        ListHeaderComponent={
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterRow}
          >
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
                onPress={() => setActiveFilter(f.value)}
              >
                <Text style={[styles.filterText, activeFilter === f.value && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        }
        ListEmptyComponent={
          <View>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={36}
              color={currentColors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              {activeFilter === 'all'
                ? 'No requests yet.'
                : `No ${activeFilter} requests.`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
