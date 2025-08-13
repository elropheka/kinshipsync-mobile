import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventTeam, CreateEventTeamPayload, UpdateEventTeamPayload } from '../../types/eventTypes';
import { UserProfile } from '../../types/userTypes';
import { Colors } from '../../constants/Colors';
import MultiUserPicker from '../common/MultiUserPicker';
import { getAllUsersForPicker, searchUsersByName } from '../../services/userService';
import { useAppAuth } from '../../hooks/useAppAuth'; // Assuming useAppAuth provides auth status

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
  const { user } = useAppAuth(); // Get user from auth
  const isAuthenticated = !!user; // Derive isAuthenticated
  const [name, setName] = useState(initialTeam?.name || '');
  // If initialTeam.members is TeamMember[], map to ids. If it's string[], use directly.
  // For this fix, assuming initialTeam.members (if provided) are string[] for simplicity.
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(initialTeam?.members || []);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchInitialUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingUsers(true);
    try {
      // Fetch a larger batch initially if search is client-side on this batch
      // Or fetch a small initial batch and then search backend
      const users = await getAllUsersForPicker(isAuthenticated, 20); // Fetch 20 users
      setAllUsers(users);
      setDisplayedUsers(users.slice(0, 5)); // Display first 5
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Alert.alert('Error', 'Could not load users.');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchInitialUsers();
  }, [fetchInitialUsers]);

  const handleSearchUsers = useCallback(async (query: string) => {
    setSearchTerm(query);
    if (!isAuthenticated) return;

    if (!query.trim()) {
      setDisplayedUsers(allUsers.slice(0, 5)); // Show initial 5 if search is cleared
      return;
    }

    setIsLoadingUsers(true);
    try {
      const searchedUsers = await searchUsersByName(isAuthenticated, query, 10); // Limit search results
      setDisplayedUsers(searchedUsers);
    } catch (error)
{
      console.error('Failed to search users:', error);
      Alert.alert('Error', 'Could not search users.');
      setDisplayedUsers(allUsers.slice(0,5)); // Fallback to initial slice
    } finally {
      setIsLoadingUsers(false);
    }
  }, [isAuthenticated, allUsers]);


  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Team name cannot be empty.');
      return;
    }

    const teamData = {
      name: name.trim(),
      // Map selectedMemberIds to TeamMember objects with a default role
      members: selectedMemberIds.map(userId => ({ userId, role: 'Editor' as const })),
    };

    if (initialTeam?.id) {
      // Ensure the payload matches UpdateEventTeamPayload
      onSubmit(teamData as UpdateEventTeamPayload, initialTeam.id);
    } else {
      // Ensure the payload matches CreateEventTeamPayload
      onSubmit(teamData as CreateEventTeamPayload);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <Ionicons name="close-outline" size={28} color={Colors.light.text} />
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
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Assign Members</Text>
          <TextInput
            style={styles.input} // Can reuse or create a new style for search input
            placeholder="Search users by name..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchTerm}
            onChangeText={handleSearchUsers} // Debounce this in a real app
          />
          {isLoadingUsers && <ActivityIndicator size="small" color={Colors.light.primary} style={{ marginTop: 10 }} />}
          {!isLoadingUsers && displayedUsers.length === 0 && searchTerm.length > 0 && (
            <Text style={styles.noResultsText}>No users found for "{searchTerm}".</Text>
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

// Reusing similar styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.backgroundPaper, // Changed to backgroundPaper for consistency
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background, // Or backgroundPaper if header should match form bg
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold', // Consider using '600' or '700' for more control if Poppins is used
    color: Colors.light.text,
  },
  headerButton: {
    padding: 5,
  },
  headerButtonText: {
    fontSize: 16,
    color: Colors.light.primary,
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
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: '500', // Consider '600' if you want slightly bolder labels
  },
  requiredStar: {
    color: Colors.light.error,
  },
  input: {
    backgroundColor: Colors.light.background, // Changed to background to contrast with backgroundPaper
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 15, // Increased padding
    paddingVertical: 12, // Increased padding
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 10, // Added margin for search input
  },
  noResultsText: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    marginTop: 15,
    marginBottom: 10,
    fontSize: 14,
  },
  // Ensure MultiUserPicker styles are compatible or adjust them in its own file
});

export default EventTeamForm;
