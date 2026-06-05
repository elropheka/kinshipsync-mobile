import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventNavigation } from '@/utils/eventNavigation';
import { useAppTheme } from '@/context/AppThemeContext';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/dimensions';
import { BrandText } from '@/components/ui/BrandText';

type TileVariant = 'green' | 'orange' | 'golden' | 'rust' | 'sand';

interface EventDetailTile {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: TileVariant;
  onPress: () => void;
}

interface EventDetailTileGridProps {
  eventId: string;
}

export class EventDetailTileGrid extends React.Component<EventDetailTileGridProps> {
  public render(): React.ReactNode {
    return <EventDetailTileGridInner eventId={this.props.eventId} />;
  }
}

const EventDetailTileGridInner: React.FC<EventDetailTileGridProps> = ({ eventId }) => {
  const { currentColors } = useAppTheme();
  const styles = createStyles(currentColors);

  const tiles: EventDetailTile[] = [
    {
      id: 'schedule',
      title: 'Schedule',
      icon: 'calendar-outline',
      variant: 'green',
      onPress: () => EventNavigation.push('schedule', eventId),
    },
    {
      id: 'guests',
      title: 'Guests',
      icon: 'people-outline',
      variant: 'orange',
      onPress: () => EventNavigation.push('rsvps', eventId),
    },
    {
      id: 'seating',
      title: 'Seating',
      icon: 'grid-outline',
      variant: 'rust',
      onPress: () => EventNavigation.push('seating', eventId),
    },
    {
      id: 'tasks',
      title: 'Tasks',
      icon: 'checkbox-outline',
      variant: 'green',
      onPress: () => EventNavigation.push('tasks', eventId),
    },
    {
      id: 'budget',
      title: 'Budget',
      icon: 'wallet-outline',
      variant: 'golden',
      onPress: () => EventNavigation.push('budget', eventId),
    },
    {
      id: 'ideas',
      title: 'Ideas',
      icon: 'bulb-outline',
      variant: 'orange',
      onPress: () => EventNavigation.push('ideas', eventId),
    },
    {
      id: 'teams',
      title: 'Teams',
      icon: 'people-circle-outline',
      variant: 'rust',
      onPress: () => EventNavigation.push('createNewTeam', eventId),
    },
    {
      id: 'theme',
      title: 'Theme',
      icon: 'color-palette-outline',
      variant: 'sand',
      onPress: () => EventNavigation.push('themes', eventId),
    },
    {
      id: 'website',
      title: 'Website',
      icon: 'globe-outline',
      variant: 'green',
      onPress: () => EventNavigation.push('website', eventId),
    },
  ];

  const variantStyle: Record<TileVariant, { backgroundColor: string; textColor: 'light' | 'primary' }> = {
    green: { backgroundColor: currentColors.primary, textColor: 'light' },
    orange: { backgroundColor: currentColors.accent, textColor: 'light' },
    golden: { backgroundColor: currentColors.accentHighlight, textColor: 'primary' },
    rust: { backgroundColor: currentColors.secondary, textColor: 'light' },
    sand: { backgroundColor: currentColors.backgroundSecondary, textColor: 'primary' },
  };

  return (
    <View style={styles.grid}>
      {tiles.map((tile, index) => {
        const colors = variantStyle[tile.variant];
        const isAloneOnRow = tiles.length % 2 === 1 && index === tiles.length - 1;
        return (
          <TouchableOpacity
            key={tile.id}
            style={[
              styles.tile,
              isAloneOnRow && styles.tileFullWidth,
              { backgroundColor: colors.backgroundColor },
            ]}
            onPress={tile.onPress}
            accessibilityRole="button"
            accessibilityLabel={tile.title}
          >
            <Ionicons
              name={tile.icon}
              size={26}
              color={colors.textColor === 'light' ? currentColors.textLight : currentColors.text}
            />
            <BrandText
              variant="body"
              color={colors.textColor}
              style={styles.tileLabel}
            >
              {tile.title}
            </BrandText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.m,
      paddingHorizontal: Spacing.m,
      paddingBottom: Spacing.l,
    },
    tile: {
      width: '47%',
      flexGrow: 0,
      flexShrink: 0,
      minHeight: 100,
      borderRadius: BorderRadius.xl,
      padding: Spacing.m,
      justifyContent: 'space-between',
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    tileLabel: {
      marginTop: Spacing.s,
      fontWeight: '600',
    },
    tileFullWidth: {
      width: '100%',
    },
  });

export default EventDetailTileGrid;
