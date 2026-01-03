import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import { createIndexStyles } from '../../../styles/app/(vendors)/details/index.styles';
import { useAppTheme } from '@/context/AppThemeContext';

const { width } = Dimensions.get('window');

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  images: string[];
  services: Service[];
  reviews: Review[];
}

// Mock data for a vendor
const mockVendor: Vendor = {
  id: '1',
  name: 'The Genevieve',
  category: 'VENUE',
  rating: 4.5,
  description: 'A beautiful wedding venue with stunning views and exceptional service. Perfect for both intimate gatherings and large celebrations.',
  address: '123 Wedding Lane, Celebration City, CA 94321',
  phone: '+1 (555) 123-4567',
  email: 'info@genevieve.com',
  website: 'https://www.genevieve.com',
  images: [
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=60',
  ],
  services: [
    {
      id: 's1',
      name: 'Full Day Package',
      description: 'Access to the venue from 9am to midnight, including setup and cleanup time.',
      price: '$5,000',
    },
    {
      id: 's2',
      name: 'Catering Service',
      description: 'Full-service catering for up to 150 guests with customizable menu options.',
      price: '$75 per person',
    },
    {
      id: 's3',
      name: 'Decoration Package',
      description: 'Complete venue decoration including floral arrangements, lighting, and table settings.',
      price: '$2,500',
    },
  ],
  reviews: [
    {
      id: 'r1',
      author: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely stunning venue! Our wedding day was perfect thanks to the amazing staff and beautiful location.',
      date: '2023-06-15',
    },
    {
      id: 'r2',
      author: 'Michael Chen',
      rating: 4,
      comment: 'Great venue with excellent service. The only minor issue was limited parking for our guests.',
      date: '2023-05-22',
    },
    {
      id: 'r3',
      author: 'Jessica Williams',
      rating: 5,
      comment: 'The Genevieve exceeded all our expectations. The staff was attentive and the venue is breathtaking.',
      date: '2023-04-10',
    },
  ],
};

const StarRating: React.FC<{ rating: number; styles: any }> = ({ rating, styles }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.ratingContainer}>
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesome key={`full-${i}`} name="star" size={16} color="#FFD700" />
      ))}
      {halfStar && <FontAwesome name="star-half-o" size={16} color="#FFD700" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesome key={`empty-${i}`} name="star-o" size={16} color="#FFD700" />
      ))}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

export default function VendorDetailsScreen() {
  const { currentColors } = useAppTheme();
  const styles = createIndexStyles(currentColors);


  useLocalSearchParams(); // params not used
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('about');
  const vendor = mockVendor;

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleContact = (method: 'phone' | 'email' | 'website') => {
    switch (method) {
      case 'phone':
        Linking.openURL(`tel:${vendor.phone}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${vendor.email}`);
        break;
      case 'website':
        Linking.openURL(vendor.website);
        break;
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header View removed */}

          {/* Image Gallery */}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setActiveImageIndex(newIndex);
              }}
            >
              {vendor.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.vendorImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            
            {/* Image Pagination Dots */}
            <View style={styles.paginationContainer}>
              {vendor.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeImageIndex && styles.activePaginationDot,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Vendor Info */}
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <View>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.vendorCategory}>{vendor.category}</Text>
              </View>
              <StarRating rating={vendor.rating} styles={styles} />
            </View>

            {/* Quick Contact Buttons */}
            <View style={styles.contactButtonsContainer}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContact('phone')}
              >
                <Ionicons name="call" size={20} color="#4A90E2" />
                <Text style={styles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContact('email')}
              >
                <Ionicons name="mail" size={20} color="#4A90E2" />
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContact('website')}
              >
                <Ionicons name="globe" size={20} color="#4A90E2" />
                <Text style={styles.contactButtonText}>Website</Text>
              </TouchableOpacity>
            </View>

            {/* About Section */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('about')}
            >
              <Text style={styles.sectionTitle}>About</Text>
              <Ionicons 
                name={expandedSection === 'about' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#333" 
              />
            </TouchableOpacity>
            
            {expandedSection === 'about' && (
              <View style={styles.sectionContent}>
                <Text style={styles.descriptionText}>{vendor.description}</Text>
                <View style={styles.addressContainer}>
                  <Ionicons name="location" size={18} color="#666" />
                  <Text style={styles.addressText}>{vendor.address}</Text>
                </View>
              </View>
            )}

            {/* Services Section */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('services')}
            >
              <Text style={styles.sectionTitle}>Services & Packages</Text>
              <Ionicons 
                name={expandedSection === 'services' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#333" 
              />
            </TouchableOpacity>
            
            {expandedSection === 'services' && (
              <View style={styles.sectionContent}>
                {vendor.services.map((service) => (
                  <View key={service.id} style={styles.serviceItem}>
                    <View style={styles.serviceHeader}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.servicePrice}>{service.price}</Text>
                    </View>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Reviews Section */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => toggleSection('reviews')}
            >
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Ionicons 
                name={expandedSection === 'reviews' ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#333" 
              />
            </TouchableOpacity>
            
            {expandedSection === 'reviews' && (
              <View style={styles.sectionContent}>
                {vendor.reviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <StarRating rating={review.rating} styles={styles} />
                    </View>
                    <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.writeReviewButton}>
                  <Text style={styles.writeReviewText}>Write a Review</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Book Now Button */}
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => {
              console.log('Book now pressed');
            }}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
        
        {/* <BottomNavigation /> */}
      </SafeAreaView>
    </ErrorBoundary>
  );
}
