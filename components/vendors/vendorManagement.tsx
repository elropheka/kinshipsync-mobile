import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/AppThemeContext';
import { styles } from '../../styles/components/vendors/vendorManagement.styles';
import { Vendor } from '../../types/vendorTypes';
import { useAppAuth } from '../../hooks/useAppAuth';
import { useUserVendors } from '../../hooks/useVendors';
import { router } from 'expo-router';
import { LoadingScreen } from '@/components/common/LoadingScreen';
const VendorManagementScreen = () => {
  const { currentColors } = useAppTheme();
  const { user } = useAppAuth();

  const {
    userVendors,
    isLoading: isLoadingUserVendors,
    error: errorUserVendors,
  } = useUserVendors(user?.uid);

  const handleNavigateToDetails = (vendorId: string) => {
    router.push(`/(vendors)/details/${vendorId}`);
  };

  const renderVendorCard = (vendor: Vendor) => {
    const categoryName = vendor.categories && vendor.categories.length > 0 
      ? vendor.categories[0].name 
      : 'Uncategorized';
    
    const iconName: keyof typeof Ionicons.glyphMap = vendor.logoUrl ? 'image-outline' : 'storefront-outline';

    return (
      <TouchableOpacity 
        key={vendor.id} 
        style={styles.vendorCard}
        onPress={() => handleNavigateToDetails(vendor.id)}
      >
        <View style={styles.vendorHeader}>
          <View style={styles.vendorIconContainer}>
            {vendor.logoUrl ? (
              <Ionicons name="image-outline" size={30} color="#555" style={styles.vendorIcon} />
            ) : (
              <Ionicons name={iconName} size={30} color="#555" style={styles.vendorIcon} />
            )}
          </View>
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <Text style={styles.vendorCategory}>{categoryName}</Text>
            {vendor.averageRating !== undefined && vendor.averageRating > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={currentColors.tint} />
                <Text style={styles.ratingText}>{vendor.averageRating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.chevronButton} onPress={() => handleNavigateToDetails(vendor.id)}>
            <Ionicons name="chevron-forward" size={24} color={currentColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoadingUserVendors) {
    return <LoadingScreen />;
  }

  if (errorUserVendors) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading your vendors: {errorUserVendors.message}</Text>
      </SafeAreaView>
    );
  }

  if (!userVendors || userVendors.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven&apos;t added any vendors yet.</Text>
          <TouchableOpacity onPress={() => router.push('/(vendors)/all')} style={styles.browseButton}>
            <Text style={styles.browseButtonText}>Browse All Vendors</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.vendorList}>
        {userVendors.map(vendor => renderVendorCard(vendor))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorManagementScreen;
