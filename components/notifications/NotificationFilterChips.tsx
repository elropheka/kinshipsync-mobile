import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { useAppTheme } from '@/context/AppThemeContext';
import { createNotificationFilterChipsStyles } from '../../styles/components/notifications/NotificationFilterChips.styles';

export interface FilterChip {
  id: string;
  label: 'All' | 'Events' | 'Messages' | 'Updates';
}

interface NotificationFilterChipsProps {
  filters: FilterChip[];
  activeFilter: FilterChip['label'];
  setActiveFilter: (label: FilterChip['label']) => void;
}

const NotificationFilterChips: React.FC<NotificationFilterChipsProps> = ({
  filters,
  activeFilter,
  setActiveFilter,
}) => {
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createNotificationFilterChipsStyles(currentColors), [currentColors]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScrollContainer}
      contentContainerStyle={styles.filterContainer}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterChip,
            activeFilter === filter.label && styles.activeFilterChip,
          ]}
          onPress={() => setActiveFilter(filter.label)}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === filter.label && styles.activeFilterText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default NotificationFilterChips;
