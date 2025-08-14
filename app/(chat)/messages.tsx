import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, FlatList, StyleSheet, ActivityIndicator, Image, Alert, StatusBar } from 'react-native'; // Added Alert
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(chat)/messages.styles'; // Ensure this path is correct
import { useConversations } from '../../hooks/useChat';
import { Conversation, ParticipantInfo } from '../../types/chatTypes';
import { useAppAuth } from '../../hooks/useAppAuth';
import { Colors } from 'constants/Colors';
import { getUserProfileById } from '../../services/userService'; // Import userService function
import { UserProfile } from '../../types/userTypes'; // Import UserProfile for typing

// Define ConversationItemProps
interface ConversationItemProps {
  item: Conversation;
  currentUser: any; // Consider using a more specific type for currentUser if available from useAppAuth
  router: any; // Type from useRouter
  getOtherParticipant: (participants: ParticipantInfo[]) => ParticipantInfo | undefined;
  formatTimestamp: (timestamp?: string | number) => string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ item, currentUser, router, getOtherParticipant, formatTimestamp }) => {
  const initialOtherParticipant = getOtherParticipant(item.participants);
  
  const [displayName, setDisplayName] = useState(initialOtherParticipant?.displayName || 'Unknown User');
  const [avatarUrl, setAvatarUrl] = useState(initialOtherParticipant?.avatarUrl);

  useEffect(() => {
    const otherP = getOtherParticipant(item.participants);
    if (otherP && (otherP.displayName === 'Unknown User' || !otherP.displayName)) {
      if (otherP.userId) {
        getUserProfileById(otherP.userId)
          .then(profile => {
            if (profile && profile.displayName) {
              setDisplayName(profile.displayName);
            }
            if (profile && profile.avatarUrl) {
              setAvatarUrl(profile.avatarUrl);
            }
          })
          .catch(err => console.error("Failed to fetch profile for item:", err));
      }
    } else if (otherP) {
        setDisplayName(otherP.displayName || 'Unknown User');
        setAvatarUrl(otherP.avatarUrl);
    }
  }, [item.participants, getOtherParticipant]);

  if (!initialOtherParticipant) return null;

  return (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => router.push({ pathname: '/(chat)/chatArea', params: { conversationId: item.id } })}
    >
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-outline" size={24} color={Colors.light.background} />
        </View>
      )}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{displayName}</Text>
          <Text style={styles.messageTime}>{formatTimestamp(item.lastMessageTimestamp)}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage?.senderId === currentUser?.uid ? "You: " : ""}{item.lastMessage?.content || 'No messages yet'}
        </Text>
      </View>
      {item.unreadCount && item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const ChatListScreen = () => {
  const router = useRouter();
  const { user: currentUser } = useAppAuth();
  const { conversations, isLoading, error, fetchConversations } = useConversations(); // Assuming fetchConversations for refresh

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery.trim()) {
      return true; // Show all conversations if search query is empty
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    if (conv.type === 'group') {
      const nameMatch = conv.name?.toLowerCase().includes(lowercasedQuery);
      const participantMatch = conv.participants.some(
        p => p.displayName?.toLowerCase().includes(lowercasedQuery)
      );
      return nameMatch || participantMatch;
    } else { // direct chat
      const otherParticipant = conv.participants.find(p => p.userId !== currentUser?.uid);
      return otherParticipant?.displayName?.toLowerCase().includes(lowercasedQuery);
    }
  });

  const getOtherParticipant = (participants: ParticipantInfo[]): ParticipantInfo | undefined => {
    return participants.find(p => p.userId !== currentUser?.uid);
  };

  const formatTimestamp = (timestamp?: string | number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    // Simple time formatting, can be expanded (e.g., "Yesterday", "Mon")
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    return <ConversationItem item={item} currentUser={currentUser} router={router} getOtherParticipant={getOtherParticipant} formatTimestamp={formatTimestamp} />;
  };

  const handleNewChat = () => {
    router.push('/(chat)/newChat');
  };

  if (isLoading && conversations.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent} />
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text>Loading conversations...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
     return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent} />
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity onPress={fetchConversations} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent} />
      <Stack.Screen options={{ title: "Chats" }} />
      {/* Custom header View removed */}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.light.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats"
          placeholderTextColor={Colors.light.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        style={styles.messageList} // Reusing styles, might need specific conversationList styles
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
            <View style={styles.centered}>
                <Text style={styles.emptyListText}>No conversations yet.</Text>
                <TouchableOpacity onPress={handleNewChat} style={styles.emptyListButton}>
                    <Text style={styles.emptyListButtonText}>Start a new Chat</Text>
                </TouchableOpacity>
            </View>
        }
        refreshing={isLoading} // Show refresh indicator while loading
        onRefresh={fetchConversations} // Allow pull-to-refresh
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewChat}
      >
        <Ionicons name="add-sharp" size={30} color={Colors.light.primaryContrastText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatListScreen;
