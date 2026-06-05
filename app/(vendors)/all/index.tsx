import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { createIndexStyles } from '../../../styles/app/(vendors)/all/index.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import VendorManagement from '@/components/vendors/vendorManagement';
import { VendorCategory } from '../../../types/vendorTypes';
import { VendorItemSearchParams } from '../../../types/vendorItemTypes';
import { useVendorCategories, useVendorItemsSearch, DisplayVendorItem } from '../../../hooks/useVendors';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';

const VendorsScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createIndexStyles(currentColors), [currentColors]);


  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [activeTab, setActiveTab] = useState<string>('Find a Vendor');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);

  const {
    categories: vendorCategories,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useVendorCategories(undefined);

  const {
    displayItems,
    isLoading: isLoadingItems,
    error: errorItems,
    updateItemSearchCriteria,
    loadMoreItems, // Corrected from loadMore
    totalItems,
  } = useVendorItemsSearch({ limit: 10 } as VendorItemSearchParams); // Initialize with static params


  useEffect(() => {
    const handler = setTimeout(() => {
      if (isSearchBarVisible || searchQuery !== '') {
        updateItemSearchCriteria({ keyword: searchQuery, page: 1 });
      } else if (!isSearchBarVisible && searchQuery === '') {
        updateItemSearchCriteria({ keyword: '', page: 1 });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, updateItemSearchCriteria, isSearchBarVisible]);

  useEffect(() => {
    navigation.setOptions(
      HeaderButtonItems.headerRightIconOptions({
        label: isSearchBarVisible ? 'Close search' : 'Search',
        sfSymbol: isSearchBarVisible ? 'xmark' : 'magnifyingglass',
        ionicon: isSearchBarVisible ? 'close-outline' : 'search-outline',
        onPress: () => setIsSearchBarVisible((prev) => !prev),
        tintColor: currentColors.accentContrastText,
      }),
    );
  }, [navigation, isSearchBarVisible, currentColors.accentContrastText]);

  const handleNavigateToVendorDetails = useCallback((vendorId: string) => {
    router.push(`/(vendors)/details/${vendorId}`);
  }, []);

  const handleNavigateToCategory = useCallback((categorySlug: string) => {
    router.push(`/(vendors)/category/${categorySlug}`);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (activeTab !== 'Find a Vendor') return;
    
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 1000; // Trigger when 1000px from bottom
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (
      isCloseToBottom &&
      !isLoadingItems && 
      displayItems.length > 0 && 
      displayItems.length < totalItems
    ) {
      loadMoreItems();
    }
  }, [activeTab, isLoadingItems, displayItems.length, totalItems, loadMoreItems]);

  const renderDisplayVendorItem = useCallback(({ item }: { item: DisplayVendorItem }): JSX.Element => {
    const vendorName = item.vendorProfile?.name || 'Unknown Vendor';
    const vendorRating = item.vendorProfile?.averageRating;
    const vendorReviews = item.vendorProfile?.numberOfReviews;
    const itemCategoryDisplay = item.category || 'General Item';
    const itemImage = item.imageUrl || item.vendorProfile?.logoUrl;
    const iconName: keyof typeof Ionicons.glyphMap = itemImage ? 'image-outline' : 'storefront-outline';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.vendorCard}
        onPress={() => handleNavigateToVendorDetails(item.vendorId)}
      >
        <View style={styles.vendorImageContainer}>
          {itemImage ? (
            <Ionicons name="image-outline" size={40} color="#333" /> // Placeholder for actual image
          ) : (
            <Ionicons name={iconName} size={40} color="#333" />
          )}
        </View>
        <View style={styles.vendorContent}>
          <View style={styles.vendorInfo}>
            <View style={styles.vendorNameContainer}>
              <Text style={styles.vendorName}>{item.name}</Text> {/* Item Name */}
              {item.vendorProfile?.isFeatured && ( // Check isFeatured on vendorProfile
                <View style={styles.sponsoredBadge}>
                  <Ionicons name="star" size={12} color="#fff" />
                  <Text style={styles.sponsoredText}>Featured</Text> 
                </View>
              )}
            </View>
            <Text style={styles.vendorCategory}>Offered by: {vendorName}</Text>
            <Text style={styles.vendorCategory}>Item Category: {itemCategoryDisplay}</Text>
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

  const renderFindAVendorTab = useCallback(() => {
    return (
      <>
        {isSearchBarVisible && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Products or Services"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
          </View>
        )}

        <View style={styles.locationContainer}>
          <Text style={styles.locationHeader}>Reception venues near</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#333" />
            <Text style={styles.locationText}>New York City</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular types of vendors</Text>
          {isLoadingCategories && <ActivityIndicator color={currentColors.tint} />}
          {errorCategories && <Text>Error loading categories: {errorCategories.message}</Text>}
          {!isLoadingCategories && !errorCategories && (
            <View style={styles.vendorTypesContainer}>
              {vendorCategories.slice(0, 5).map((type: VendorCategory) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.vendorTypeItem}
                  onPress={() => handleNavigateToCategory(type.slug)}
                >
                  <View style={styles.vendorTypeIconContainer}>
                    <Ionicons name={(type.iconUrl as keyof typeof Ionicons.glyphMap) || 'apps-outline'} size={24} color="#333" />
                  </View>
                  <Text style={styles.vendorTypeName}>{type.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products & Services</Text>
          </View>
          {isLoadingItems && displayItems.length === 0 && (
            <ActivityIndicator color={currentColors.tint} style={{ marginTop: 20 }} />
          )}
          {errorItems && <Text>Error loading items: {errorItems.message}</Text>}
          {!isLoadingItems && !errorItems && displayItems.length === 0 && (
            <Text style={{textAlign: 'center', marginVertical: 20}}>
              No items found {searchQuery ? `for "${searchQuery}"` : ''}
            </Text>
          )}
          {displayItems.length > 0 && (
             displayItems.map((item: DisplayVendorItem) => <View key={item.id}>{renderDisplayVendorItem({item: item})}</View>)
          )}
          {isLoadingItems && displayItems.length > 0 && (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator color={currentColors.tint} size="small" />
              <Text style={styles.loadingText}>Loading more items...</Text>
            </View>
          )}
        </View>
      </>
    );
  }, [
    isSearchBarVisible, 
    searchQuery, 
    isLoadingCategories, 
    errorCategories, 
    vendorCategories, 
    isLoadingItems, 
    errorItems, 
    displayItems,
    handleNavigateToCategory, 
    renderDisplayVendorItem,
    styles,
    currentColors,
  ]);

  const renderTabContent = useCallback((): JSX.Element => {
    if (activeTab === 'Find a Vendor') {
      return renderFindAVendorTab();
    } else { 
      return <VendorManagement />;
    }
  }, [activeTab, renderFindAVendorTab]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
     
      <Stack.Screen options={{ title: 'Vendors & Services' }} />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBase, activeTab === 'Your Vendor' ? styles.tabActive : styles.tab]}
          onPress={() => setActiveTab('Your Vendor')}
        >
          <Text style={[styles.tabTextBase, activeTab === 'Your Vendor' ? styles.tabTextActive : styles.tabText]}>Your Vendors</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBase, activeTab === 'Find a Vendor' ? styles.tabActive : styles.tab]}
          onPress={() => setActiveTab('Find a Vendor')}
        >
          <Text style={[styles.tabTextBase, activeTab === 'Find a Vendor' ? styles.tabTextActive : styles.tabText]}>Find Services</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabIndicator}>
        <View style={[styles.indicatorBase, activeTab === 'Your Vendor' ? styles.activeIndicatorLeft : styles.activeIndicatorRight]} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        keyboardShouldPersistTaps="handled" 
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {renderTabContent()}
      </ScrollView>

      {activeTab === 'Find a Vendor' ? (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => router.push('/(vendors)/selection')} // This might need to change if selection is item-based
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => console.log("Add New Vendor Pressed")}>
          <Text style={styles.addButtonText}>Add New Vendor</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default VendorsScreen;
