import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../styles/app/(events)/messages.styles';
import { useEventDetail } from '../../hooks/useEvents';
import { EventMessage } from '../../types/eventTypes';
import { useAppAuth } from '../../hooks/useAppAuth';
import { getUserProfile } from '../../services/userService';
import { Colors } from '../../constants/Colors';
import { useAlert } from '@/context/AlertContext';

interface SenderDetails {
  name: string;
}

const EventMessagesScreen = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { user: currentUser } = useAppAuth();
  const { showError } = useAlert();
  
  const { 
    event, 
    eventMessages, 
    sendEventMessage, 
    guests, 
    isLoading: isLoadingEventData, 
    error: eventError 
  } = useEventDetail(eventId);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList<EventMessage>>(null);
  const [senderDetailsCache, setSenderDetailsCache] = useState<Record<string, SenderDetails>>({});

  useEffect(() => {
    if (eventMessages.length) {
      flatListRef.current?.scrollToEnd({ animated: true });

      const fetchMissingSenderDetails = async () => {
        if (!currentUser?.uid || !guests) return; // Ensure guests is also available

        const currentCache = { ...senderDetailsCache };
        let newDetailsFetched = false;

        for (const message of eventMessages) {
          const senderId = message.sender;

          if (senderId === currentUser.uid) continue;
          if (currentCache[senderId]) continue;

          const guestSender = guests.find(g => g.id === senderId);
          if (guestSender && guestSender.name) {
            currentCache[senderId] = { name: guestSender.name };
            newDetailsFetched = true;
            continue;
          }
          
          try {
            const profile = await getUserProfile(!!currentUser, senderId);
            if (profile && profile.displayName) {
              currentCache[senderId] = { name: profile.displayName };
            } else {
              currentCache[senderId] = { name: 'Unknown User' };
            }
            newDetailsFetched = true;
          } catch (error) {
            console.error(`Failed to fetch profile for sender ${senderId}:`, error);
            if (!currentCache[senderId]) {
              currentCache[senderId] = { name: 'Unknown User' };
              newDetailsFetched = true;
            }
          }
        }

        if (newDetailsFetched) {
          setSenderDetailsCache(currentCache);
        }
      };

      fetchMissingSenderDetails();
    }
  }, [eventMessages, guests, currentUser, senderDetailsCache]);

  const getSenderName = (senderId: string): string => {
    if (currentUser && senderId === currentUser.uid) return "You";
    
    const guestSender = guests.find(g => g.id === senderId);
    if (guestSender && guestSender.name) return guestSender.name;

    if (senderDetailsCache[senderId] && senderDetailsCache[senderId].name) {
      return senderDetailsCache[senderId].name;
    }
    
    return senderId ? senderId.substring(0, 6) + "..." : "Unknown"; 
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser?.uid || !eventId) return;
    setIsSending(true);
    try {
      await sendEventMessage({ content: newMessage.trim(), type: 'update' }, currentUser.uid);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
      showError("Error", "Could not send message.");
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: EventMessage }) => {
    const isMyMessage = item.sender === currentUser?.uid;
    return (
      <View style={[
        styles.messageBubble, 
        isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,

      ]}>
        {!isMyMessage && <Text style={styles.senderNameText}>{getSenderName(item.sender)}</Text>}
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

      </View>
    );
  };

  if (isLoadingEventData && !event) { // Show loading only if event data isn't there yet
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.light.primary} /><Text>Loading messages...</Text></View>;
  }

  if (eventError) {
    return <View style={styles.centered}><Text style={styles.errorText}>Error: {eventError.message}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.accent} hidden={Platform.OS === 'android'}/>
      <Stack.Screen options={{ title: event ? `${event.name} - Messages` : 'Event Messages' }} />
      
      <FlatList
        ref={flatListRef}
        data={eventMessages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyMessagesText}>No messages yet for this event. Tap below to send one!</Text>}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} 
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={Colors.light.textSecondary}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={isSending || !newMessage.trim()}>
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EventMessagesScreen;
