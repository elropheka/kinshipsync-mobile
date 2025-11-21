import axiosInstance from './axiosInstance';
import {
  Conversation, ChatMessage, ParticipantInfo,
  CreateDirectConversationPayload, CreateGroupConversationPayload,
  SendMessagePayload, GetMessagesParams, MarkConversationAsReadPayload
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

  const senderDetails = await getSenderProfileDetails(senderId);

  const messagePayload = {
    conversationId: payload.conversationId,
    senderId,
    content: payload.content,
    contentType: payload.contentType || 'text',
    mediaUrl: payload.mediaUrl || null,
    fileName: payload.fileName || null,
    fileSize: payload.fileSize || null,
    ...(payload.contentType === 'eventInvitation' && {
      eventId: payload.eventId,
      guestId: payload.guestId,
      eventName: payload.eventName,
      rsvpStatus: payload.rsvpStatus || 'pending',
    }),
  };

  try {
    const response = await axiosInstance.post(`/conversations/${payload.conversationId}/messages`, messagePayload);
    
    if (response.data.success && response.data.data) {
      const message = response.data.data as ChatMessage;
      
      // Send notifications to other participants
      try {
        const convResponse = await axiosInstance.get(`/conversations/${payload.conversationId}`);
        if (convResponse.data.success && convResponse.data.data) {
          const conversation = convResponse.data.data as Conversation;
          conversation.participants.forEach(participant => {
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
      } catch (err) {
        console.error('Error fetching conversation for notifications:', err);
      }

      return message;
    }
    throw new Error("Failed to send message.");
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
  
  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollMessages = async () => {
    try {
      const messages = await getMessages(isAuthenticated, { conversationId, limit: limitCount });
      callback(messages);
    } catch (error) {
      console.error("Error polling messages:", error);
    }
  };

  // Initial fetch
  pollMessages();
  
  // Poll every 5 seconds for real-time feel
  pollingInterval = setInterval(pollMessages, 5000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
};

export const getMessages = async (
  isAuthenticated: boolean,
  params: GetMessagesParams
): Promise<ChatMessage[]> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!params.conversationId) throw new Error("Conversation ID is required.");

  try {
    const queryParams = new URLSearchParams({
      limit: (params.limit || 20).toString(),
      ...((params as any).cursor && { cursor: (params as any).cursor }),
    });
    const response = await axiosInstance.get(`/conversations/${params.conversationId}/messages?${queryParams.toString()}`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((msg: any) => ({
        id: msg.id,
        ...msg,
        timestamp: msg.timestamp || new Date().toISOString(),
      })) as ChatMessage[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getConversations = async (
  isAuthenticated: boolean,
  userId: string, 
  limitNum: number = 20, 
  lastFetchedConversation?: Conversation
): Promise<Conversation[]> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!userId) return [];

  try {
    const params = new URLSearchParams({
      limit: limitNum.toString(),
      ...(lastFetchedConversation?.updatedAt && { cursor: lastFetchedConversation.updatedAt }),
    });
    const response = await axiosInstance.get(`/conversations?${params.toString()}`);
    if (response.data.success && response.data.data) {
      return (response.data.data as any[]).map((conv: any) => ({
        id: conv.id,
        ...conv,
        createdAt: conv.createdAt || '',
        updatedAt: conv.updatedAt || '',
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content || conv.lastMessage.text,
          senderId: conv.lastMessage.senderId,
          timestamp: conv.lastMessage.timestamp || '',
        } : undefined,
      })) as Conversation[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const getConversationById = async (isAuthenticated: boolean, conversationId: string, currentUserId: string): Promise<Conversation | null> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !currentUserId) return null;

  try {
    const response = await axiosInstance.get(`/conversations/${conversationId}`);
    if (response.data.success && response.data.data) {
      const conv = response.data.data;
      // Check if user is a participant
      if (conv.participantIds && conv.participantIds.includes(currentUserId)) {
        return {
          id: conv.id,
          ...conv,
          createdAt: conv.createdAt || '',
          updatedAt: conv.updatedAt || '',
          lastMessage: conv.lastMessage ? {
            content: conv.lastMessage.content || conv.lastMessage.text,
            senderId: conv.lastMessage.senderId,
            timestamp: conv.lastMessage.timestamp || '',
          } : undefined,
        } as Conversation;
      }
      return null;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching conversation ${conversationId}:`, error);
    throw error;
  }
};

export const createDirectConversation = async (isAuthenticated: boolean, currentUserId: string, payload: CreateDirectConversationPayload): Promise<Conversation> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (currentUserId === payload.recipientId) throw new Error("Cannot create a direct conversation with oneself.");

  try {
    const currentUserDetails = await getSenderProfileDetails(currentUserId);
    const recipientUserDetails = await getSenderProfileDetails(payload.recipientId);
    const participants: ParticipantInfo[] = [
      { userId: currentUserId, displayName: currentUserDetails.displayName, avatarUrl: currentUserDetails.avatarUrl ?? null, role: 'member', lastReadTimestamp: new Date().toISOString() },
      { userId: payload.recipientId, displayName: recipientUserDetails.displayName, avatarUrl: recipientUserDetails.avatarUrl ?? null, role: 'member', lastReadTimestamp: new Date().toISOString() },
    ];
    
    const response = await axiosInstance.post('/conversations', {
      type: 'direct',
      participantIds: [currentUserId, payload.recipientId],
      participants,
      initialMessage: payload.initialMessage,
    });

    if (response.data.success && response.data.data) {
      const conv = response.data.data;
      return {
        id: conv.id,
        ...conv,
        createdAt: conv.createdAt || '',
        updatedAt: conv.updatedAt || '',
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content || conv.lastMessage.text,
          senderId: conv.lastMessage.senderId,
          timestamp: conv.lastMessage.timestamp || '',
        } : undefined,
      } as Conversation;
    }
    throw new Error("Failed to create conversation.");
  } catch (error: any) {
    // If conversation already exists, fetch it
    if (error.response?.status === 409) {
      const sortedUserIds = [currentUserId, payload.recipientId].sort();
      const conversationId = sortedUserIds.join('_');
      const existingConv = await getConversationById(isAuthenticated, conversationId, currentUserId);
      if (existingConv) return existingConv;
    }
    console.error("Error creating direct conversation:", error);
    throw error;
  }
};

export const createGroupConversation = async (isAuthenticated: boolean, currentUserId: string, payload: CreateGroupConversationPayload): Promise<Conversation> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");

  const uniqueParticipantUserIds = Array.from(new Set([currentUserId, ...payload.participantIds]));
  
  const participantPromises = uniqueParticipantUserIds.map(async (id) => {
    const details = await getSenderProfileDetails(id);
    return {
      userId: id,
      displayName: details.displayName,
      avatarUrl: details.avatarUrl ?? null,
      role: id === currentUserId ? 'admin' : 'member',
      lastReadTimestamp: new Date().toISOString(),
    } as ParticipantInfo;
  });
  const participants = await Promise.all(participantPromises);
  const participantIds = participants.map(p => p.userId);

  try {
    const response = await axiosInstance.post('/conversations', {
      type: 'group',
      name: payload.name,
      participantIds: participantIds,
      participants,
      creatorId: currentUserId,
      avatarUrl: payload.avatarUrl || null,
      initialMessage: payload.initialMessage,
    });

    if (response.data.success && response.data.data) {
      const conv = response.data.data;
      return {
        id: conv.id,
        ...conv,
        createdAt: conv.createdAt || '',
        updatedAt: conv.updatedAt || '',
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content || conv.lastMessage.text,
          senderId: conv.lastMessage.senderId,
          timestamp: conv.lastMessage.timestamp || '',
        } : undefined,
      } as Conversation;
    }
    throw new Error("Failed to create group conversation.");
  } catch (error) {
    console.error("Error creating group conversation:", error);
    throw error;
  }
};

export const markConversationAsRead = async (isAuthenticated: boolean, payload: MarkConversationAsReadPayload, userId: string): Promise<boolean> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!payload.conversationId || !userId) return false;

  try {
    await axiosInstance.patch(`/conversations/${payload.conversationId}/read`, {
      userId,
      lastReadTimestamp: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    return false;
  }
};

export const addReactionToMessage = async (isAuthenticated: boolean, conversationId: string, messageId: string, userId: string, emoji: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !messageId || !userId || !emoji) throw new Error("Required params missing for addReaction.");

  try {
    await axiosInstance.post(`/conversations/${conversationId}/messages/${messageId}/reactions`, {
      userId,
      emoji,
    });
  } catch (error) {
    console.error("Error adding reaction:", error);
    throw error;
  }
};

export const deleteMessage = async (isAuthenticated: boolean, conversationId: string, messageId: string, userId: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !messageId || !userId) throw new Error("Required params missing for deleteMessage.");

  try {
    await axiosInstance.delete(`/conversations/${conversationId}/messages/${messageId}`);
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized to delete.");
    }
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const editMessage = async (isAuthenticated: boolean, conversationId: string, messageId: string, userId: string, newContent: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !messageId || !userId || newContent === undefined) throw new Error("Required params missing for editMessage.");
  if (newContent.trim() === '') throw new Error("Message content cannot be empty.");

  try {
    await axiosInstance.put(`/conversations/${conversationId}/messages/${messageId}`, {
      content: newContent,
    });
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Unauthorized to edit.");
    }
    if (error.response?.status === 400) {
      throw new Error("Only text messages can be edited.");
    }
    console.error("Error editing message:", error);
    throw error;
  }
};

export const addParticipantToGroupConversation = async (isAuthenticated: boolean, conversationId: string, currentUserId: string, userIdToAdd: string): Promise<void> => {
  if (!isAuthenticated) throw new Error("User not authenticated.");
  if (!conversationId || !currentUserId || !userIdToAdd) throw new Error("Required params missing.");
  if (currentUserId === userIdToAdd) throw new Error("User already in conversation.");

  try {
    await axiosInstance.post(`/conversations/${conversationId}/participants`, {
      userId: userIdToAdd,
    });
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Conversation not found.");
    }
    if (error.response?.status === 403) {
      throw new Error("Current user not authorized.");
    }
    if (error.response?.status === 409) {
      return; // User already in conversation
    }
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

  try {
    await axiosInstance.delete(`/conversations/${conversationId}/participants/${userIdToRemove}`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Conversation not found.");
    }
    if (error.response?.status === 403) {
      throw new Error("User not authorized.");
    }
    if (error.response?.status === 400) {
      throw new Error("Cannot remove from direct conversation.");
    }
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

  let pollingInterval: NodeJS.Timeout | null = null;
  
  const pollConversation = async () => {
    try {
      const conversation = await getConversationById(isAuthenticated, conversationId, currentUserId);
      callback(conversation);
    } catch (error: any) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Initial fetch
  pollConversation();
  
  // Poll every 10 seconds
  pollingInterval = setInterval(pollConversation, 10000);

  return () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  };
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

  try {
    await axiosInstance.patch(`/conversations/${conversationId}/messages/${messageId}/rsvp`, {
      rsvpStatus: newRsvpStatus,
    });
    console.log(`Message ${messageId} RSVP status updated to ${newRsvpStatus}`);
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error("This message is not an event invitation.");
    }
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

  try {
    await axiosInstance.patch(`/conversations/${conversationId}/participants/${targetUserId}/role`, {
      newRole,
    });
    console.log(`Role of user ${targetUserId} in conversation ${conversationId} updated to ${newRole}.`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Conversation not found.");
    }
    if (error.response?.status === 403) {
      throw new Error("User not authorized to change roles in this group.");
    }
    if (error.response?.status === 400) {
      throw new Error("Roles can only be updated in group conversations.");
    }
    console.error("Error updating participant role:", error);
    throw error;
  }
};

// TODO: Add functions for updating participant roles in groups (if roles are implemented), etc.
