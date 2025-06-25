import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Image, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import { WebsitePayload, UpdateEventWebsiteDetailsPayload } from '../../../types/eventTypes';
import EventWebsiteForm from '../../website/EventWebsiteForm'; // Path to existing EventWebsiteForm
import { styles } from '../../../styles/app/(events)/details/[id].styles'; // Adjust path as needed
import { Colors } from '../../../constants/Colors';
import { getEventWebsiteUrl } from '../../../utils/eventWebsiteUtils';
import * as Linking from 'expo-linking'; // For opening URLs

interface EventDetailWebsiteProps {
  eventWebsite: WebsitePayload | null | undefined;
  onUpdateEventWebsite: (websiteData: UpdateEventWebsiteDetailsPayload) => Promise<void>;
}

const EventDetailWebsite: React.FC<EventDetailWebsiteProps> = ({
  eventWebsite,
  onUpdateEventWebsite,
}) => {
  console.log('EventDetailWebsite - eventWebsite:', eventWebsite);
  const { width } = useWindowDimensions();
  const [isWebsiteFormVisible, setIsWebsiteFormVisible] = useState(false);

  const handleOpenWebsiteForm = () => {
    setIsWebsiteFormVisible(true);
  };

  const handleCloseWebsiteForm = () => {
    setIsWebsiteFormVisible(false);
  };

  const handleWebsiteFormSubmit = async (websiteData: UpdateEventWebsiteDetailsPayload) => {
    try {
      console.log('Submitting website data:', websiteData);
      // Ensure published field is included
      const dataToSubmit = {
        ...websiteData,
        published: websiteData.published ?? false
      };
      await onUpdateEventWebsite(dataToSubmit);
      Alert.alert('Success', 'Event website updated.');
      handleCloseWebsiteForm();
    } catch (e) {
      console.error("Failed to update event website:", e);
      Alert.alert('Error', 'Failed to save website details.');
    }
  };

  const handleViewLiveWebsite = () => {
    if (eventWebsite?.customUrlSlug && eventWebsite.published) {
      const url = getEventWebsiteUrl(eventWebsite.customUrlSlug);
      Linking.openURL(url).catch(err => {
        console.error("Failed to open URL:", err);
        Alert.alert("Error", "Could not open the event website. Please ensure the URL is valid.");
      });
    } else if (!eventWebsite?.published) {
      Alert.alert("Website Not Published", "The event website is currently in draft mode and not visible to the public.");
    } else {
      Alert.alert("URL Missing", "Custom URL slug is not set for this website.");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Event Website</Text>
        <View style={styles.headerActions}>
          {eventWebsite?.customUrlSlug && eventWebsite.published && (
            <TouchableOpacity onPress={handleViewLiveWebsite} style={styles.headerActionButton}>
              <Ionicons name="globe-outline" size={24} color={Colors.light.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleOpenWebsiteForm} style={styles.headerActionButton}>
            <Ionicons name="create-outline" size={28} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>
      {eventWebsite?.title ? (
        <>
          {eventWebsite.headerImageUrl && (
            <Image source={{ uri: eventWebsite.headerImageUrl }} style={styles.detailHeaderImage} />
          )}
          <Text style={styles.detailTextBold}>Title: <Text style={styles.detailText}>{eventWebsite.title}</Text></Text>
          {eventWebsite.customUrlSlug && <Text style={styles.detailTextBold}>URL: <Text style={styles.detailText}>{getEventWebsiteUrl(eventWebsite.customUrlSlug)}</Text></Text> }
          {eventWebsite.welcomeMessage && (
            <View style={styles.welcomeMessageContainer}>
              <Text style={styles.detailTextBold}>Welcome:</Text>
              <RenderHtml
                contentWidth={width}
                source={{ html: eventWebsite.welcomeMessage }}
                baseStyle={styles.detailText}
              />
            </View>
          )}
          <Text style={styles.detailTextBold}>Status: <Text style={styles.detailText}>{eventWebsite.published ? 'Published' : 'Draft'}</Text></Text>
          <Text style={styles.detailText}>{eventWebsite.sections?.length || 0} sections</Text>
          {eventWebsite.sections?.map((section, index) => (
            <View key={section.id} style={styles.sectionContainer}>
              <Text style={styles.detailTextBold}>{section.title}</Text>
              <RenderHtml
                contentWidth={width}
                source={{ html: section.content }}
                baseStyle={styles.detailText}
              />
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.emptyListText}>No website details set up yet.</Text>
      )}

      <Modal
        visible={isWebsiteFormVisible}
        animationType="slide"
        onRequestClose={handleCloseWebsiteForm}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <EventWebsiteForm
            initialWebsiteData={eventWebsite || { published: false }} // Pass object with default published state if no data yet
            onSubmit={handleWebsiteFormSubmit}
            onCancel={handleCloseWebsiteForm}
          />
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

export default EventDetailWebsite;
