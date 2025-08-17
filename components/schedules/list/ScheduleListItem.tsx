import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Schedule } from '../../../types/scheduleTypes';
import { UserProfile } from '../../../types/userTypes';
import { Colors } from '../../../constants/Colors';

interface ScheduleListItemProps {
  schedule: Schedule;
  teamMembers: UserProfile[];
  onPress: () => void;
  onDelete: () => void;
}

const ScheduleListItem: React.FC<ScheduleListItemProps> = ({ schedule, teamMembers, onPress, onDelete }) => {
  const formatDate = (date: Date | undefined | string) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' });
  };

  const assignedUsers = schedule.assignedUserIds
    ?.map((userId: string) => teamMembers.find(member => member.userId === userId)?.displayName || userId.substring(0, 6) + "...")
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.listItemContainer}>
      <TouchableOpacity onPress={onPress} style={styles.contentContainer}>
        <Ionicons name="calendar-outline" size={24} color={Colors.light.primary} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{schedule.title}</Text>
          <Text style={styles.time}>
            {formatDate(schedule.startTime as unknown as Date)} - {formatDate(schedule.endTime as unknown as Date)}
          </Text>
          {assignedUsers && <Text style={styles.assignedUsers} numberOfLines={1}>Assigned: {assignedUsers}</Text>}
          {schedule.description && <Text style={styles.description} numberOfLines={1}>{schedule.description}</Text>}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color={Colors.light.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  time: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  assignedUsers: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ScheduleListItem;
