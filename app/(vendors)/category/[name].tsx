import React, { useCallback } from 'react'; // Added useCallback
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createCategoryStyles } from '../../../styles/app/(vendors)/category/[name].styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '../../../constants/Colors';
import { DisplayVendorItem, useVendorItemsSearch } from '../../../hooks/useVendors';
import { VendorItemSearchParams } from '../../../types/vendorItemTypes';

export default function VendorCategoryScreen() {
  const { currentColors } = useAppTheme();
  const styles = createCategoryStyles(currentColors);


  const { name: vendorCategorySlug } = useLocalSearchParams<{ name: string }>();

  const {
    displayItems,
    isLoading,
    error,
    loadMoreItems,
    totalItems,
  } = useVendorItemsSearch(vendorCategorySlug ? { vendorCategorySlug, limit: 10 } : {} as VendorItemSearchParams);

  const handleNavigateToVendorDetails = useCallback((vendorId: string) => {
    router.push(`/(vendors)/details/${vendorId}`);
  }, []);

  const renderDisplayVendorItem = useCallback(({ item }: { item: DisplayVendorItem }): JSX.Element => {
    const vendorName = item.vendorProfile?.name || 'Unknown Vendor';
    const vendorRating = item.vendorProfile?.averageRating;
    const vendorReviews = item.vendorProfile?.numberOfReviews;
    const itemCategoryDisplay = item.category || 'General Item'; // Item's own category
    const itemImage = item.imageUrl || item.vendorProfile?.logoUrl;
    const iconName: keyof typeof Ionicons.glyphMap = itemImage ? 'image-outline' : 'storefront-outline';

    return (
      <TouchableOpacity
        style={styles.vendorCard} 
        onPress={() => handleNavigateToVendorDetails(item.vendorId)}
      >
        <View style={styles.vendorImageContainer}>
          {itemImage ? (
            <Ionicons name="image-outline" size={40} color="#333" />
          ) : (
            <Ionicons name={iconName} size={40} color="#333" />
          )}
        </View>
        <View style={styles.vendorContent}>
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{item.name}</Text> {/* Item Name */}
            <Text style={styles.vendorCategoryName}>Offered by: {vendorName}</Text> {/* Vendor Name */}
            <Text style={styles.vendorCategoryName}>Item Category: {itemCategoryDisplay}</Text>
            {typeof item.price === 'number' ? (
              <Text style={styles.itemPrice}>Price: ${item.price.toFixed(2)}</Text>
            ) : (
              <Text style={styles.itemPrice}>Price: {item.price}</Text>
            )}
            {vendorRating !== undefined && vendorRating > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={currentColors.tint} />
                <Text style={styles.ratingText}>{vendorRating.toFixed(1)} ({vendorReviews || 0} reviews)</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [handleNavigateToVendorDetails, styles, currentColors]);

  if (isLoading && displayItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: vendorCategorySlug || 'Category Items' }} />
        <ActivityIndicator size="large" color={currentColors.tint} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Error loading items: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: `Items in ${vendorCategorySlug}` }} />

      
      {displayItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items found in this vendor category.</Text>
        </View>
      ) : (
        <FlatList
          data={displayItems}
          renderItem={renderDisplayVendorItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          onEndReached={() => {
            if (displayItems.length < totalItems) {
              loadMoreItems();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading && displayItems.length > 0 ? <ActivityIndicator color={currentColors.tint} style={{ marginVertical: 20 }}/> : null}
        />
      )}
    </SafeAreaView>
  );
}
