import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useCurrentUser } from '@/hooks/useUser';
import { getVendorRequestById, updateRequestStatus } from '@/services/vendorRequestService';
import { getVendorByOwnerId } from '@/services/vendorService';
import { VendorRequest } from '@/types/vendorRequestTypes';
import { Vendor } from '@/types/vendorTypes';
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
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  descriptionBox: {
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: theme.accent,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  dangerBtn: {
    flex: 1,
    backgroundColor: '#DC3545',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  successBtn: {
    flex: 1,
    backgroundColor: '#28A745',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  btnTextSecondary: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: 10,
  },
  timelineText: {
    fontSize: 13,
    color: theme.textSecondary,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
    marginTop: 20,
    fontSize: 14,
  },
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function VendorRequestDetailScreen() {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createStyles(currentColors), [currentColors]);
  const { id: requestId } = useLocalSearchParams<{ id: string }>();
  const { user: authUser } = useAppAuth();
  const { profile } = useCurrentUser();

  const [request, setRequest] = useState<VendorRequest | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!requestId || !authUser?.uid) return;

    const loadData = async () => {
      try {
        const req = await getVendorRequestById(requestId);
        setRequest(req);
        const vend = await getVendorByOwnerId(authUser.uid);
        setVendor(vend);
      } catch (e) {
        console.error('Error loading request:', e);
      }
      setIsLoading(false);
    };
    loadData();
  }, [requestId, authUser?.uid]);

  const handleUpdateStatus = async (status: 'accepted' | 'declined' | 'fulfilled') => {
    if (!requestId) return;
    setIsUpdating(true);
    const success = await updateRequestStatus(requestId, status);
    if (success) {
      setRequest((prev) => (prev ? { ...prev, status } : prev));
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ title: 'Request Details' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentColors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!request) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ title: 'Request Details' }} />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={currentColors.textSecondary} />
          <Text style={styles.emptyText}>Request not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending': return { backgroundColor: '#FFF3CD', color: '#856404' };
      case 'accepted': return { backgroundColor: '#D4EDDA', color: '#155724' };
      case 'declined': return { backgroundColor: '#F8D7DA', color: '#721C24' };
      case 'fulfilled': return { backgroundColor: '#CCE5FF', color: '#004085' };
      default: return { backgroundColor: '#E2E3E5', color: '#383D41' };
    }
  };

  const badge = getBadgeStyle(request.status);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Request Details' }} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.statusBadge, { backgroundColor: badge.backgroundColor }]}>
          <Text style={[styles.statusText, { color: badge.color }]}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Customer</Text>
          <Text style={styles.sectionValue}>{request.customerName}</Text>

          <Text style={styles.sectionLabel}>Event</Text>
          <Text style={styles.sectionValue}>{request.eventName}</Text>

          <Text style={styles.sectionLabel}>Service Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {request.serviceDescription || 'No description provided.'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: currentColors.accent }]} />
              <Text style={styles.timelineText}>
                Request sent on {formatDate(request.createdAt)}
              </Text>
            </View>
            {request.status !== 'pending' && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: badge.color }]} />
                <Text style={styles.timelineText}>
                  Request {request.status} on {formatDate(request.updatedAt)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {request.status === 'pending' && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => handleUpdateStatus('accepted')}
              disabled={isUpdating}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>
                {isUpdating ? 'Updating...' : 'Accept'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dangerBtn}
              onPress={() => handleUpdateStatus('declined')}
              disabled={isUpdating}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>
                {isUpdating ? 'Updating...' : 'Decline'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {request.status === 'accepted' && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => handleUpdateStatus('fulfilled')}
            disabled={isUpdating}
          >
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>
              {isUpdating ? 'Updating...' : 'Mark as Fulfilled'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.secondaryBtn, { marginTop: 12 }]}
          onPress={() => {
            router.push({
              pathname: '/(chat)/chatArea',
              params: { conversationId: request.customerId },
            });
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={currentColors.text} />
          <Text style={styles.btnTextSecondary}>Message Customer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
