import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { WebsitePayload, UpdateEventWebsiteDetailsPayload } from '@/types/eventTypes';
import EventWebsiteForm from '@/components/website/EventWebsiteForm';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { getEventWebsiteUrl } from '@/utils/eventWebsiteUtils';
import * as Linking from 'expo-linking';
import { useAlert } from '@/context/AlertContext';

interface EventDetailWebsiteProps {
  eventId?: string;
  eventName?: string;
  eventWebsite: WebsitePayload | null | undefined;
  onUpdateEventWebsite: (websiteData: UpdateEventWebsiteDetailsPayload) => Promise<void>;
  isOrganizer?: boolean;
}

const EventDetailWebsite: React.FC<EventDetailWebsiteProps> = ({
  eventId,
  eventName,
  eventWebsite,
  onUpdateEventWebsite,
  isOrganizer = true
}) => {
  const { currentColors } = useAppTheme();
  const styles = createEventDetailsStyles(currentColors);
  const { width } = useWindowDimensions();
  const [isWebsiteFormVisible, setIsWebsiteFormVisible] = useState(false);
  const { showSuccess, showError, showInfo } = useAlert();

  const handleOpenWebsiteForm = () => {
    setIsWebsiteFormVisible(true);
  };

  const handleCloseWebsiteForm = () => {
    setIsWebsiteFormVisible(false);
  };

  const handleWebsiteFormSubmit = async (websiteData: UpdateEventWebsiteDetailsPayload) => {
    try {
      const dataToSubmit = {
        ...websiteData,
        published: websiteData.published ?? false
      };
      await onUpdateEventWebsite(dataToSubmit);
      showSuccess('Success', 'Event website updated.');
      handleCloseWebsiteForm();
    } catch (e) {
      console.error("Failed to update event website:", e);
      showError('Error', 'Failed to save website details.');
    }
  };

  const handleViewLiveWebsite = () => {
    if (eventWebsite?.customUrlSlug && eventWebsite.published) {
      const url = getEventWebsiteUrl(eventWebsite.customUrlSlug);
      Linking.openURL(url).catch(err => {
        console.error("Failed to open URL:", err);
        showError("Error", "Could not open the event website. Please ensure the URL is valid.");
      });
    } else if (!eventWebsite?.published) {
      showInfo("Website Not Published", "The event website is currently in draft mode and not visible to the public.");
    } else {
      showInfo("URL Missing", "Custom URL slug is not set for this website.");
    }
  };

  const handleCopyWebsiteLink = async () => {
    if (!eventWebsite?.customUrlSlug) {
      showInfo("URL Missing", "Custom URL slug is not set for this website.");
      return;
    }

    if (!eventWebsite.published) {
      showInfo("Website Not Published", "Publish the event website before sharing the link.");
      return;
    }

    const url = getEventWebsiteUrl(eventWebsite.customUrlSlug);
    await Clipboard.setStringAsync(url);
    showSuccess('Copied', 'Website link copied to clipboard.');
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Event Website</Text>
        <View style={styles.headerActions}>
          {eventWebsite?.customUrlSlug && eventWebsite.published && (
            <TouchableOpacity onPress={handleViewLiveWebsite} style={styles.headerActionButton}>
              <Ionicons name="globe-outline" size={24} color={currentColors.primary} />
            </TouchableOpacity>
          )}
          {isOrganizer && (
            <TouchableOpacity onPress={handleOpenWebsiteForm} style={styles.headerActionButton}>
              <Ionicons name="create-outline" size={28} color={currentColors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {eventWebsite?.title ? (
        <View>
          {eventWebsite.headerImageUrl && (
            <Image source={{ uri: eventWebsite.headerImageUrl }} style={styles.detailHeaderImage} />
          )}
          <Text style={styles.detailTextBold}>Title: <Text style={styles.detailText}>{eventWebsite.title}</Text></Text>
          {eventWebsite.customUrlSlug && (
            <View style={styles.websiteUrlRow}>
              <Text style={styles.detailTextBold}>URL: </Text>
              <Text style={[styles.detailText, styles.websiteUrlText]} selectable>
                {getEventWebsiteUrl(eventWebsite.customUrlSlug)}
              </Text>
            </View>
          )}
          {eventWebsite.customUrlSlug && (
            <TouchableOpacity style={styles.copyLinkButton} onPress={handleCopyWebsiteLink}>
              <Ionicons name="copy-outline" size={18} color={currentColors.primary} />
              <Text style={styles.copyLinkButtonText}>Copy Link</Text>
            </TouchableOpacity>
          )}
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
          {eventWebsite.sections?.map((section) => (
            <View key={section.id} style={styles.sectionContainer}>
              <Text style={styles.detailTextBold}>{section.title}</Text>
              <RenderHtml
                contentWidth={width}
                source={{ html: section.content }}
                baseStyle={styles.detailText}
              />
            </View>
          ))}
        </View>
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
            eventId={eventId}
            eventName={eventName}
            initialWebsiteData={eventWebsite || { published: false }}
            onSubmit={handleWebsiteFormSubmit}
            onCancel={handleCloseWebsiteForm}
          />
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

export default EventDetailWebsite;
