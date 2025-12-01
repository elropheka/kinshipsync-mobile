import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  Timestamp,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from '@firebase/firestore';
import { firestore } from './firebaseConfig';
import {
  Conversation, ChatMessage, ParticipantInfo, MessageReaction,
  CreateDirectConversationPayload, CreateGroupConversationPayload,
  SendMessagePayload, MarkConversationAsReadPayload
} from '../types/chatTypes';
import { UserProfile } from '../types/userTypes';
import { getUserProfileById } from '../services/userService';
import { sendNotification } from '../services/notificationService';
import { NewNotificationPayload } from '../types/notificationTypes';

const getSenderProfileDetails = async (userId: string): Promise<Pick<UserProfile, 'displayName' | 'avatarUrl'>> => {
  if (!userId) {
    console.warn('getSenderProfileDetails: userId was not provided.');
    return { displayName: 'Unknown User', avatarUrl: undefined };
  }
  try {
    const userProfile = await getUserProfileById(userId);
    if (userProfile && userProfile.displayName) {
      return { displayName: userProfile.displayName, avatarUrl: userProfile.avatarUrl || undefined };
    } else {
      console.warn(`getSenderProfileDetails: User profile or displayName not found for ${userId}, using defaults.`);
      return { displayName: 'Unknown User', avatarUrl: undefined };
    }
  } catch (error) {
    console.error(`Error fetching sender profile details for ${userId}:`, error);
    return { displayName: 'Unknown User', avatarUrl: undefined };
  }
};

export const sendMessage = async (isAuthenticated: boolean, payload: SendMessagePayload, senderId: string): Promise<ChatMessage> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!payload.conversationId) throw new Error("Conversation ID is required.");

  const conversationRef = doc(firestore, 'conversations', payload.conversationId);
  const messagesColRef = collection(conversationRef, 'messages');
  const senderDetails = await getSenderProfileDetails(senderId);

  const newMessageData = {
    conversationId: payload.conversationId,
    senderId,
    senderDisplayName: senderDetails.displayName,
    senderAvatarUrl: senderDetails.avatarUrl || null,
    content: payload.content,
    contentType: payload.contentType || 'text',
    mediaUrl: payload.mediaUrl || null,
    fileName: payload.fileName || null,
    fileSize: payload.fileSize || null,
    timestamp: serverTimestamp(),
    status: 'sent',
    reactions: [],
    ...(payload.contentType === 'eventInvitation' && {
      eventId: payload.eventId,
      guestId: payload.guestId,
      eventName: payload.eventName,
      rsvpStatus: payload.rsvpStatus || 'pending',
    }),
  };

  try {
    const messageDocRef = await addDoc(messagesColRef, newMessageData);
    await updateDoc(conversationRef, {
      lastMessage: {
        text: payload.content.substring(0, 100),
        timestamp: serverTimestamp(),
        senderId: senderId,
      },
      updatedAt: serverTimestamp(),
    });

    const conversationSnap = await getDoc(conversationRef);
    if (conversationSnap.exists()) {
      const conversationData = conversationSnap.data() as Conversation;
      conversationData.participants.forEach(participant => {
        if (participant.userId !== senderId) {
          const notificationPayload: NewNotificationPayload = {
            recipientId: participant.userId,
            type: 'new_message',
            title: `New message from ${senderDetails.displayName}`,
            body: payload.content.substring(0, 100),
            data: {
              screen: 'Chat',
              itemId: payload.conversationId,
            },
            senderId: senderId,
          };
          sendNotification(notificationPayload).catch(err => {
            console.error(`Failed to send notification to participant ${participant.userId}:`, err);
          });
        }
      });
    }

    return {
      id: messageDocRef.id,
      ...newMessageData,
      timestamp: new Date().toISOString(),
      mediaUrl: newMessageData.mediaUrl || undefined,
      fileName: newMessageData.fileName || undefined,
      fileSize: newMessageData.fileSize || undefined,
      reactions: newMessageData.reactions || [],
      eventId: newMessageData.eventId || undefined,
      guestId: newMessageData.guestId || undefined,
      eventName: newMessageData.eventName || undefined,
      rsvpStatus: newMessageData.rsvpStatus || (payload.contentType === 'eventInvitation' ? 'pending' : undefined),
    } as ChatMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const listenToMessages = (
  isAuthenticated: boolean,
  conversationId: string,
  callback: (messages: ChatMessage[]) => void,
  limitCount: number = 20
) => {
  if (!isAuthenticated) return () => console.warn("Attempted to listen while unauthenticated.");
  if (!conversationId) return () => console.error("Conversation ID required for listenToMessages.");
  
  const messagesColRef = collection(firestore, 'conversations', conversationId, 'messages');
  const q = query(messagesColRef, orderBy('timestamp', 'desc'), limit(limitCount));

  return onSnapshot(q, (querySnapshot) => {
    const messages: ChatMessage[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const timestamp = data.timestamp as Timestamp | null;
      messages.push({
        id: docSnap.id,
        ...data,
        timestamp: timestamp ? timestamp.toDate().toISOString() : new Date().toISOString(),
      } as ChatMessage);
    });
    callback(messages.reverse());
  }, (error) => console.error("Error listening to messages:", error));
};

