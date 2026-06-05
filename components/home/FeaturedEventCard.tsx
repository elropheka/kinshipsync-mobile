import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventNavigation } from '@/utils/eventNavigation';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import { BrandButton } from '@/components/ui/BrandButton';
import { BrandText } from '@/components/ui/BrandText';
import type { HomeFeaturedEvent } from '@/hooks/useHomeDashboard';

interface FeaturedEventCardProps {
  event?: HomeFeaturedEvent | null;
  preview?: boolean;
}

export class FeaturedEventCard extends React.Component<FeaturedEventCardProps> {
  public render(): React.ReactNode {
    return <FeaturedEventCardInner {...this.props} />;
  }
}

const FeaturedEventCardInner: React.FC<FeaturedEventCardProps> = ({
  event,
  preview = false,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  if (!event) {
    return null;
  }

  const content = (
    <View style={styles.overlay}>
      <BrandText variant="h3" color="light">
        {event.title}
      </BrandText>
      <BrandText variant="body" color="light" style={styles.subtitle}>
        {event.subtitle}
      </BrandText>
      {!preview ? (
        <View style={styles.actions}>
          <BrandButton
            label="RSVP"
            variant="primary"
            onPress={() => EventNavigation.push('rsvps', event.eventId)}
            style={styles.actionButton}
          />
          <TouchableOpacity
            style={[styles.actionButton, styles.scheduleButton]}
            onPress={() => EventNavigation.push('schedule', event.eventId)}
          >
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.card}>
      {event.imageUri ? (
        <ImageBackground source={{ uri: event.imageUri }} style={styles.image} imageStyle={styles.imageRadius}>
          {content}
        </ImageBackground>
      ) : (
        <View style={[styles.image, styles.fallbackBackground]}>{content}</View>
      )}
      <Image
        source={require('@/assets/branding/rusty-brown-logo.png')}
        style={styles.watermark}
        resizeMode="contain"
      />
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    card: {
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.accent,
      marginBottom: Spacing.l,
    },
    image: {
      minHeight: 220,
      justifyContent: 'flex-end',
    },
    fallbackBackground: {
      backgroundColor: theme.secondary,
    },
    imageRadius: {
      borderRadius: BorderRadius.xl,
    },
    overlay: {
      backgroundColor: 'rgba(93, 36, 19, 0.45)',
      padding: Spacing.l,
      gap: Spacing.xs,
    },
    subtitle: {
      opacity: 0.95,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.s,
      marginTop: Spacing.m,
    },
    actionButton: {
      flex: 1,
    },
    scheduleButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.textLight,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    scheduleButtonText: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: theme.textLight,
    },
    watermark: {
      position: 'absolute',
      top: Spacing.m,
      right: Spacing.m,
      width: 72,
      height: 24,
      opacity: 0.85,
    },
  });

export default FeaturedEventCard;
