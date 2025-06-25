import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert, ActionSheetIOS, StatusBar } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useAppAuth } from '../../hooks/useAppAuth';
import { getConversationById, updateParticipantRole, removeParticipantFromGroupConversation } from '../../services/chatService'; // Added removeParticipantFromGroupConversation
import { Conversation, ParticipantInfo, ChatRole } from '../../types/chatTypes';
import { Ionicons } from '@expo/vector-icons'; // For icons

const ConversationSettingsScreen = () => {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { user: currentUser, token } = useAppAuth();
  const isAuthenticated = !!currentUser && !!token;
  // const router = useRouter(); // Not used

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId && currentUser?.uid && isAuthenticated) {
      setIsLoading(true);
      getConversationById(isAuthenticated, conversationId, currentUser.uid)
        .then(data => {
          setConversation(data);
          if (!data) setError("Conversation not found or access denied.");
        })
        .catch(err => {
          console.error("Error fetching conversation details:", err);
          setError(err.message || "Failed to fetch conversation details.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setError("Conversation ID or user details missing.");
      setIsLoading(false);
    }
  }, [conversationId, currentUser, isAuthenticated]);

  const handleUpdateRole = async (targetUserId: string, newRole: ChatRole) => {
    if (!conversationId || !currentUser?.uid || !isAuthenticated) {
      Alert.alert("Error", "Cannot update role: Missing critical information.");
      return;
    }
    if (conversation?.type !== 'group') {
      Alert.alert("Info", "Roles are only applicable to group chats.");
      return;
    }

    // Prevent demoting the last admin
    const admins = conversation?.participants.filter(p => p.role === 'admin');
    if (admins?.length === 1 && admins[0].userId === targetUserId && newRole === 'member') {
      Alert.alert("Action Denied", "Cannot remove the last admin. Assign another admin first.");
      return;
    }
    if (currentUser.uid === targetUserId && newRole === 'member' && admins?.length === 1 && admins[0].userId === currentUser.uid) {
        Alert.alert("Action Denied", "You cannot demote yourself as the last admin.");
        return;
    }


    try {
      await updateParticipantRole(isAuthenticated, conversationId, currentUser.uid, targetUserId, newRole);
      // Optimistically update local state or refetch
      setConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.map(p => 
            p.userId === targetUserId ? { ...p, role: newRole } : p
          ),
        };
      });
      Alert.alert("Success", "Participant role updated.");
    } catch (e: any) {
      console.error("Error updating role:", e);
      Alert.alert("Error", `Failed to update role: ${e.message}`);
    }
  };

  const handleRemoveParticipant = async (targetUserId: string, targetUserName?: string) => {
    if (!conversationId || !currentUser?.uid || !isAuthenticated) {
      Alert.alert("Error", "Cannot remove participant: Missing critical information.");
      return;
    }
    if (conversation?.type !== 'group') {
      Alert.alert("Info", "Participants can only be removed from group chats.");
      return;
    }
    if (targetUserId === currentUser?.uid) {
      Alert.alert("Info", "To leave the group, use the 'Leave Group' option (if available)."); // Or implement leave group
      return;
    }
     // Prevent removing the last admin if the target is an admin
    const targetParticipant = conversation?.participants.find(p => p.userId === targetUserId);
    if (targetParticipant?.role === 'admin') {
        const admins = conversation?.participants.filter(p => p.role === 'admin');
        if (admins?.length === 1) {
            Alert.alert("Action Denied", "Cannot remove the last admin. Assign another admin first or demote them.");
            return;
        }
    }


    Alert.alert(
      "Confirm Removal",
      `Are you sure you want to remove ${targetUserName || 'this participant'} from the group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeParticipantFromGroupConversation(isAuthenticated, conversationId, currentUser.uid, targetUserId);
              setConversation(prev => {
                if (!prev) return null;
                return {
                  ...prev,
                  participants: prev.participants.filter(p => p.userId !== targetUserId),
                };
              });
              Alert.alert("Success", `${targetUserName || 'Participant'} removed successfully.`);
            } catch (e: any) {
              console.error("Error removing participant:", e);
              Alert.alert("Error", `Failed to remove participant: ${e.message}`);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundPrimary} />
        <Stack.Screen options={{ title: 'Loading Settings...' }} />
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !conversation) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundPrimary} />
        <Stack.Screen options={{ title: 'Error' }} />
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: Colors.light.error }}>{error || "Could not load conversation details."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentUserRole = conversation?.participants.find(p => p.userId === currentUser?.uid)?.role;
  const isCurrentUserAdmin = currentUserRole === 'admin';

  const showRoleManagementOptions = (participant: ParticipantInfo) => {
    if (!isCurrentUserAdmin || participant.userId === currentUser?.uid) {
      // Only admins can manage roles, and they can't change their own role this way
      // (to prevent last admin demoting themselves without assigning new admin)
      return;
    }

    const options = ['Cancel'];
    const destructiveButtonIndex = [];

    if (participant.role === 'member') {
      options.unshift('Make Admin');
    } else {
      options.unshift('Make Member');
    }
    // Add "Remove Participant" as the first option (potentially destructive)
    options.unshift('Remove Participant');
    destructiveButtonIndex.push(0);


    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options as string[], // Cast to string array
        destructiveButtonIndex: destructiveButtonIndex, 
        cancelButtonIndex: options.indexOf('Cancel'),
      },
      (buttonIndex) => {
        const selectedOption = options[buttonIndex];
        if (selectedOption === 'Make Admin') {
          handleUpdateRole(participant.userId, 'admin');
        } else if (selectedOption === 'Make Member') {
          handleUpdateRole(participant.userId, 'member');
        } else if (selectedOption === 'Remove Participant') {
          handleRemoveParticipant(participant.userId, participant.displayName);
        }
      }
    );
  };

  const renderParticipant = ({ item }: { item: ParticipantInfo }) => (
    <TouchableOpacity 
      style={styles.participantItem}
      onPress={() => isCurrentUserAdmin && item.userId !== currentUser?.uid && showRoleManagementOptions(item)}
      disabled={!isCurrentUserAdmin || item.userId === currentUser?.uid}
    >
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="person-outline" size={24} color={Colors.light.background} />
        </View>
      )}
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{item.displayName}</Text>
        <Text style={styles.participantRole}>{item.role}</Text>
      </View>
      {isCurrentUserAdmin && item.userId !== currentUser?.uid && (
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.light.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.backgroundPrimary} />
      <Stack.Screen options={{ title: conversation.name || 'Chat Settings' }} />
      <View style={styles.content}>
        <Text style={styles.title}>{conversation.name || 'Group Chat'} Settings</Text>
        <Text style={styles.sectionTitle}>Participants ({conversation.participants.length})</Text>
        <FlatList
          data={conversation.participants}
          renderItem={renderParticipant}
          keyExtractor={item => item.userId}
        />
        {/* More settings UI will go here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholder: {
    marginTop: 20,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Colors.light.text,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.light.divider,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  participantRole: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textTransform: 'capitalize',
  },
  manageRoleButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    // Add more styling if needed, e.g., for a button appearance
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: Colors.light.error,
    textAlign: 'center',
  }
});

export default ConversationSettingsScreen;
