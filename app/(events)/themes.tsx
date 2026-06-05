import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createThemesStyles } from '../../styles/app/(events)/themes.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '@/hooks/useAppAuth';
import { useEventDetail } from '@/hooks/useEvents';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import EventDetailTheme from '@/components/events/details/EventDetailTheme';
import { createEventDetailsStyles } from '@/styles/app/(events)/details/[id].styles';
import { EventNavigation } from '@/utils/eventNavigation';

const ChooseThemePage: React.FC = () => {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = EventNavigation.resolveEventId(params.eventId);
  const { currentColors } = useAppTheme();
  const styles = createThemesStyles(currentColors);
  const detailStyles = createEventDetailsStyles(currentColors);
  const { user: currentUser } = useAppAuth();

  const {
    event,
    currentTheme,
    availableThemes,
    setEventTheme,
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
            title: 'Event Theme',
            ...HeaderButtonItems.headerLeftBackOptions(
              currentColors.accentContrastText,
              'onAccent',
              `/(events)/details/${eventId}`,
            ),
          }}
        />
        <ScrollView style={detailStyles.container}>
          <EventDetailTheme
            currentTheme={currentTheme}
            availableThemes={availableThemes}
            onSetEventTheme={async (themeId) => {
              await setEventTheme(themeId);
            }}
            isOrganizer={isOrganizer}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    router.push('/(events)/website');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: 'Choose Theme' }} />

      <View style={styles.tabContainer}>
        <View style={[styles.tabItem, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Details ✓</Text>
        </View>
        <View style={[styles.tabItem, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Themes</Text>
        </View>
        <View style={[styles.tabItem, styles.lastTab]}>
          <Text style={styles.tabText}>Website</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollableContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Select a Theme</Text>
          <Text style={styles.emptyMessage}>Open an event to manage its theme.</Text>

          <View style={styles.navigationContainer}>
            <TouchableOpacity style={styles.backNextButton} onPress={handleBack}>
              <Text style={styles.backNextButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backNextButton} onPress={handleNext}>
              <Text style={styles.backNextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseThemePage;
