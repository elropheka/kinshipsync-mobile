import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import { BrandText } from '@/components/ui/BrandText';

interface FeatureTile {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  variant: 'orange' | 'rust';
}

const tiles: FeatureTile[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    title: 'Family Tree',
    icon: 'git-network-outline',
    route: '/(main)/teams',
    variant: 'orange',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678902',
    title: 'Photos & Memories',
    icon: 'images-outline',
    route: '/(events)/all',
    variant: 'rust',
  },
];

export class FeatureGrid extends React.Component {
  public render(): React.ReactNode {
    return <FeatureGridInner />;
  }
}

const FeatureGridInner: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  return (
    <View style={styles.grid}>
      {tiles.map((tile) => (
        <TouchableOpacity
          key={tile.id}
          style={[styles.tile, tile.variant === 'orange' ? styles.orangeTile : styles.rustTile]}
          onPress={() => router.push(tile.route as any)}
        >
          <Ionicons name={tile.icon} size={28} color={currentColors.textLight} />
          <BrandText variant="body" color="light" style={styles.tileLabel}>
            {tile.title}
          </BrandText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      gap: Spacing.m,
      marginBottom: Spacing.l,
    },
    tile: {
      flex: 1,
      minHeight: 120,
      borderRadius: BorderRadius.xl,
      padding: Spacing.m,
      justifyContent: 'space-between',
    },
    orangeTile: {
      backgroundColor: theme.accent,
    },
    rustTile: {
      backgroundColor: theme.secondary,
    },
    tileLabel: {
      marginTop: Spacing.s,
    },
  });

export default FeatureGrid;
