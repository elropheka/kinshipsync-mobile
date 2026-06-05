import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNewChatStyles } from '../../styles/app/(chat)/newChat.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { UserProfile } from '../../types/userTypes';
import * as userService from '../../services/userService';
import { useConversations } from '../../hooks/useChat'; // To check existing and create new
import { useAppAuth } from '../../hooks/useAppAuth';
import { useAuth } from '../../context/AuthContext'; // Added to get isAuthenticated
import { useAlert } from '@/context/AlertContext';
import { BrandSearchBar } from '@/components/ui/BrandSearchBar';
import { BrandEmptyState } from '@/components/ui/BrandEmptyState';

const NewChatScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createNewChatStyles(currentColors);


  const router = useRouter();
  const { user: currentUser } = useAppAuth();
  const { isAuthenticated } = useAuth();
  const { conversations, createDirectChat } = useConversations();
  const { showError } = useAlert();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [initialUserList, setInitialUserList] = useState<UserProfile[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingInitialList, setIsLoadingInitialList] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    const fetchInitialUsers = async () => {
      if (!isAuthenticated || !currentUser?.uid) return;
      setIsLoadingInitialList(true);
      try {
        const users = await userService.getAllUsersForPicker(isAuthenticated, 20);
        setInitialUserList(users.filter(u => u.userId !== currentUser?.uid));
      } catch (error) {
        console.error("Error fetching initial users:", error);
        setInitialUserList([]);
      } finally {
        setIsLoadingInitialList(false);
      }
    };

    fetchInitialUsers();
  }, [currentUser?.uid, isAuthenticated]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsLoadingSearch(true);
        setInitialUserList([]);
        try {
          const users = await userService.searchUsersByName(isAuthenticated, searchQuery.trim(), 10);
          setSearchResults(users.filter(u => u.userId !== currentUser?.uid));
        } catch (error) {
          console.error("Error searching users:", error);
          setSearchResults([]);
        } finally {
          setIsLoadingSearch(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, currentUser?.uid, isAuthenticated]);

  const handleSelectUser = async (selectedUser: UserProfile) => {
    if (!currentUser?.uid || !selectedUser.userId) return;
    setIsCreatingChat(true);

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

    try {
      const newConversation = await createDirectChat({ recipientId: selectedUser.userId });
      if (newConversation) {
        router.push({ pathname: '/(chat)/chatArea', params: { conversationId: newConversation.id } });
      } else {
        showError("Error", "Could not start a new chat. Please try again.");
      }
    } catch (error) {
      console.error("Error creating direct conversation:", error);
      showError("Error", "Failed to create chat.");
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
          <Ionicons name="person-outline" size={24} color={currentColors.background} />
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {isCreatingChat && <ActivityIndicator size="small" color={currentColors.primary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={currentColors.backgroundSecondary} />
      <Stack.Screen options={{ title: "New Chat" }} />
      {/* Custom header View removed */}

      <BrandSearchBar
        containerStyle={styles.searchContainer}
        style={styles.searchInput}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
      />

      {isLoadingSearch && searchQuery.trim().length > 1 && <ActivityIndicator style={{marginTop: 20}} size="large" color={currentColors.primary} />}
      {isLoadingInitialList && searchQuery.trim().length === 0 && <ActivityIndicator style={{marginTop: 20}} size="large" color={currentColors.primary} />}
      
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
                <BrandEmptyState
                  style={styles.emptyListContainer}
                  iconName="search-outline"
                  title="No users found"
                  message={`No users found matching "${searchQuery}".`}
                />
              );
            } else { // Initial list view
              if (isLoadingInitialList) return null; // Loading indicator handled above
              if (initialUserList.length === 0) {
                return (
                  <BrandEmptyState
                    style={styles.emptyListContainer}
                    iconName="people-outline"
                    title="No users to display"
                    message="Try searching to start a new chat."
                  />
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
