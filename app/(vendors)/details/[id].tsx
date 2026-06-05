import React, { useCallback } from 'react'; // Added useCallback
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  Button,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createVendorDetailsStyles } from '../../../styles/app/(vendors)/details/[id].styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { VendorReview } from '../../../types/vendorTypes';
import { DisplayVendorItem, useVendorDetail, useVendorItemsSearch } from '../../../hooks/useVendors';
import { VendorItemSearchParams } from '../../../types/vendorItemTypes';

export default function VendorDetailsScreen() {
  const { currentColors } = useAppTheme();
  const styles = createVendorDetailsStyles(currentColors);


  const { id: vendorIdFromRoute } = useLocalSearchParams<{ id: string }>();

  const {
    vendor,
    reviews,
    totalReviews,
    isLoading: isLoadingVendorDetails, // Renamed for clarity
    isLoadingVendor,
    isLoadingReviews,
    error: errorVendorDetails, // Renamed for clarity
    loadMoreReviews,
  } = useVendorDetail(vendorIdFromRoute); // Pass the logged ID here

  const {
    displayItems: vendorItems,
    isLoading: isLoadingVendorItems,
    error: errorVendorItems,
    loadMoreItems: loadMoreVendorItems, // eslint-disable-line @typescript-eslint/no-unused-vars
    totalItems: totalVendorItems, // eslint-disable-line @typescript-eslint/no-unused-vars
  } = useVendorItemsSearch(vendorIdFromRoute ? { vendorId: vendorIdFromRoute, limit: 5 } : {} as VendorItemSearchParams);

  const handleNavigateToItemDetails = (itemId: string) => {
    console.log("Navigate to item details for item ID:", itemId);
  };

  const renderVendorItemCard = useCallback(({ item }: { item: DisplayVendorItem }) => {
    const itemImage = item.imageUrl;
    const iconName: keyof typeof Ionicons.glyphMap = itemImage ? 'image-outline' : 'cube-outline';

    return (
      <TouchableOpacity 
        style={styles.itemCard} // Use a different style for item cards on this page
        onPress={() => handleNavigateToItemDetails(item.id)}
      >
        {itemImage ? (
          <Image source={{ uri: itemImage }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Ionicons name={iconName} size={30} color={currentColors.textSecondary} />
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPriceText}>
            {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}
          </Text>
          <Text style={styles.itemCategoryText}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);


  const renderReviewItem = ({ item }: { item: VendorReview }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>User ID: {item.userId.substring(0, 6)}...</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={currentColors.tint} />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment || 'No comment.'}</Text>
      <Text style={styles.reviewDate}>{new Date(item.reviewDate).toLocaleDateString()}</Text>
    </View>
  );

  if (isLoadingVendor || (isLoadingVendorDetails && !vendor)) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Loading Vendor...' }} />
        <ActivityIndicator size="large" color={currentColors.tint} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (errorVendorDetails) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Error loading vendor: {errorVendorDetails.message}</Text>
      </SafeAreaView>
    );
  }

  if (!vendor) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Vendor Not Found' }} />
        <Text style={styles.emptyText}>Vendor not found.</Text>
      </SafeAreaView>
    );
  }

  const categoryNames = (vendor.categories ?? []).map(cat => cat.name).join(', ') || 'N/A';

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: vendor.name || 'Vendor Details' }} />

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {vendor.logoUrl && (
          <Image source={{ uri: vendor.logoUrl }} style={styles.logoImage} resizeMode="contain" />
        )}
        {!vendor.logoUrl && (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="storefront-outline" size={80} color={currentColors.textSecondary} />
          </View>
        )}

        <Text style={styles.vendorName}>{vendor.name}</Text>
        
        {vendor.averageRating !== undefined && vendor.averageRating > 0 && (
          <View style={styles.ratingSection}>
            <Ionicons name="star" size={20} color={currentColors.tint} />
            <Text style={styles.ratingValue}>{vendor.averageRating.toFixed(1)}</Text>
            <Text style={styles.numberOfReviews}>({vendor.numberOfReviews || 0} reviews)</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{vendor.description || 'No description available.'}</Text>

        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.infoText}>{categoryNames}</Text>

        {/* Contact Info, Address, etc. */}
        {vendor.contactEmail && (<><Text style={styles.sectionTitle}>Contact Email</Text><Text style={styles.infoText}>{vendor.contactEmail}</Text></>)}
        {vendor.phoneNumber && (<><Text style={styles.sectionTitle}>Phone</Text><Text style={styles.infoText}>{vendor.phoneNumber}</Text></>)}
        {vendor.websiteUrl && (<><Text style={styles.sectionTitle}>Website</Text><TouchableOpacity onPress={() => console.log('Open website', vendor.websiteUrl)}><Text style={[styles.infoText, styles.linkText]}>{vendor.websiteUrl}</Text></TouchableOpacity></>)}
        {vendor.address && (<><Text style={styles.sectionTitle}>Address</Text><Text style={styles.infoText}>{`${vendor.address.street || ''}, ${vendor.address.city || ''}, ${vendor.address.state || ''} ${vendor.address.postalCode || ''}, ${vendor.address.country || ''}`.replace(/ , |, $/g, '')}</Text></>)}
        {vendor.servicesOffered && vendor.servicesOffered.length > 0 && (<><Text style={styles.sectionTitle}>Services Offered</Text>{vendor.servicesOffered.map((service, index) => (<Text key={index} style={styles.listItem}>- {service}</Text>))}</>)}
        {vendor.pricingInfo && (<><Text style={styles.sectionTitle}>Pricing</Text><Text style={styles.infoText}>{vendor.pricingInfo}</Text></>)}
        {vendor.operatingHours && (<><Text style={styles.sectionTitle}>Operating Hours</Text><Text style={styles.infoText}>{vendor.operatingHours}</Text></>)}

        {vendor.portfolioImageUrls && vendor.portfolioImageUrls.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portfolioScrollView}>
              {vendor.portfolioImageUrls.map((url, index) => (
                <Image key={index} source={{ uri: url }} style={styles.portfolioImage} resizeMode="cover" />
              ))}
            </ScrollView>
          </>
        )}

        {/* Vendor Items Section */}
        <Text style={styles.sectionTitle}>Products & Services</Text>
        {isLoadingVendorItems && <ActivityIndicator color={currentColors.tint} style={{ marginVertical: 10 }} />}
        {errorVendorItems && <Text style={styles.errorText}>Error loading items: {errorVendorItems.message}</Text>}
        {!isLoadingVendorItems && !errorVendorItems && vendorItems.length === 0 && (
          <Text style={styles.emptyText}>This vendor has no items listed yet.</Text>
        )}
        {vendorItems.length > 0 && (
          <FlatList
            data={vendorItems}
            renderItem={renderVendorItemCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Already in a ScrollView
            // Could add a "View All Items" button if list is paginated/limited
          />
        )}

        <Text style={styles.sectionTitle}>Reviews ({totalReviews})</Text>
        {isLoadingReviews && reviews.length === 0 && <ActivityIndicator color={currentColors.tint} style={{ marginVertical: 10 }} />}
        
        {reviews.length > 0 ? (
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListFooterComponent={() => (
              <>
                {isLoadingReviews && reviews.length > 0 && <ActivityIndicator color={currentColors.tint} style={{ marginVertical: 10 }} />}
                {reviews.length < totalReviews && !isLoadingReviews && (
                  <Button title="Load More Reviews" onPress={() => loadMoreReviews()} color={currentColors.tint} />
                )}
              </>
            )}
          />
        ) : (
          !isLoadingReviews && <Text style={styles.emptyText}>No reviews yet.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
