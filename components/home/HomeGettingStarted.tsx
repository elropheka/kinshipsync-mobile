import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import Fonts from '@/constants/fonts';
import { BrandButton } from '@/components/ui/BrandButton';
import { BrandSectionHeader } from '@/components/ui/BrandSectionHeader';
import { BrandText } from '@/components/ui/BrandText';
import {
  gettingStartedSteps,
  homeDiscoverFeatures,
  homeWelcomeContent,
  type GettingStartedStep,
  type HomeDiscoverFeature,
} from '@/constants/branding/homeGettingStarted';

type DiscoverPalette = 'green' | 'orange' | 'rust';

const DISCOVER_PALETTES: DiscoverPalette[] = ['green', 'orange', 'rust'];

interface HomeGettingStartedProps {
  onCreateEventPress?: () => void;
}

export class HomeGettingStarted extends React.Component<HomeGettingStartedProps> {
  public render(): React.ReactNode {
    return <HomeGettingStartedInner {...this.props} />;
  }
}

const HomeGettingStartedInner: React.FC<HomeGettingStartedProps> = ({
  onCreateEventPress,
}) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  const handleCreateEvent = () => {
    if (onCreateEventPress) {
      onCreateEventPress();
      return;
    }
    router.push('/(events)/createEvent');
  };

  const handleStepPress = (step: GettingStartedStep) => {
    router.push(step.route as Parameters<typeof router.push>[0]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <ImageBackground
          source={require('@/assets/images/home-hero-family.png')}
          style={styles.heroImage}
          imageStyle={styles.heroImageRadius}
        >
          <Image
            source={require('@/assets/branding/beige-see-throug-logo.png')}
            style={styles.heroWatermark}
            resizeMode="contain"
          />
        </ImageBackground>

        <View style={styles.heroContent}>
          <BrandText variant="h3" color="light">
            {homeWelcomeContent.headline}
          </BrandText>
          <BrandText variant="body" color="light" style={styles.heroTagline}>
            {homeWelcomeContent.tagline}
          </BrandText>
          <BrandButton
            label={homeWelcomeContent.ctaLabel}
            variant="primary"
            onPress={handleCreateEvent}
            style={styles.heroCta}
          />
        </View>
      </View>

      <BrandSectionHeader title="Getting Started" />
      <View style={styles.stepsList}>
        {gettingStartedSteps.map((step) => (
          <TouchableOpacity
            key={step.id}
            style={styles.stepRow}
            onPress={() => handleStepPress(step)}
            activeOpacity={0.7}
          >
            <View style={styles.stepBadge}>
              <BrandText variant="caption" color="light">
                {step.step}
              </BrandText>
            </View>
            <View style={styles.stepIconWrap}>
              <Ionicons
                name={step.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={currentColors.primary}
              />
            </View>
            <View style={styles.stepText}>
              <BrandText variant="body" style={styles.stepTitle}>
                {step.title}
              </BrandText>
              <BrandText variant="caption" color="secondary">
                {step.description}
              </BrandText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={currentColors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <BrandSectionHeader title="Discover Kinship Sync" style={styles.discoverHeader} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.discoverStrip}
      >
        {homeDiscoverFeatures.map((feature, index) => (
          <DiscoverCard
            key={feature.id}
            feature={feature}
            palette={DISCOVER_PALETTES[index % DISCOVER_PALETTES.length]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface DiscoverCardProps {
  feature: HomeDiscoverFeature;
  palette: DiscoverPalette;
}

const DiscoverCard: React.FC<DiscoverCardProps> = ({ feature, palette }) => {
  const { currentColors } = useAppTheme();
  const cardStyles = createDiscoverCardStyles(currentColors, palette);

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.iconBadge}>
        <Ionicons
          name={feature.icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={currentColors.primary}
        />
      </View>
      <BrandText variant="body" color="light" style={cardStyles.title}>
        {feature.title}
      </BrandText>
      <BrandText variant="caption" color="light" style={cardStyles.description}>
        {feature.description}
      </BrandText>
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      marginBottom: Spacing.l,
    },
    heroCard: {
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      backgroundColor: theme.secondary,
      marginBottom: Spacing.l,
    },
    heroImage: {
      height: 180,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    heroImageRadius: {
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
    },
    heroWatermark: {
      width: 72,
      height: 24,
      marginTop: Spacing.m,
      marginRight: Spacing.m,
      opacity: 0.9,
    },
    heroContent: {
      padding: Spacing.l,
      gap: Spacing.s,
      backgroundColor: theme.secondary,
    },
    heroTagline: {
      opacity: 0.95,
      lineHeight: 22,
    },
    heroCta: {
      marginTop: Spacing.m,
    },
    stepsList: {
      gap: Spacing.s,
      marginBottom: Spacing.l,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.neutralBg,
      borderRadius: BorderRadius.l,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.m,
      gap: Spacing.s,
    },
    stepBadge: {
      width: 24,
      height: 24,
      borderRadius: BorderRadius.round,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepIconWrap: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.m,
      backgroundColor: theme.backgroundLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepText: {
      flex: 1,
      gap: 2,
    },
    stepTitle: {
      fontFamily: Fonts.headerSemiBold,
    },
    discoverHeader: {
      marginTop: Spacing.s,
    },
    discoverStrip: {
      gap: Spacing.s,
      paddingRight: Spacing.m,
    },
  });

const createDiscoverCardStyles = (theme: typeof Colors.light, palette: DiscoverPalette) => {
  const backgroundColor =
    palette === 'green'
      ? theme.primary
      : palette === 'orange'
        ? theme.accent
        : theme.secondary;

  return StyleSheet.create({
    card: {
      width: 200,
      minHeight: 140,
      borderRadius: BorderRadius.l,
      padding: Spacing.m,
      backgroundColor,
      justifyContent: 'flex-end',
    },
    iconBadge: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.m,
      backgroundColor: 'rgba(255,255,255,0.92)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.s,
    },
    title: {
      marginBottom: Spacing.xxs,
    },
    description: {
      lineHeight: 18,
      opacity: 0.9,
    },
  });
};

export default HomeGettingStarted;
