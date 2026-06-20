import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { useCurrentUser } from '@/hooks/useUser';
import { useAppAuth } from '@/hooks/useAppAuth';
import { getVendorByOwnerId, getVendorItemsByVendorId } from '@/services/vendorService';
import { listenToVendorRequests } from '@/services/vendorRequestService';
import { Vendor } from '@/types/vendorTypes';
import { VendorRequest } from '@/types/vendorRequestTypes';
import { StyleSheet } from 'react-native';

const createDashboardStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.backgroundPaper,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.accent,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  seeAll: {
    fontSize: 14,
    color: theme.accent,
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
  quickActions: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundPaper,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 13,
    color: theme.text,
    marginLeft: 6,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
    marginTop: 20,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCompletion: {
    backgroundColor: theme.backgroundPaper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
  },
  completionPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.accent,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.accent,
    borderRadius: 3,
  },
});

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

export default function VendorDashboardScreen() {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createDashboardStyles(currentColors), [currentColors]);
  const { profile } = useCurrentUser();
  const { user: authUser } = useAppAuth();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.uid || !profile?.isVendor) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const vendorData = await getVendorByOwnerId(authUser.uid);
        const effectiveVendorId = vendorData?.id ?? authUser.uid;
        setVendor(
          vendorData ?? {
            id: authUser.uid,
            name: profile?.displayName ?? '',
            description: '',
            categories: [],
            ownerId: authUser.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
        const items = await getVendorItemsByVendorId(effectiveVendorId);
        setItemCount(items.length);
      } catch (e) {
        console.error('Error loading vendor data:', e);
      }
    };
    init();

    const unsubscribe = listenToVendorRequests(authUser.uid, (reqs) => {
      setRequests(reqs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [authUser?.uid, profile?.isVendor, profile?.displayName]);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled');
  const recentRequests = requests.slice(0, 5);

  const profileCompletion = useMemo(() => {
    if (!vendor) return 0;
    const fields = [
      vendor.name,
      vendor.description,
      vendor.contactEmail,
      vendor.phoneNumber,
      vendor.logoUrl,
      vendor.pricingInfo,
      vendor.operatingHours,
      vendor.servicesOffered && vendor.servicesOffered.length > 0,
      vendor.categories && vendor.categories.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [vendor]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Vendor Dashboard' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentColors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile?.isVendor) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Vendor Dashboard' }} />
        <View style={styles.loadingContainer}>
          <Ionicons name="storefront-outline" size={48} color={currentColors.textSecondary} />
          <Text style={styles.emptyText}>Vendor dashboard is only available for vendor accounts.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const vendorName = vendor?.name || authUser?.displayName || 'Vendor';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Vendor Dashboard' }} />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>Welcome, {vendorName}!</Text>
        <Text style={styles.subtitle}>Manage your services and customer requests</Text>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingRequests.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{fulfilledRequests.length}</Text>
            <Text style={styles.statLabel}>Fulfilled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{itemCount}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
        </View>

        {vendor && (
          <View style={styles.profileCompletion}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionLabel}>Profile Completion</Text>
              <Text style={styles.completionPercent}>{profileCompletion}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${profileCompletion}%` }]} />
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => router.push('/(vendors)/items' as any)}
          >
            <Ionicons name="cube-outline" size={20} color={currentColors.accent} />
            <Text style={styles.quickActionText}>Items</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => router.push('/(vendors)/requests' as any)}
          >
            <Ionicons name="chatbox-ellipses-outline" size={20} color={currentColors.accent} />
            <Text style={styles.quickActionText}>Requests</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          {requests.length > 5 && (
            <TouchableOpacity onPress={() => router.push('/(vendors)/requests' as any)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentRequests.length === 0 ? (
          <Text style={styles.emptyText}>No requests yet. When a customer sends a service request, it will appear here.</Text>
        ) : (
          recentRequests.map((req) => {
            const badge = getStatusStyle(req.status, currentColors);
            return (
              <TouchableOpacity
                key={req.id}
                style={styles.requestCard}
                onPress={() => router.push(`/(vendors)/request/${req.id}` as any)}
              >
                <View style={styles.requestHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.customerName}>{req.customerName}</Text>
                    <Text style={styles.eventName}>{req.eventName}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: badge.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: badge.color }]}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </Text>
                  </View>
                </View>
                {req.serviceDescription && (
                  <Text style={styles.serviceDesc}>{req.serviceDescription}</Text>
                )}
                <Text style={styles.dateText}>{formatTime(req.createdAt)}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
