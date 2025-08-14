import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(chat)/newChat.styles'; // To be created
import { UserProfile } from '../../types/userTypes';
// import { Conversation } from '../../types/chatTypes'; // Conversation type not directly used in this file for now
import * as userService from '../../services/userService'; // For searching users
import { useConversations } from '../../hooks/useChat'; // To check existing and create new
import { useAppAuth } from '../../hooks/useAppAuth';
import { useAuth } from '../../context/AuthContext'; // Added to get isAuthenticated
import { Colors } from 'constants/Colors';

const NewChatScreen = () => {
  const router = useRouter();
  const { user: currentUser } = useAppAuth();
  const { isAuthenticated } = useAuth(); // Get isAuthenticated
  const { conversations, createDirectChat } = useConversations();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [initialUserList, setInitialUserList] = useState<UserProfile[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingInitialList, setIsLoadingInitialList] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  // Fetch initial list of users
  useEffect(() => {
    const fetchInitialUsers = async () => {
      if (!isAuthenticated || !currentUser?.uid) return; // Ensure user is authenticated and UID is available
      setIsLoadingInitialList(true);
      try {
        const users = await userService.getAllUsersForPicker(isAuthenticated, 20); // Pass limit
        setInitialUserList(users.filter(u => u.userId !== currentUser?.uid));
      } catch (error) {
        console.error("Error fetching initial users:", error);
        // Optionally, set an error state to display to the user
        setInitialUserList([]);
      } finally {
        setIsLoadingInitialList(false);
      }
    };

    fetchInitialUsers();
  }, [currentUser?.uid, isAuthenticated]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsLoadingSearch(true);
        setInitialUserList([]); // Clear initial list when searching
        try {
          const users = await userService.searchUsersByName(isAuthenticated, searchQuery.trim(), 10); // Corrected argument order
          setSearchResults(users.filter(u => u.userId !== currentUser?.uid));
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchResults([]);
        } finally {
          setIsLoadingSearch(false);
        }
      } else {
        setSearchResults([]);
        // Optionally, re-fetch or re-show initial list if search query is cleared
        // For now, clearing search results is enough, initial list will show if data source logic is correct
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, currentUser?.uid, isAuthenticated]);

  const handleSelectUser = async (selectedUser: UserProfile) => {
    if (!currentUser?.uid || !selectedUser.userId) return;
    setIsCreatingChat(true);

    // Check if a conversation already exists
    const existingConversation = conversations.find(conv => 
      conv.type === 'direct' && 
      conv.participants.length === 2 &&
      conv.participants.some(p => p.userId === selectedUser.userId) &&
      conv.participants.some(p => p.userId === currentUser.uid)
    );

    if (existingConversation) {
      router.push({ pathname: '/(chat)/chatArea', params: { conversationId: existingConversation.id } });
      setIsCreatingChat(false);
      return;
    }

    // If no existing conversation, create a new one
    try {
      // createDirectChat expects a CreateDirectConversationPayload
      const newConversation = await createDirectChat({ recipientId: selectedUser.userId });
      if (newConversation) {
        router.push({ pathname: '/(chat)/chatArea', params: { conversationId: newConversation.id } });
      } else {
        Alert.alert("Error", "Could not start a new chat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating direct conversation:", error);
      Alert.alert("Error", "Failed to create chat.");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleSelectUser(item)} disabled={isCreatingChat}>
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-outline" size={24} color={Colors.light.background} />
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {isCreatingChat && <ActivityIndicator size="small" color={Colors.light.primary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.accent} />
      <Stack.Screen options={{ title: "New Chat" }} />
      {/* Custom header View removed */}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for users..."
          placeholderTextColor={Colors.light.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      {isLoadingSearch && searchQuery.trim().length > 1 && <ActivityIndicator style={{marginTop: 20}} size="large" color={Colors.light.primary} />}
      {isLoadingInitialList && searchQuery.trim().length === 0 && <ActivityIndicator style={{marginTop: 20}} size="large" color={Colors.light.primary} />}
      
      <FlatList
        data={searchQuery.trim().length > 1 ? searchResults : initialUserList}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.userId}
        style={styles.list}
        ListEmptyComponent={
          () => {
            if (searchQuery.trim().length > 1) { // Search is active
              if (isLoadingSearch) return null; // Loading indicator handled above
              return (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>No users found matching "{searchQuery}".</Text>
                </View>
              );
            } else { // Initial list view
              if (isLoadingInitialList) return null; // Loading indicator handled above
              if (initialUserList.length === 0) {
                return (
                  <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>No users to display. Try searching.</Text>
                  </View>
                );
              }
            }
            return null;
          }
        }
      />
    </SafeAreaView>
  );
};

export default NewChatScreen;
