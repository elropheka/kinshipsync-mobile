import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '../../../styles/components/common/Layout/teams.styles';
import { Team, TeamType } from '../../../types/teamTypes';
import { createGroupConversation } from '../../../services/chatService';
import { doc, updateDoc } from '@firebase/firestore';
import { firestore } from '../../../services/firebaseConfig';
import { AuthContext } from '../../../context/AuthContext';
import { BackendUser } from '../../../types/auth';

interface TeamListItemProps {
  team: Team;
}

const TeamListItem: React.FC<TeamListItemProps> = ({ team }) => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.user as (BackendUser & { uid: string }) | undefined;
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handleChatPress = async (e: any) => {
    e.stopPropagation(); // Prevent card press from firing

    if (!currentUser?.uid) {
      Alert.alert("Error", "You must be logged in to start a chat.");
      return;
    }

    if (team.conversationId) {
      router.push({ 
        pathname: '/(chat)/chatArea', 
        params: { 
          conversationId: team.conversationId,
          chatTitle: team.name || 'Team Chat' 
        } 
      });
    } else {
      setIsCreatingChat(true);
      try {
        // Ensure memberIds are defined and not empty, include current user if not already
        const participantIds = Array.from(new Set([...(team.memberIds || []), currentUser.uid]));
        if (participantIds.length < 1) { // Technically should be at least 1 (creator)
             Alert.alert("Error", "Cannot create chat without members.");
             setIsCreatingChat(false);
             return;
        }

        const conversationPayload = {
          name: team.name || 'Team Chat',
          participantIds: participantIds.filter(id => id !== currentUser.uid), // createGroupConversation expects other participants
          // avatarUrl: team.iconName or some other logic for group avatar
        };

        const newConversation = await createGroupConversation(!!currentUser, currentUser.uid, conversationPayload);

        if (newConversation && newConversation.id) {
          const teamDocRef = doc(firestore, 'teams', team.id);
          await updateDoc(teamDocRef, {
            conversationId: newConversation.id,
          });
          // To ensure the UI updates if the team object is not re-fetched immediately,
          // you might want to update the local team object or trigger a re-fetch.
          // For now, we navigate directly.
          router.push({ 
            pathname: '/(chat)/chatArea', 
            params: { 
              conversationId: newConversation.id,
              chatTitle: team.name || 'Team Chat'
            } 
          });
        } else {
          Alert.alert("Error", "Failed to create chat for the team.");
        }
      } catch (error) {
        console.error("Error creating team chat:", error);
        Alert.alert("Error", `Failed to create chat. ${error instanceof Error ? error.message : 'Please try again.'}`);
      } finally {
        setIsCreatingChat(false);
      }
    }
  };

  return (
    <TouchableOpacity onPress={() => router.push(`/(teams)/dashboard/${team.id}`)} style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <View style={styles.teamIconContainer}>
          <Ionicons name={team.iconName || 'help-circle-outline'} size={28} color="#555" />
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name || 'Unnamed Team'}</Text>
          <Text style={styles.teamMembers}>{`${team.memberIds?.length || 0} Members`}</Text>
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
          disabled={isCreatingChat}
        >
          {isCreatingChat ? (
            <ActivityIndicator size="small" color="#4050FF" />
          ) : (
            <Ionicons name="chatbubble-outline" size={20} color="#4050FF" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsLabel}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/(teams)/dashboard/${team.id}?initialTab=schedules`);
            }}
          >
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Files</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/(teams)/dashboard/${team.id}?initialTab=tasks`);
            }}
          >
            <Text style={styles.actionButtonText}>Tasks</Text>
          </TouchableOpacity>
          {team.type === TeamType.FAMILY && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/(teams)/familyTree/${team.id}`);
              }}
            >
              <Ionicons name="git-network-outline" size={16} color="#4050FF" style={{marginRight: 5}} />
              <Text style={styles.actionButtonText}>Family Tree</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TeamListItem;
