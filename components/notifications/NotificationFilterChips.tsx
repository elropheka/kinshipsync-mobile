import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { styles } from '../../styles/components/notifications/NotificationFilterChips.styles';

export interface FilterChip {
  id: string;
  label: 'All' | 'Events' | 'Messages' | 'Updates'; // Keep this consistent with NotificationsPage
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
