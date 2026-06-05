import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createWebsiteStyles } from '../../styles/app/(events)/website.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useEventDetail } from '@/hooks/useEvents';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import EventDetailWebsite from '@/components/events/details/EventDetailWebsite';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { EventNavigation } from '@/utils/eventNavigation';

const WebsitePreviewPage: React.FC = () => {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = EventNavigation.resolveEventId(params.eventId);
  const { currentColors } = useAppTheme();
  const styles = createWebsiteStyles(currentColors);
  const detailStyles = createEventDetailsStyles(currentColors);
  const { user: currentUser } = useAppAuth();

  const {
    event,
    eventWebsite,
    updateEventWebsite,
    isLoading,
    error,
  } = useEventDetail(eventId);

  if (eventId) {
    const isOrganizer = currentUser?.uid === event?.organizerId;

    if (isLoading) {
      return <LoadingScreen />;
    }

    if (error || !event) {
      return (
        <View style={[detailStyles.container, detailStyles.centerContent]}>
          <Text style={detailStyles.errorText}>{error?.message || 'Event not found.'}</Text>
        </View>
      );
    }

    return (
      <SafeAreaView style={detailStyles.outerContainer} edges={['left', 'right', 'bottom']}>
        <Stack.Screen
          options={{
            title: 'Event Website',
            ...HeaderButtonItems.headerLeftBackOptions(
              currentColors.accentContrastText,
              'onAccent',
              `/(events)/details/${eventId}`,
            ),
          }}
        />
        <ScrollView style={detailStyles.container}>
          <EventDetailWebsite
            eventWebsite={eventWebsite}
            onUpdateEventWebsite={async (websiteData) => {
              await updateEventWebsite(websiteData);
            }}
            isOrganizer={isOrganizer}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleDone = () => {
    router.push('/(main)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Website Preview' }} />

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
