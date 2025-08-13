import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router'; // Added Stack import here
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../../styles/app/(events)/ideas/index.styles';
import { useAppAuth } from '../../../hooks/useAppAuth';
import { 
  Idea as IdeaType, 
  IdeaComment as IdeaCommentType,
  CreateIdeaPayload,
  CreateIdeaCommentPayload,
  Event as EventType,
} from '../../../types/eventTypes';
import { 
  listenToIdeas, 
  addIdeaToEvent, 
  voteForIdea,

  getEventById,
} from '../../../services/eventService';
import { Colors } from '../../../constants/Colors';
import { UserProfile } from '../../../types/userTypes';
import { getUserProfile } from '../../../services/userService'; // Import getUserProfile

// Helper to format date string
const formatDate = (isoString: string) => {
  if (!isoString) return 'Unknown date';
  return new Date(isoString).toLocaleDateString();
};
const formatTime = (isoString: string) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};


const EventIdeasScreen = () => {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const { user: currentUser } = useAppAuth();
  const isAuthenticated = !!currentUser; // Correctly derive isAuthenticated

  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [commentsByIdeaId, setCommentsByIdeaId] = useState<{ [ideaId: string]: IdeaCommentType[] }>({});
  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState<{ [ideaId: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  
  const [newIdeaText, setNewIdeaText] = useState('');
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<{ type: 'idea' | 'comment', id: string, ideaId: string } | null>(null);
  const [expandedComments, setExpandedComments] = useState<{ [ideaId: string]: boolean }>({});
  const [userDetailsCache, setUserDetailsCache] = useState<Record<string, Pick<UserProfile, 'displayName' | 'avatarUrl'>>>({});
  const [commentUnsubscribers, setCommentUnsubscribers] = useState<Record<string, () => void>>({});

  // Fetch Event Details
  useEffect(() => {
    if (eventId && isAuthenticated) {
      getEventById(isAuthenticated, eventId)
        .then(setEventDetails)
        .catch(err => console.error("Error fetching event details for ideas screen:", err));
    }
  }, [eventId, isAuthenticated]);

  // Fetch Ideas
  useEffect(() => {
    if (!eventId || !isAuthenticated) {
      setIsLoadingIdeas(false);
      setError(eventId ? "User not authenticated." : "Event ID is missing.");
      return;
    }
    setIsLoadingIdeas(true);
    const unsubscribe = listenToIdeas(isAuthenticated, eventId, async (fetchedIdeas) => {
      const sortedIdeas = fetchedIdeas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setIdeas(sortedIdeas);
      setIsLoadingIdeas(false);
      setError(null);

      // Fetch author details for ideas
      if (isAuthenticated) {
        const authorIds = [...new Set(sortedIdeas.map(idea => idea.createdBy))];
        const newCache = { ...userDetailsCache };
        let cacheUpdated = false;
        for (const authorId of authorIds) {
          if (!newCache[authorId]) {
            try {
              const profile = await getUserProfile(isAuthenticated, authorId);
              if (profile) {
                newCache[authorId] = { displayName: profile.displayName || 'Unknown', avatarUrl: profile.avatarUrl };
                cacheUpdated = true;
              }
            } catch (e) { console.error(`Failed to fetch profile for idea author ${authorId}`, e); }
          }
        }
        if (cacheUpdated) setUserDetailsCache(newCache);
      }
    });
    return () => unsubscribe();
  }, [eventId, isAuthenticated]); // userDetailsCache removed from deps to avoid loop, it's updated internally



  const getAuthorDisplayName = (userId: string): string => {
    return userDetailsCache[userId]?.displayName || userId.substring(0, 6) + "...";
  };

  const handlePostIdea = async () => {
    if (!newIdeaText.trim() || !eventId || !currentUser?.uid || !isAuthenticated) {
      Alert.alert('Error', 'Cannot post idea. Ensure you are logged in, an event is selected, and the idea text is not empty.');
      return;
    }
    const payload: CreateIdeaPayload = { 
      title: newIdeaText.trim(),
      description: newIdeaText.trim(),
      category: 'General'
    };
    try {
      await addIdeaToEvent(isAuthenticated, eventId, payload, currentUser.uid);
      setNewIdeaText('');
    } catch (e: any) {
      Alert.alert('Error', `Failed to post idea: ${e.message}`);
    }
  };

  const handleVote = async (ideaId: string, voteType: 'up' | 'down') => {
    if (!eventId || !isAuthenticated) return;
    const increment = voteType === 'up' ? 1 : -1; // Assuming voteForIdea handles decrement for downvotes
                                                // Or, if it only increments, we might need separate logic or service update.
                                                // For now, let's assume it increments 'votes' field.
                                                // The current service `voteForIdea` increments. A downvote needs to be handled.
                                                // This example will just call voteForIdea for an upvote.
    if (voteType === 'up') {
        try {
            await voteForIdea(isAuthenticated, eventId, ideaId, 1);
        } catch (e: any) {
            Alert.alert('Error', `Failed to vote: ${e.message}`);
        }
    } else { // voteType === 'down'
        try {
            // Assuming voteForIdea can handle decrementing if increment is -1
            // and that the service/backend prevents votes from going below a certain threshold (e.g., 0) if desired.
            await voteForIdea(isAuthenticated, eventId, ideaId, -1); 
        } catch (e: any) {
            Alert.alert('Error', `Failed to downvote: ${e.message}`);
        }
    }
  };

  const toggleComments = (ideaId: string) => {
    setExpandedComments(prev => ({ ...prev, [ideaId]: !prev[ideaId] }));
    setReplyingTo(null); 
  };
  



  const renderIdeaItem = ({ item }: { item: IdeaType }) => {
    const ideaAuthorName = getAuthorDisplayName(item.createdBy);

    return (
      <View style={styles.ideaItemContainer}>
        <Text style={styles.ideaAuthor}>
            {ideaAuthorName} - {formatDate(item.createdAt)}
        </Text>
        <Text style={styles.ideaTitle}>{item.title}</Text>
        {item.description && <Text style={styles.ideaText}>{item.description}</Text>}
        <View style={styles.ideaActions}>
          <TouchableOpacity style={styles.voteButton} onPress={() => handleVote(item.id, 'up')}>
            <Icon name="thumb-up-off-alt" size={20} color={Colors.light.primary} />
            <Text style={styles.voteCount}>{item.votes}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.voteButton} onPress={() => handleVote(item.id, 'down')}>
            <Icon name="thumb-down-off-alt" size={20} color={Colors.light.error} />
            <Text style={styles.voteCount}>{item.downvotes}</Text> 
          </TouchableOpacity> */}

        </View>


      </View>
    );
  };
  
  if (isLoadingIdeas && ideas.length === 0) {
    return <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}><ActivityIndicator size="large" /><Text>Loading ideas...</Text></SafeAreaView>;
  }

  if (error) {
    return <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}><Text style={{color: 'red'}}>Error: {error}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.dark.accent}/>
      <Stack.Screen options={{ title: `Ideas: ${eventDetails?.name || 'Event'}` }} /> {/* Update title dynamically if needed */}
      {/* Custom header View removed - this diff just corrects the import location */}

      <View style={styles.newIdeaContainer}>
        <TextInput
          style={styles.newIdeaInput}
          placeholder="Share an idea for the event..."
          value={newIdeaText}
          onChangeText={setNewIdeaText}
          multiline
        />
        <TouchableOpacity style={styles.postIdeaButton} onPress={handlePostIdea} disabled={!isAuthenticated}>
          <Text style={styles.postIdeaButtonText}>Post Idea</Text>
        </TouchableOpacity>
      </View>

      {ideas.length === 0 && !isLoadingIdeas ? (
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: Colors.light.textSecondary}}>No ideas posted yet. Be the first!</Text>
         </View>
      ) : (
        <FlatList
            data={ideas}
            renderItem={renderIdeaItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyListText}>No ideas posted yet. Be the first!</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default EventIdeasScreen;
