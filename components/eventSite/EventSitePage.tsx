import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Event, WebsitePayload } from '../../types/eventTypes';
import type { Theme } from '../../types/themeTypes';
import { useAllThemes } from '../../hooks/useAllThemes';
import { standardLightPalette } from '../../theme/standardPalettes';
import RenderHtml from 'react-native-render-html';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface EventSitePageProps {
  event: Event;
  websiteDetails: WebsitePayload;
}

export const EventSitePage: React.FC<EventSitePageProps> = ({ event, websiteDetails }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { allThemes, isLoading: isLoadingThemes } = useAllThemes();
  const theme = allThemes.find((t: Theme) => t.id === (websiteDetails.websiteThemeId || event.themeId));

  const isLoading = isLoadingThemes;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={standardLightPalette.primary} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (!event || !websiteDetails) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Ionicons name="alert-circle" size={48} color={standardLightPalette.error} />
        </View>
        <Text style={styles.errorTitle}>Event Not Found</Text>
        <Text style={styles.errorMessage}>
          The event you're looking for might have been removed or is not available.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/events')}
        >
          <Ionicons name="arrow-back" size={24} color={standardLightPalette.primary} />
          <Text style={styles.backButtonText}>Back to Events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme?.colors.background || standardLightPalette.background
        }
      ]}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButtonAbsolute}
        onPress={() => router.push('/events')}
      >
        <Ionicons name="arrow-back" size={24} color={standardLightPalette.primary} />
      </TouchableOpacity>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        {websiteDetails.headerImageUrl && (
          <Image
            source={{ uri: websiteDetails.headerImageUrl }}
            style={styles.headerImage}
          />
        )}
        <View style={styles.heroOverlay}>
          <Text
            style={[
              styles.heroTitle,
              {
                color: theme?.colors.primaryContrastText || standardLightPalette.textOnBackground,
                fontFamily: theme?.fonts.heading.fontFamily
              }
            ]}
          >
            {websiteDetails.title || event.name}
          </Text>

          <View style={styles.heroDetails}>
            <View style={styles.detailRow}>
                <Ionicons name="calendar" size={24} color={standardLightPalette.primaryContrastText} />
              <Text style={styles.detailText}>{formatDate(event.date)}</Text>
            </View>

            {event.time && (
              <View style={styles.detailRow}>
                <Ionicons name="time" size={24} color={standardLightPalette.primaryContrastText} />
                <Text style={styles.detailText}>{event.time}</Text>
              </View>
            )}

            {event.location && (
              <View style={styles.detailRow}>
                <Ionicons name="location" size={24} color={standardLightPalette.primaryContrastText} />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Welcome Message */}
      {websiteDetails.welcomeMessage && (
        <View style={styles.section}>
          <View
            style={[
              styles.welcomeCard,
              {
                backgroundColor: theme?.colors.backgroundSecondary || standardLightPalette.surface
              }
            ]}
          >
            <RenderHtml
              contentWidth={width - 48}
              source={{ html: websiteDetails.welcomeMessage }}
              baseStyle={{
                color: theme?.colors.text || standardLightPalette.textOnBackground,
                fontFamily: theme?.fonts.body.fontFamily,
                fontSize: 16,
                lineHeight: 24
              }}
            />
          </View>
        </View>
      )}

      {/* Event Details */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme?.colors.primary || standardLightPalette.primary,
              fontFamily: theme?.fonts.heading.fontFamily
            }
          ]}
        >
          Event Details
        </Text>

        <View style={styles.detailsGrid}>
          {/* Date Card */}
          <View
            style={[
              styles.detailCard,
              {
                backgroundColor: theme?.colors.backgroundSecondary || standardLightPalette.surface
              }
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: `${theme?.colors.primary || standardLightPalette.primary}20`
                }
              ]}
            >
              <Ionicons
                name="calendar"
                size={32}
                color={theme?.colors.primary || standardLightPalette.primary}
              />
            </View>
            <Text
              style={[
                styles.detailCardTitle,
                {
                  color: theme?.colors.primary || standardLightPalette.primary
                }
              ]}
            >
              Date
            </Text>
            <Text
              style={[
                styles.detailCardText,
                {
                  color: theme?.colors.text || standardLightPalette.textOnBackground
                }
              ]}
            >
              {formatDate(event.date)}
            </Text>
          </View>

          {/* Time Card */}
          {event.time && (
            <View
              style={[
                styles.detailCard,
                {
                  backgroundColor: theme?.colors.backgroundSecondary || standardLightPalette.surface
                }
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${theme?.colors.accent || standardLightPalette.accent}20`
                  }
                ]}
              >
                <Ionicons
                  name="time"
                  size={32}
                  color={theme?.colors.accent || standardLightPalette.accent}
                />
              </View>
              <Text
                style={[
                  styles.detailCardTitle,
                  {
                    color: theme?.colors.primary || standardLightPalette.primary
                  }
                ]}
              >
                Time
              </Text>
              <Text
                style={[
                  styles.detailCardText,
                  {
                    color: theme?.colors.text || standardLightPalette.textOnBackground
                  }
                ]}
              >
                {event.time}
              </Text>
            </View>
          )}

          {/* Location Card */}
          {event.location && (
            <View
              style={[
                styles.detailCard,
                {
                  backgroundColor: theme?.colors.backgroundSecondary || standardLightPalette.surface
                }
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${theme?.colors.secondary || standardLightPalette.secondary}20`
                  }
                ]}
              >
                <Ionicons
                  name="location"
                  size={32}
                  color={theme?.colors.secondary || standardLightPalette.secondary}
                />
              </View>
              <Text
                style={[
                  styles.detailCardTitle,
                  {
                    color: theme?.colors.primary || standardLightPalette.primary
                  }
                ]}
              >
                Location
              </Text>
              <Text
                style={[
                  styles.detailCardText,
                  {
                    color: theme?.colors.text || standardLightPalette.textOnBackground
                  }
                ]}
              >
                {event.location}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Dynamic Sections */}
      {websiteDetails.sections?.map((section, index) => (
        <View
          key={section.id}
          style={[
            styles.section,
            index % 2 === 1 && {
              backgroundColor: theme?.colors.backgroundSecondary || standardLightPalette.surface
            }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme?.colors.primary || standardLightPalette.primary,
                fontFamily: theme?.fonts.heading.fontFamily
              }
            ]}
          >
            {section.title}
          </Text>
          <RenderHtml
            contentWidth={width - 48}
            source={{ html: section.content }}
            baseStyle={{
              color: theme?.colors.text || standardLightPalette.textOnBackground,
              fontFamily: theme?.fonts.body.fontFamily,
              fontSize: 16,
              lineHeight: 24
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: standardLightPalette.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: standardLightPalette.textOnBackground,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: standardLightPalette.background,
  },
  errorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: standardLightPalette.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: standardLightPalette.textOnBackground,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: standardLightPalette.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: standardLightPalette.surface,
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: standardLightPalette.primary,
    fontWeight: '600',
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    backgroundColor: standardLightPalette.surface,
    padding: 8,
    borderRadius: 20,
    shadowColor: standardLightPalette.textOnBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  heroSection: {
    height: 400,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: standardLightPalette.primaryContrastText,
  },
  heroDetails: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: standardLightPalette.primaryContrastText,
  },
  section: {
    padding: 24,
  },
  welcomeCard: {
    padding: 24,
    borderRadius: 16,
    shadowColor: standardLightPalette.textOnBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: standardLightPalette.textOnBackground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailCardText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventSitePage;
