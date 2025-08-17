import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/notifications/NotificationSearchBar.styles';

interface NotificationSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

}

const NotificationSearchBar: React.FC<NotificationSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search-outline"
        size={18}
        color="#888"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search notifications"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

export default NotificationSearchBar;