export const getConversations = async (
  isAuthenticated: boolean,
  userId: string, 
  limitNum: number = 20, 
  lastFetchedConversation?: Conversation
): Promise<Conversation[]> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!userId) return [];

  const conversationsColRef = collection(firestore, 'conversations');
  let q;
  if (lastFetchedConversation?.updatedAt) {
    const lastTimestamp = Timestamp.fromDate(new Date(lastFetchedConversation.updatedAt));
    q = query(conversationsColRef, where('participantIds', 'array-contains', userId), orderBy('updatedAt', 'desc'), startAfter(lastTimestamp), limit(limitNum));
  } else {
    q = query(conversationsColRef, where('participantIds', 'array-contains', userId), orderBy('updatedAt', 'desc'), limit(limitNum));
  }
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || '',
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || '',
        lastMessage: data.lastMessage ? {
          content: data.lastMessage.text,
          senderId: data.lastMessage.senderId,
          timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || '',
        } : undefined,
      } as Conversation;
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const getConversationById = async (isAuthenticated: boolean, conversationId: string, currentUserId: string): Promise<Conversation | null> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !currentUserId) return null;

  try {
    const conversationRef = doc(firestore, 'conversations', conversationId);
    const docSnap = await getDoc(conversationRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if ((data.participantIds as string[]).includes(currentUserId)) {
        return {
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || '',
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || '',
          lastMessage: data.lastMessage ? {
            content: data.lastMessage.text,
            senderId: data.lastMessage.senderId,
            timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || '',
          } : undefined,
        } as Conversation;
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching conversation ${conversationId}:`, error);
    throw error;
  }
};

export const createDirectConversation = async (isAuthenticated: boolean, currentUserId: string, payload: CreateDirectConversationPayload): Promise<Conversation> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (currentUserId === payload.recipientId) throw new Error("Cannot create a direct conversation with oneself.");

  const sortedUserIds = [currentUserId, payload.recipientId].sort();
  const conversationId = sortedUserIds.join('_');
  const conversationRef = doc(firestore, 'conversations', conversationId);

  try {
    const docSnap = await getDoc(conversationRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || '',
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || '',
        lastMessage: data.lastMessage ? {
          content: data.lastMessage.text,
          senderId: data.lastMessage.senderId,
          timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || '',
        } : undefined,
       } as Conversation;
    }

    const currentUserDetails = await getSenderProfileDetails(currentUserId);
    const recipientUserDetails = await getSenderProfileDetails(payload.recipientId);
    const participants: ParticipantInfo[] = [
      { userId: currentUserId, displayName: currentUserDetails.displayName, avatarUrl: currentUserDetails.avatarUrl ?? null, role: 'member', lastReadTimestamp: new Date().toISOString() }, // Direct chats don't have admins, both are 'member'
      { userId: payload.recipientId, displayName: recipientUserDetails.displayName, avatarUrl: recipientUserDetails.avatarUrl ?? null, role: 'member', lastReadTimestamp: new Date().toISOString() },
    ];
    const newConversationData = {
      type: 'direct' as 'direct',
      participantIds: [currentUserId, payload.recipientId],
      participants,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    };
    await setDoc(conversationRef, newConversationData);

    if (payload.initialMessage) {
      await sendMessage(isAuthenticated, { conversationId, content: payload.initialMessage }, currentUserId);
    }
    const finalDocSnap = await getDoc(conversationRef);
    if (!finalDocSnap.exists()) throw new Error("Failed to retrieve conversation after creation.");
    const finalData = finalDocSnap.data();
    return { 
      id: finalDocSnap.id,
      ...finalData,
      createdAt: (finalData.createdAt as Timestamp)?.toDate().toISOString() || '',
      updatedAt: (finalData.updatedAt as Timestamp)?.toDate().toISOString() || '',
      lastMessage: finalData.lastMessage ? {
        content: finalData.lastMessage.text,
        senderId: finalData.lastMessage.senderId,
        timestamp: (finalData.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || '',
      } : null,
    } as Conversation;
  } catch (error) {
    console.error("Error creating direct conversation:", error);
    throw error;
  }
};

export const createGroupConversation = async (isAuthenticated: boolean, currentUserId: string, payload: CreateGroupConversationPayload): Promise<Conversation> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");

  const conversationsColRef = collection(firestore, 'conversations');
  const uniqueParticipantUserIds = Array.from(new Set([currentUserId, ...payload.participantIds]));
  
  const participantPromises = uniqueParticipantUserIds.map(async (id) => {
    const details = await getSenderProfileDetails(id);
    return {
      userId: id,
      displayName: details.displayName,
      avatarUrl: details.avatarUrl ?? null,
      role: id === currentUserId ? 'admin' : 'member', // Creator is admin, others are members
      lastReadTimestamp: new Date().toISOString(), // Initialize lastReadTimestamp
    } as ParticipantInfo;
  });
  const participants = await Promise.all(participantPromises);
  const participantIds = participants.map(p => p.userId); // Keep participantIds array for querying if needed

  const newConversationData = {
    type: 'group' as 'group',
    name: payload.name,
    participantIds: participantIds, // Corrected variable name
    participants,
    creatorId: currentUserId,
    avatarUrl: payload.avatarUrl || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
  };
  try {
    const docRef = await addDoc(conversationsColRef, newConversationData);
    if (payload.initialMessage) {
      await sendMessage(isAuthenticated, { conversationId: docRef.id, content: payload.initialMessage }, currentUserId);
    }
    const finalDocSnap = await getDoc(docRef);
    if (!finalDocSnap.exists()) throw new Error("Failed to retrieve group conversation after creation.");
    const finalData = finalDocSnap.data();
    return { 
      id: finalDocSnap.id,
      ...finalData,
      createdAt: (finalData.createdAt as Timestamp)?.toDate().toISOString() || '',
      updatedAt: (finalData.updatedAt as Timestamp)?.toDate().toISOString() || '',
      lastMessage: finalData.lastMessage ? {
        content: finalData.lastMessage.text,
        senderId: finalData.lastMessage.senderId,
        timestamp: (finalData.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || '',
      } : null,
    } as Conversation;
  } catch (error) {
    console.error("Error creating group conversation:", error);
    throw error;
  }
};

export const markConversationAsRead = async (isAuthenticated: boolean, payload: MarkConversationAsReadPayload, userId: string): Promise<boolean> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!payload.conversationId || !userId) return false;

  const conversationRef = doc(firestore, 'conversations', payload.conversationId);
  try {
    const docSnap = await getDoc(conversationRef);
    if (!docSnap.exists()) return false;
    const conversationData = docSnap.data() as Conversation;
    const participants = conversationData.participants.map(p => p.userId === userId ? { ...p, lastReadTimestamp: new Date().toISOString() } : p);
    await updateDoc(conversationRef, { participants });
    return true;
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return false;
  }
};

export const addReactionToMessage = async (isAuthenticated: boolean, conversationId: string, messageId: string, userId: string, emoji: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !messageId || !userId || !emoji) throw new Error("Required params missing for addReaction.");

  const messageRef = doc(firestore, 'conversations', conversationId, 'messages', messageId);
  try {
    const messageSnap = await getDoc(messageRef);
    if (!messageSnap.exists()) throw new Error("Message not found.");
    const messageData = messageSnap.data() as ChatMessage;
    const currentReactions = messageData.reactions || [];
    const existingReactionIndex = currentReactions.findIndex(r => r.userId === userId && r.emoji === emoji);
    if (existingReactionIndex > -1) return; 
    const newReaction: MessageReaction = { userId, emoji };
    await updateDoc(messageRef, { reactions: arrayUnion(newReaction) }); 
  } catch (error) {
    console.error("Error adding reaction:", error);
    throw error;
  }
};

export const deleteMessage = async (isAuthenticated: boolean, conversationId: string, messageId: string, userId: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !messageId || !userId) throw new Error("Required params missing for deleteMessage.");

  const messageRef = doc(firestore, 'conversations', conversationId, 'messages', messageId);
  try {
    const messageSnap = await getDoc(messageRef);
    if (!messageSnap.exists()) throw new Error("Message not found.");
    if ((messageSnap.data() as ChatMessage).senderId !== userId) throw new Error("Unauthorized to delete.");
    await deleteDoc(messageRef);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const editMessage = async (isAuthenticated: boolean, conversationId: string, messageId: string, userId: string, newContent: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !messageId || !userId || newContent === undefined) throw new Error("Required params missing for editMessage.");
  if (newContent.trim() === '') throw new Error("Message content cannot be empty.");

  const messageRef = doc(firestore, 'conversations', conversationId, 'messages', messageId);
  try {
    const messageSnap = await getDoc(messageRef);
    if (!messageSnap.exists()) throw new Error("Message not found.");
    const messageData = messageSnap.data() as ChatMessage;
    if (messageData.senderId !== userId) throw new Error("Unauthorized to edit.");
    if (messageData.contentType !== 'text') throw new Error("Only text messages can be edited.");
    await updateDoc(messageRef, { content: newContent, editedAt: serverTimestamp() });
  } catch (error) {
    console.error("Error editing message:", error);
    throw error;
  }
};

export const addParticipantToGroupConversation = async (isAuthenticated: boolean, conversationId: string, currentUserId: string, userIdToAdd: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !currentUserId || !userIdToAdd) throw new Error("Required params missing.");
  if (currentUserId === userIdToAdd) throw new Error("User already in conversation.");

  const conversationRef = doc(firestore, 'conversations', conversationId);
  try {
    const conversationSnap = await getDoc(conversationRef);
    if (!conversationSnap.exists()) throw new Error("Conversation not found.");
    const conversationData = conversationSnap.data() as Conversation;
    if (conversationData.type !== 'group') throw new Error("Cannot add to direct conversation.");
    if (!conversationData.participants.some(p => p.userId === currentUserId)) throw new Error("Current user not authorized.");
    if (conversationData.participants.some(p => p.userId === userIdToAdd)) return; 

    const userToAddProfile = await getSenderProfileDetails(userIdToAdd);
    const newParticipant: ParticipantInfo = {
      userId: userIdToAdd,
      displayName: userToAddProfile.displayName,
      avatarUrl: userToAddProfile.avatarUrl ?? null,
      role: 'member', // New participants are added as 'member' by default
      lastReadTimestamp: new Date().toISOString(),
    };
    await updateDoc(conversationRef, {
      participants: arrayUnion(newParticipant),
      participantIds: arrayUnion(userIdToAdd),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    throw error;
  }
};

export const removeParticipantFromGroupConversation = async (
  isAuthenticated: boolean,
  conversationId: string,
  currentUserId: string, 
  userIdToRemove: string
): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !currentUserId || !userIdToRemove) throw new Error("Required params missing.");

  const conversationRef = doc(firestore, 'conversations', conversationId);
  try {
    const conversationSnap = await getDoc(conversationRef);
    if (!conversationSnap.exists()) throw new Error("Conversation not found.");
    const conversationData = conversationSnap.data() as Conversation;
    if (conversationData.type !== 'group') throw new Error("Cannot remove from direct conversation.");
    
    const isCreator = conversationData.creatorId === currentUserId;
    const isSelfRemoval = currentUserId === userIdToRemove;
    if (!isCreator && !isSelfRemoval) throw new Error("User not authorized.");

    const participantToRemoveInfo = conversationData.participants.find(p => p.userId === userIdToRemove);
    if (!participantToRemoveInfo) return; 

    if (conversationData.participants.length === 1 && participantToRemoveInfo.userId === conversationData.participants[0].userId) {
        console.warn(`Removing last participant from group ${conversationId}.`);
    }
    
    await updateDoc(conversationRef, {
      participants: arrayRemove(participantToRemoveInfo), 
      participantIds: arrayRemove(userIdToRemove),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error removing participant:", error);
    throw error;
  }
};

export const listenToConversationDetails = (
  isAuthenticated: boolean,
  conversationId: string,
  currentUserId: string, 
  callback: (conversation: Conversation | null) => void,
  onError: (error: Error) => void
): (() => void) => { 
  if (!isAuthenticated) {
    onError(new Error("User not authenticated."));
    return () => {}; 
  }
  if (!conversationId || !currentUserId) {
    onError(new Error("Conversation ID and Current User ID are required to listen to details."));
    return () => {}; 
  }

  const conversationRef = doc(firestore, 'conversations', conversationId);

  return onSnapshot(conversationRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.participantIds && (data.participantIds as string[]).includes(currentUserId)) {
        const conversationData = {
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          lastMessage: data.lastMessage ? {
            content: data.lastMessage.text,
            senderId: data.lastMessage.senderId,
            timestamp: (data.lastMessage.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          } : undefined,
        } as Conversation;
        callback(conversationData);
      } else {
        console.warn(`User ${currentUserId} is not a participant of conversation ${conversationId}. Access denied for real-time details.`);
        callback(null); 
      }
    } else {
      console.log(`Conversation ${conversationId} not found for real-time listening.`);
      callback(null); 
    }
  }, (error) => {
    console.error(`Error listening to conversation details for ${conversationId}:`, error);
    onError(error);
  });
};

export const updateMessageRsvpStatus = async (
  isAuthenticated: boolean,
  conversationId: string,
  messageId: string,
  newRsvpStatus: 'accepted' | 'declined'
): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !messageId || !newRsvpStatus) {
    throw new Error("Required parameters missing for updating message RSVP status.");
  }

  const messageRef = doc(firestore, 'conversations', conversationId, 'messages', messageId);
  try {
    const messageSnap = await getDoc(messageRef);
    if (!messageSnap.exists()) throw new Error("Message not found.");
    
    const messageData = messageSnap.data() as ChatMessage;
    if (messageData.contentType !== 'eventInvitation') {
      throw new Error("This message is not an event invitation.");
    }

    await updateDoc(messageRef, { 
      rsvpStatus: newRsvpStatus,
      updatedAt: serverTimestamp()
    });
    console.log(`Message ${messageId} RSVP status updated to ${newRsvpStatus}`);
  } catch (error) {
    console.error("Error updating message RSVP status:", error);
    throw error;
  }
};

export const updateParticipantRole = async (
  isAuthenticated: boolean,
  conversationId: string,
  currentUserId: string, // User performing the action
  targetUserId: string,  // User whose role is being changed
  newRole: 'admin' | 'member'
): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !currentUserId || !targetUserId || !newRole) {
    throw new Error("Required parameters missing for updating participant role.");
  }

  const conversationRef = doc(firestore, 'conversations', conversationId);
  try {
    const conversationSnap = await getDoc(conversationRef);
    if (!conversationSnap.exists()) throw new Error("Conversation not found.");

    const conversationData = conversationSnap.data() as Conversation;
    if (conversationData.type !== 'group') throw new Error("Roles can only be updated in group conversations.");

    const currentUserParticipant = conversationData.participants.find(p => p.userId === currentUserId);
    if (!currentUserParticipant || currentUserParticipant.role !== 'admin') {
      throw new Error("User not authorized to change roles in this group.");
    }

    const updatedParticipants = conversationData.participants.map(p => {
      if (p.userId === targetUserId) {
        return { ...p, role: newRole };
      }
      return p;
    });

    await updateDoc(conversationRef, {
      participants: updatedParticipants,
      updatedAt: serverTimestamp(),
    });
    console.log(`Role of user ${targetUserId} in conversation ${conversationId} updated to ${newRole}.`);

  } catch (error) {
    console.error("Error updating participant role:", error);
    throw error;
  }
};
