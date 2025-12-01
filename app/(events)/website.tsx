import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Stack, router } from 'expo-router'; // Stack import moved here
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(events)/website.styles';

const WebsitePreviewPage: React.FC = () => {
  const handleDone = () => {
    router.push('/(main)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: "Website Preview" }} />

      <View style={styles.tabContainer}>
        <View style={[styles.tabItem, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Details ✓</Text>
        </View>
        <View style={[styles.tabItem, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Themes ✓</Text>
        </View>
        <View style={[styles.tabItem, styles.activeTab, styles.lastTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Website</Text>
        </View>
      </View>

      <Text style={styles.previewTitle}>Preview</Text>

      <View style={styles.previewContainer}>
        <View style={styles.websitePreview}>
          <View style={styles.websiteHeader}>
            <Text style={styles.weddingTitle}>WEDDING</Text>
          </View>
          
          <Image 
            source={{ uri: 'https://via.placeholder.com/400x400' }} 
            style={styles.weddingImage}
          />
          
          <View style={styles.websiteFooter}>
            <View style={styles.coupleNameContainer}>
              <Text style={styles.coupleName}>SARAH</Text>
              <Text style={styles.ampersand}>&</Text>
              <Text style={styles.coupleName}>DANIEL</Text>
            </View>
            <Text style={styles.weddingDate}>MAY 20, 2024</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WebsitePreviewPage;
