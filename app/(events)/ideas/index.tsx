import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createIndexStyles } from '../../../styles/app/(events)/ideas/index.styles';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAppAuth } from '../../../hooks/useAppAuth';
import { useAlert } from '@/context/AlertContext';
import { 
  Idea as IdeaType, 
  CreateIdeaPayload,
  Event as EventType,
} from '../../../types/eventTypes';
import { 
  listenToIdeas, 
  addIdeaToEvent, 
  voteForIdea,

  getEventById,
} from '../../../services/eventService';
import { UserProfile } from '../../../types/userTypes';
import { getUserProfile } from '../../../services/userService';
import { useErrorAlert } from '@/hooks/useErrorAlert';
import { getErrorMessage } from '@/utils/errorUtils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { EventNavigation } from '@/utils/eventNavigation';

const formatDate = (isoString: string) => {
  if (!isoString) return 'Unknown date';
  return new Date(isoString).toLocaleDateString();
};


const EventIdeasScreen = () => {
  const { currentColors } = useAppTheme();
  const styles = createIndexStyles(currentColors);


  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = EventNavigation.resolveEventId(params.eventId);
  const { user: currentUser } = useAppAuth();
  const isAuthenticated = !!currentUser; // Correctly derive isAuthenticated
  const { showError } = useAlert();

  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [eventDetails, setEventDetails] = useState<EventType | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<Error | null>(null);

  useErrorAlert(metadataError, { title: 'Could not load event details' });
  
  const [newIdeaText, setNewIdeaText] = useState('');
  const [userDetailsCache, setUserDetailsCache] = useState<Record<string, Pick<UserProfile, 'displayName' | 'avatarUrl'>>>({});

  useEffect(() => {
    if (eventId && isAuthenticated) {
      getEventById(isAuthenticated, eventId)
        .then(setEventDetails)
        .catch(err => {
          console.error("Error fetching event details for ideas screen:", err);
          setMetadataError(err instanceof Error ? err : new Error(getErrorMessage(err)));
        });
    }
  }, [eventId, isAuthenticated]);

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
    }, (listenerError) => {
      setError(getErrorMessage(listenerError));
      setIsLoadingIdeas(false);
    });
    return () => unsubscribe();
  }, [eventId, isAuthenticated, userDetailsCache]);



  const getAuthorDisplayName = (userId: string): string => {
    return userDetailsCache[userId]?.displayName || userId.substring(0, 6) + "...";
  };

  const handlePostIdea = async () => {
    if (!newIdeaText.trim() || !eventId || !currentUser?.uid || !isAuthenticated) {
      showError('Error', 'Cannot post idea. Ensure you are logged in, an event is selected, and the idea text is not empty.');
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
      showError('Error', `Failed to post idea: ${e.message}`);
    }
  };

  const handleVote = async (ideaId: string, voteType: 'up' | 'down') => {
    if (!eventId || !isAuthenticated) return;
    if (voteType === 'up') {
        try {
            await voteForIdea(isAuthenticated, eventId, ideaId, 1);
        } catch (e: any) {
            showError('Error', `Failed to vote: ${e.message}`);
        }
    } else {
        try {
            await voteForIdea(isAuthenticated, eventId, ideaId, -1); 
        } catch (e: any) {
            showError('Error', `Failed to downvote: ${e.message}`);
        }
    }
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
            <Icon name="thumb-up-off-alt" size={20} color={currentColors.primary} />
            <Text style={styles.voteCount}>{item.votes}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.voteButton} onPress={() => handleVote(item.id, 'down')}>
            <Icon name="thumb-down-off-alt" size={20} color={currentColors.error} />
            <Text style={styles.voteCount}>{item.downvotes}</Text> 
          </TouchableOpacity> */}

        </View>


      </View>
    );
  };
  
  if (isLoadingIdeas && ideas.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]} edges={['left', 'right', 'bottom']}><Text style={{color: 'red'}}>Error: {error}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
            <Text style={{fontSize: 16, color: currentColors.textSecondary}}>No ideas posted yet. Be the first!</Text>
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
