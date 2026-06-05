import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router'; // Import useFocusEffect
import { useAppTheme } from '@/context/AppThemeContext';
import { createTeamsStyles } from '../../../styles/components/common/Layout/teams.styles';
import { Team, SuggestedTeam } from '../../../types/teamTypes'; // Removed TeamType
import { getTeamsForUser } from '../../../services/teamService'; // Import team service
import { AuthContext } from '../../../context/AuthContext'; // To get current user ID
import { BackendUser } from '../../../types/auth'; // Import BackendUser
import TeamListItem from '../../teams/list/TeamListItem'; // Import new component
import SuggestedTeamListItem from '../../teams/list/SuggestedTeamListItem'; // Import new component
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';

// Removed local Contact interface as it's not used with dynamic data

const CommunicationPage = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.user as (BackendUser & { uid: string }) | undefined;
  const { currentColors } = useAppTheme();
  const styles = useMemo(() => createTeamsStyles(currentColors), [currentColors]);

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    if (!currentUser || !currentUser.uid) {
      setError("Authentication required to fetch teams.");
      setTeams([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching teams for user ID:", currentUser.uid);
      const userTeams = await getTeamsForUser(currentUser.uid);
      console.log("Fetched teams:", JSON.stringify(userTeams, null, 2));
      setTeams(userTeams);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      setError("Failed to load teams. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch teams when the component mounts or currentUser changes
  useEffect(() => {
    // Initial fetch or fetch on user change
    if (currentUser?.uid) {
        fetchTeams();
    } else {
        // Clear teams or set error if user is not available
        setTeams([]);
        setError("Authentication required to fetch teams.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // fetchTeams is stable and doesn't need to be in deps

  // Re-fetch teams when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // This ensures fetchTeams is called when the screen is focused.
      // It's important to check for currentUser.uid to avoid fetching
      // if the user is not yet defined (e.g., during initial app load or after logout).
      if (currentUser?.uid) {
        console.log("Teams screen focused, fetching teams for user:", currentUser.uid);
        fetchTeams();
      }
      
      // Optional: Return a cleanup function if needed
      return () => {
        // console.log("Teams screen lost focus");
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]) // fetchTeams is stable and doesn't need to be in deps
  );

  // Suggested teams can remain hard-coded for now or be fetched if dynamic
  const suggestedTeams: SuggestedTeam[] = [
    {
      id: '1',
      description: 'Create a team for your bridesmaids to coordinate dress fitting',
      actionText: 'Create Bridesmaids Team',
    },
  ];

  const renderTeamItem = ({ item }: { item: Team }) => (
    <TeamListItem team={item} />
  );

  const renderSuggestedTeam = ({ item }: { item: SuggestedTeam }) => (
    <SuggestedTeamListItem suggestedTeam={item} />
  );


  return (
    <View style={styles.container}>
      {/* Create New Team Button - Updated onPress to navigate */}
      <TouchableOpacity
        style={styles.createTeamButton}
        onPress={() => router.push('/createNewTeam')} // Navigate on press
      >
        <Ionicons name="person-add-outline" size={22} color={currentColors.text} style={styles.createTeamIcon} />
        <Text style={styles.createTeamText}>Create New Team</Text>
      </TouchableOpacity>

      {/* Your Teams Label */}
      <Text style={styles.sectionLabel}>Your Teams</Text>

      {/* Teams List */}
      {isLoading && <BrandLoadingSpinner size="large" style={{ marginTop: 20 }} />}
      {!isLoading && error && <Text style={styles.errorText}>{error}</Text>}
      {!isLoading && !error && teams.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyListText}>No teams found. Create one to get started!</Text>
          <Text style={styles.debugInfoText}>User ID: {currentUser?.uid || 'N/A'}</Text>
          <Text style={styles.debugInfoText}>Teams array length: {teams.length}</Text>
          {error && <Text style={styles.errorText}>Error: {error}</Text>}
        </View>
      )}
      {!isLoading && !error && teams.length > 0 && (
        <FlatList
          data={teams}
          renderItem={renderTeamItem}
          keyExtractor={item => item.id || Math.random().toString()} // Fallback key
          style={styles.teamsList}
          contentContainerStyle={styles.teamsListContent}
        />
      )}

      {/* Suggested Teams - can remain as is or be made dynamic later */}
      <FlatList
        data={suggestedTeams}
        renderItem={renderSuggestedTeam}
        keyExtractor={item => item.id}
        style={styles.suggestedTeamsList}
        contentContainerStyle={styles.suggestedTeamsListContent}
      />

      {/* Removed Modal JSX */}
    </View>
  );
};

export default CommunicationPage;
