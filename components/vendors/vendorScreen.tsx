import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/AppThemeContext';
import { styles, ITEM_WIDTH } from '../../styles/components/vendors/vendorScreen.styles';
import { DisplayVendorItem, useVendorItemsSearch } from '../../hooks/useVendors';
import { VendorItemSearchParams } from '../../types/vendorItemTypes';
import { router } from 'expo-router';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const VendorScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const listRef = useRef<FlatList<DisplayVendorItem>>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const { 
    displayItems, 
    isLoading, 
    error 
  } = useVendorItemsSearch({ limit: 5, sortBy: 'newest' } as VendorItemSearchParams);

  const onMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (displayItems && displayItems.length > 0) {
      setCurrentIndex(index % displayItems.length);
    }
  }, [displayItems]);

  useEffect(() => {
    let intervalId: any; 
    if (!isPaused && displayItems && displayItems.length > 0) {
      intervalId = setInterval(() => {
        const nextIndex = (currentIndex + 1) % displayItems.length;
        listRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentIndex, isPaused, displayItems]);

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  const handleNavigateToDetails = (vendorId: string) => {
    router.push(`/(vendors)/details/${vendorId}`);
  };

  const renderCard = useCallback(({ item, index }: { item: DisplayVendorItem; index: number }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    
    const scale = scrollX.interpolate({ inputRange, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' });
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0.6, 1, 0.6], extrapolate: 'clamp' });
    const zIndex = scrollX.interpolate({ inputRange, outputRange: [0, 10, 0], extrapolate: 'clamp' });

    const vendorName = item.vendorProfile?.name || 'Vendor';
    const itemImage = item.imageUrl || item.vendorProfile?.logoUrl;
    const vendorRating = item.vendorProfile?.averageRating;

    return (
      <Animated.View style={[styles.cardContainer, { transform: [{ scale }], opacity, zIndex }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleNavigateToDetails(item.vendorId)}>
          <View style={styles.imageWrapper}>
            {itemImage ? (
              <Image source={{ uri: itemImage }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name="storefront-outline" size={50} color={currentColors.textSecondary} />
              </View>
            )}
            <TouchableOpacity style={styles.heartIcon} onPress={() => console.log('Favorite item:', item.id)}>
              <Icon name="heart-o" size={20} color={currentColors.textSecondary}/>
            </TouchableOpacity>
          </View>
          <View style={styles.info}>
            <Text style={styles.category}>{item.category?.toUpperCase() || 'SERVICE'}</Text>
            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.subheading} numberOfLines={1}>by {vendorName}</Text>
            {vendorRating !== undefined && vendorRating > 0 && (
              <View style={styles.rating}>
                <Icon name="star" size={14} color={currentColors.tint} />
                <Text style={styles.ratingText}>{vendorRating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNavigateToDetails]); // scrollX is an animation value, not a dependency

  if (isLoading && (!displayItems || displayItems.length === 0)) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
         <View style={styles.header}>
          <Text style={styles.heading}>Local vendors & services</Text>
        </View>
        <Text style={{ textAlign: 'center', color: currentColors.error, marginTop: 20 }}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  if (!displayItems || displayItems.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.heading}>Local vendors & services</Text>
          <Text style={styles.subheading}>Find top-rated pros for any budget, background and style</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No items to display in carousel.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <View style={styles.header}>
        <Text style={styles.heading}>Local vendors & services</Text>
        <Text style={styles.subheading}>
          Find top-rated pros for any budget, background and style
        </Text>
      </View>

      <View 
        style={styles.carouselContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Animated.FlatList
          ref={listRef}
          data={displayItems} 
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={{ 
            paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2 
          }}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={renderCard}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index,
            index,
          })}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true } 
          )}
          scrollEventThrottle={16}
        />
      </View>
    </SafeAreaView>
  );
};

export default VendorScreen;
