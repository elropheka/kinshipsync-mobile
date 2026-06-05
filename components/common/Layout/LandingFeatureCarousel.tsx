import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@/components/common/slider';
import { BrandText } from '@/components/ui/BrandText';
import { landingFeatures, type LandingFeature } from '@/constants/mock/landingFeatures';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SLIDE_WIDTH = SCREEN_WIDTH - Spacing.l * 2;
const CAROUSEL_HEIGHT = Math.max(SCREEN_HEIGHT * 0.36, 280);
const IMAGE_HEIGHT = Math.round(CAROUSEL_HEIGHT * 0.46);

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
        width={SLIDE_WIDTH}
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
                <View style={slideStyles.imageWrap}>
                  <Image
                    source={{ uri: feature.imageUri }}
                    style={slideStyles.image}
                    resizeMode="cover"
                  />
                  <View style={slideStyles.imageOverlay} />
                  <View style={slideStyles.iconBadge}>
                    <Ionicons
                      name={feature.icon as keyof typeof Ionicons.glyphMap}
                      size={22}
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
    imageWrap: {
      height: IMAGE_HEIGHT,
      width: '100%',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(93, 36, 19, 0.18)',
    },
    iconBadge: {
      position: 'absolute',
      bottom: -Spacing.m,
      left: Spacing.l,
      width: 48,
      height: 48,
      borderRadius: BorderRadius.l,
      backgroundColor: iconBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: backgroundColor,
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
      paddingTop: Spacing.l + Spacing.s,
      paddingHorizontal: Spacing.l,
      paddingBottom: Spacing.l,
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
    width: '100%',
    alignItems: 'center',
  },
  slide: {
    width: SLIDE_WIDTH,
    paddingHorizontal: Spacing.xs,
  },
});

export default LandingFeatureCarousel;
