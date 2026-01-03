import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventTeam, CreateEventTeamPayload, UpdateEventTeamPayload } from '../../types/eventTypes';
import { UserProfile } from '../../types/userTypes';
import { useAppTheme } from '@/context/AppThemeContext';
import MultiUserPicker from '../common/MultiUserPicker';
import { getAllUsersForPicker, searchUsersByName } from '../../services/userService';
import { useAppAuth } from '../../hooks/useAppAuth'; // Assuming useAppAuth provides auth status
import { useAlert } from '@/context/AlertContext';

interface EventTeamFormProps {
  initialTeam?: Partial<Omit<EventTeam, 'members'>> & { id?: string; members?: string[] }; // Added members to initialTeam
  onSubmit: (teamData: CreateEventTeamPayload | UpdateEventTeamPayload, teamId?: string) => void;
  onCancel: () => void;
}

const EventTeamForm: React.FC<EventTeamFormProps> = ({
  initialTeam,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAppAuth();
  const isAuthenticated = !!user;
  const { currentColors } = useAppTheme();
  const { showError } = useAlert();
  const [name, setName] = useState(initialTeam?.name || '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(initialTeam?.members || []);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchInitialUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingUsers(true);
    try {
      const users = await getAllUsersForPicker(isAuthenticated, 20);
      setAllUsers(users);
      setDisplayedUsers(users.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showError('Error', 'Could not load users.');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isAuthenticated, showError]);

  useEffect(() => {
    fetchInitialUsers();
  }, [fetchInitialUsers]);

  const handleSearchUsers = useCallback(async (query: string) => {
    setSearchTerm(query);
    if (!isAuthenticated) return;

    if (!query.trim()) {
      setDisplayedUsers(allUsers.slice(0, 5));
      return;
    }

    setIsLoadingUsers(true);
    try {
      const searchedUsers = await searchUsersByName(isAuthenticated, query, 10);
      setDisplayedUsers(searchedUsers);
    } catch (error)
{
      console.error('Failed to search users:', error);
      showError('Error', 'Could not search users.');
      setDisplayedUsers(allUsers.slice(0,5));
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isAuthenticated, allUsers, showError]);


  const handleSubmit = () => {
    if (!name.trim()) {
      showError('Validation Error', 'Team name cannot be empty.');
      return;
    }

    const teamData = {
      name: name.trim(),
      members: selectedMemberIds.map(userId => ({ userId, role: 'helper' as const })),
    };

    if (initialTeam?.id) {
      onSubmit(teamData as UpdateEventTeamPayload, initialTeam.id);
    } else {
      onSubmit(teamData as CreateEventTeamPayload);
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: currentColors.backgroundPaper,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.border,
      backgroundColor: currentColors.background,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: currentColors.text,
    },
    headerButton: {
      padding: 5,
    },
    headerButtonText: {
      fontSize: 16,
      color: currentColors.primary,
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
    },
    fieldContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: currentColors.textSecondary,
      marginBottom: 8,
      fontWeight: '500',
    },
    requiredStar: {
      color: currentColors.error,
    },
    input: {
      backgroundColor: currentColors.background,
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      color: currentColors.text,
      marginBottom: 10,
    },
    noResultsText: {
      textAlign: 'center',
      color: currentColors.textSecondary,
      marginTop: 15,
      marginBottom: 10,
      fontSize: 14,
    },
  }), [currentColors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={currentColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{initialTeam?.id ? 'Edit Team Name' : 'Create New Team'}</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Team Name <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Planning Committee, Volunteers"
            placeholderTextColor={currentColors.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Assign Members</Text>
          <TextInput
            style={styles.input} // Can reuse or create a new style for search input
            placeholder="Search users by name..."
            placeholderTextColor={currentColors.textSecondary}
            value={searchTerm}
            onChangeText={handleSearchUsers} // Debounce this in a real app
          />
          {isLoadingUsers && <ActivityIndicator size="small" color={currentColors.primary} style={{ marginTop: 10 }} />}
          {!isLoadingUsers && displayedUsers.length === 0 && searchTerm.length > 0 && (
            <Text style={styles.noResultsText}>No users found for &quot;{searchTerm}&quot;.</Text>
          )}
          {!isLoadingUsers && (
            <MultiUserPicker
              users={displayedUsers} // Show all fetched users or searched users
              selectedUserIds={selectedMemberIds}
              onSelectionChange={setSelectedMemberIds}
              listMaxHeight={250} // Adjust as needed
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventTeamForm;
