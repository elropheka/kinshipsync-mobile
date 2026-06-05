import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@/components/common/slider';
import { BrandText } from '@/components/ui/BrandText';
import { landingFeatures, type LandingFeature } from '@/constants/branding/landingContent';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing, isTablet } from '@/constants/dimensions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const LANDING_HORIZONTAL_PADDING = isTablet() ? Spacing.xxl : Spacing.l;
const CAROUSEL_VIEWPORT_WIDTH = SCREEN_WIDTH;
const ACTIVE_CARD_WIDTH = Math.round(CAROUSEL_VIEWPORT_WIDTH * 0.78);
const CAROUSEL_HEIGHT = Math.max(SCREEN_HEIGHT * 0.36, 280);
const SLIDE_GAP = Spacing.s;

type SlidePalette = 'sand' | 'green' | 'orange' | 'rust';

const SLIDE_PALETTES: SlidePalette[] = ['sand', 'green', 'orange', 'rust', 'sand', 'green'];

interface LandingFeatureCarouselProps {
  features?: LandingFeature[];
}

export class LandingFeatureCarousel extends React.Component<LandingFeatureCarouselProps> {
  public render(): React.ReactNode {
    return <LandingFeatureCarouselInner {...this.props} />;
  }
}

const LandingFeatureCarouselInner: React.FC<LandingFeatureCarouselProps> = ({
  features = landingFeatures,
}) => {
  const { currentColors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <Slider
        height={CAROUSEL_HEIGHT}
        width={ACTIVE_CARD_WIDTH}
        containerWidth={CAROUSEL_VIEWPORT_WIDTH}
        peekAdjacent
        slideGap={SLIDE_GAP}
        autoPlay
        autoPlayInterval={4500}
        showDots
        showArrows={false}
        loop
      >
        {features.map((feature, index) => {
          const palette = SLIDE_PALETTES[index % SLIDE_PALETTES.length];
          const slideStyles = createSlideStyles(currentColors, palette);

          return (
            <View key={feature.id} style={styles.slide}>
              <View style={slideStyles.card}>
                <View style={slideStyles.iconHero}>
                  <View style={slideStyles.iconBadge}>
                    <Ionicons
                      name={feature.icon as keyof typeof Ionicons.glyphMap}
                      size={40}
                      color={slideStyles.iconColor.color}
                    />
                  </View>
                </View>

                <View style={slideStyles.content}>
                  <BrandText variant="h3" style={slideStyles.title} numberOfLines={1}>
                    {feature.title}
                  </BrandText>
                  <BrandText variant="body" style={slideStyles.description} numberOfLines={3}>
                    {feature.description}
                  </BrandText>
                </View>
              </View>
            </View>
          );
        })}
      </Slider>
    </View>
  );
};

const createSlideStyles = (theme: typeof Colors.light, palette: SlidePalette) => {
  const isLightText = palette === 'green' || palette === 'orange' || palette === 'rust';

  const backgroundColor =
    palette === 'green'
      ? theme.primary
      : palette === 'orange'
        ? theme.accent
        : palette === 'rust'
          ? theme.secondary
          : theme.backgroundSecondary;

  const textColor = isLightText ? theme.textLight : theme.text;
  const secondaryTextColor = isLightText ? theme.textLight : theme.textSecondary;
  const iconBg = isLightText ? 'rgba(255,255,255,0.92)' : theme.neutralBg;
  const iconColor = isLightText ? theme.primary : theme.primary;

  return StyleSheet.create({
    card: {
      minHeight: CAROUSEL_HEIGHT - 24,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      backgroundColor,
      borderWidth: 1,
      borderColor: isLightText ? 'transparent' : theme.border,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    iconHero: {
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isLightText ? 'rgba(255,255,255,0.08)' : theme.neutralBg,
    },
    iconBadge: {
      width: 72,
      height: 72,
      borderRadius: BorderRadius.xl,
      backgroundColor: iconBg,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    iconColor: {
      color: iconColor,
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.l,
      paddingVertical: Spacing.l,
      justifyContent: 'center',
    },
    title: {
      color: textColor,
      marginBottom: Spacing.s,
    },
    description: {
      color: secondaryTextColor,
      lineHeight: 22,
      fontSize: 16,
      opacity: isLightText ? 0.95 : 1,
    },
  });
};

const styles = StyleSheet.create({
  wrapper: {
    width: CAROUSEL_VIEWPORT_WIDTH,
    marginLeft: -LANDING_HORIZONTAL_PADDING,
    alignSelf: 'center',
  },
  slide: {
    width: '100%',
  },
});

export default LandingFeatureCarousel;
