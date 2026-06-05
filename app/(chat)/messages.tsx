import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ColoredHeaderStatusBar } from '@/components/common/Navigation/ColoredHeaderStatusBar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMessagesStyles } from '../../styles/app/(chat)/messages.styles';
import { useConversations } from '../../hooks/useChat';
import { useAppTheme } from '../../context/AppThemeContext';
import { Conversation } from '../../types/chatTypes';
import { useAppAuth } from '../../hooks/useAppAuth';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { getUserProfileById } from '../../services/userService';
import { Avatar } from '../../components/common/Avatar';
import { useErrorAlert } from '@/hooks/useErrorAlert';
import { getErrorMessage } from '@/utils/errorUtils';
import { BrandSearchBar } from '@/components/ui/BrandSearchBar';
import { BrandCard } from '@/components/ui/BrandCard';
import { BrandEmptyState } from '@/components/ui/BrandEmptyState';

interface ConversationItemProps {
  item: Conversation;
  currentUserId?: string;
  onPress: (conversationId: string) => void;
  styles: any;
}

const ConversationItem: React.FC<ConversationItemProps> = React.memo(function ConversationItem({ item, currentUserId, onPress, styles }) {
  // Find other participant - use stable reference by finding by ID
  const otherParticipant = (item.participants ?? []).find(p => p.userId !== currentUserId);
  const otherUserId = otherParticipant?.userId;
  
  const [displayName, setDisplayName] = useState(otherParticipant?.displayName || 'Unknown User');
  const [avatarUrl, setAvatarUrl] = useState(otherParticipant?.avatarUrl);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  const [profileFetchError, setProfileFetchError] = useState<Error | null>(null);

  useErrorAlert(profileFetchError, { title: 'Could not load profile' });

  // Update from participant data when it changes
  useEffect(() => {
    if (otherParticipant?.displayName && otherParticipant.displayName !== 'Unknown User') {
      setDisplayName(otherParticipant.displayName);
    }
    if (otherParticipant?.avatarUrl) {
      setAvatarUrl(otherParticipant.avatarUrl);
    }
  }, [otherParticipant?.displayName, otherParticipant?.avatarUrl]);

  // Fetch profile only once if needed
  useEffect(() => {
    if (hasFetchedProfile || !otherUserId) return;
    
    if (!otherParticipant?.displayName || otherParticipant.displayName === 'Unknown User') {
      setHasFetchedProfile(true);
      getUserProfileById(otherUserId)
        .then(profile => {
          if (profile?.displayName) {
            setDisplayName(profile.displayName);
          }
          if (profile?.avatarUrl) {
            setAvatarUrl(profile.avatarUrl);
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile for item:", err);
          setProfileFetchError(err instanceof Error ? err : new Error(getErrorMessage(err)));
        });
    }
  }, [otherUserId, otherParticipant?.displayName, hasFetchedProfile]);

  const formatTimestamp = (timestamp?: string | number): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!otherParticipant) return null;

  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
    >
      <BrandCard style={styles.messageItem}>
        <Avatar
          name={displayName}
          avatarUrls={avatarUrl ? [avatarUrl] : []}
          size={50}
          style={styles.avatar}
        />
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.senderName}>{displayName}</Text>
            <Text style={styles.messageTime}>{formatTimestamp(item.lastMessageTimestamp)}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.senderId === currentUserId ? "You: " : ""}{item.lastMessage?.content || 'No messages yet'}
          </Text>
        </View>
        {item.unreadCount && item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </BrandCard>
    </TouchableOpacity>
  );
});

const ChatListScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createMessagesStyles(currentColors);

  const router = useRouter();
  const { user: currentUser } = useAppAuth();
  const { conversations, isLoading, error, fetchConversations } = useConversations();

  useErrorAlert(error);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredConversations = useMemo(() => conversations.filter(conv => {
    if (!searchQuery.trim()) {
      return true;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    if (conv.type === 'group') {
      const nameMatch = conv.name?.toLowerCase().includes(lowercasedQuery);
      const participantMatch = (conv.participants ?? []).some(
        p => p.displayName?.toLowerCase().includes(lowercasedQuery)
      );
      return nameMatch || participantMatch;
    } else {
      const otherParticipant = (conv.participants ?? []).find(p => p.userId !== currentUser?.uid);
      return otherParticipant?.displayName?.toLowerCase().includes(lowercasedQuery);
    }
  }), [conversations, searchQuery, currentUser?.uid]);

  const handleConversationPress = useCallback((conversationId: string) => {
    router.push({ pathname: '/(chat)/chatArea', params: { conversationId } });
  }, [router]);

  const renderConversationItem = useCallback(({ item }: { item: Conversation }) => {
    return (
      <ConversationItem
        item={item}
        currentUserId={currentUser?.uid}
        onPress={handleConversationPress}
        styles={styles}
      />
    );
  }, [currentUser?.uid, handleConversationPress, styles]);

  const handleNewChat = useCallback(() => {
    router.push('/(chat)/newChat');
  }, [router]);

  const ItemSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

  if (isLoading && conversations.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
     return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['left', 'right', 'bottom']}>
        <ColoredHeaderStatusBar backgroundColor={currentColors.secondary} contentStyle="light" />
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity onPress={fetchConversations} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ColoredHeaderStatusBar backgroundColor={currentColors.secondary} contentStyle="light" />
      <BrandSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search chats"
      />

      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        style={styles.messageList}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={
            <View style={styles.centered}>
              <BrandEmptyState
                title="No conversations yet"
                message="Start a chat to connect with your family and team."
                actionLabel="Start a new chat"
                onActionPress={handleNewChat}
                iconName="chatbubbles-outline"
              />
            </View>
        }
        refreshing={isLoading}
        onRefresh={fetchConversations}
        extraData={currentUser?.uid}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewChat}
      >
        <Ionicons name="add-sharp" size={30} color={currentColors.primaryContrastText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatListScreen;
