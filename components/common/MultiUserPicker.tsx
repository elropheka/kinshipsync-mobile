import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '@/types/userTypes';
import { Colors } from '@/constants/Colors';

interface MultiUserPickerProps {
  users: UserProfile[];
  selectedUserIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  itemHeight?: number;
  listMaxHeight?: number;
}

const MultiUserPicker: React.FC<MultiUserPickerProps> = ({
  users,
  selectedUserIds,
  onSelectionChange,
  itemHeight = 50,
  listMaxHeight = 200,
}) => {
  const handleToggleUser = (userId: string) => {
    const newSelectedIds = selectedUserIds.includes(userId)
      ? selectedUserIds.filter(id => id !== userId)
      : [...selectedUserIds, userId];
    onSelectionChange(newSelectedIds);
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => {
    const isSelected = selectedUserIds.includes(item.userId);
    return (
      <TouchableOpacity
        style={[styles.itemContainer, { height: itemHeight }]}
        onPress={() => handleToggleUser(item.userId)}
      >
        <Ionicons
          name={isSelected ? 'checkbox-outline' : 'square-outline'}
          size={24}
          color={isSelected ? Colors.light.tint : Colors.light.icon}
          style={styles.checkboxIcon}
        />
        <Text style={styles.userNameText}>{item.displayName || item.email || item.userId}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pickerTitle}>Assign to:</Text>
      <View style={[styles.listWrapper, { maxHeight: listMaxHeight }]}>
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item.userId}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        />
      </View>
      {selectedUserIds.length > 0 && (
        <Text style={styles.selectedCountText}>
          {selectedUserIds.length} user(s) selected
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  listWrapper: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  checkboxIcon: {
    marginRight: 12,
  },
  userNameText: {
    fontSize: 15,
    color: Colors.light.text,
    flex: 1, 
  },
  selectedCountText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 6,
    textAlign: 'right',
  },
});

export default MultiUserPicker;
