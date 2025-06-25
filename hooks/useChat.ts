import { useState, useCallback, useEffect } from 'react'; // Removed useRef as it's not used in this snippet
import * as chatService from '../services/chatService';
import { uploadFile } from '../services/storageService';
import {
  Conversation, ChatMessage,
  CreateDirectConversationPayload, CreateGroupConversationPayload,
  SendMessagePayload, GetMessagesParams, MarkConversationAsReadPayload
  // ChatMessageContentType removed, will use ChatMessage['contentType']
} from '../types/chatTypes';
import { useAppAuth } from './useAppAuth'; // To get current user ID
import { useAuth } from '../context/AuthContext'; // Added for isAuthenticated

// Hook for managing a list of conversations for the current user
export const useConversations = () => {
  const { user: authUser } = useAppAuth();
  const { isAuthenticated } = useAuth(); // Added
  const currentUserId = authUser?.uid;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastConversation, setLastConversation] = useState<Conversation | undefined>(undefined);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const conversationsLimit = 20; // Number of conversations per page

  const fetchConversations = useCallback(async (isInitialFetch: boolean = false) => {
    if (!currentUserId || (!hasMoreConversations && !isInitialFetch)) return;

    setIsLoading(true);
    setError(null);
    try {
      // Pass the actual lastConversation object for cursor-based pagination
      const cursor = isInitialFetch ? undefined : lastConversation;
      const data = await chatService.getConversations(isAuthenticated, currentUserId, conversationsLimit, cursor); // Modified
      
      if (isInitialFetch) {
        setConversations(data);
      } else {
        // Filter out duplicates that might occur if items were updated while fetching next page
        setConversations(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          return [...prev, ...data.filter(c => !existingIds.has(c.id))];
        });
      }
      
      setHasMoreConversations(data.length === conversationsLimit);
      if (data.length > 0) {
        setLastConversation(data[data.length - 1]);
      }
    } catch (e) {
      setError(e as Error);
      console.error("Failed to fetch conversations:", e);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, hasMoreConversations, lastConversation, conversationsLimit]);

  useEffect(() => {
    if (currentUserId) {
      setLastConversation(undefined); // Reset cursor for new/initial fetch
      setHasMoreConversations(true); // Reset hasMore
      fetchConversations(true); 
    } else {
      setConversations([]); 
      setLastConversation(undefined);
      setHasMoreConversations(true);
    }
  // fetchConversations is a dependency, but it itself depends on lastConversation.
  // To avoid re-triggering an infinite loop on initial load or when currentUserId changes,
  // we only want this effect to run when currentUserId changes.
  // The fetchConversations itself will handle the cursor logic.
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [currentUserId]); 

  const loadMoreConversations = () => {
    if (hasMoreConversations && !isLoading) {
      fetchConversations(false); // Not an initial fetch
    }
  };
  
  const refreshConversations = () => {
    setLastConversation(undefined);
    setHasMoreConversations(true);
    fetchConversations(true);
  };

  const createDirectChat = useCallback(async (payload: CreateDirectConversationPayload) => {
    if (!currentUserId) { setError(new Error("User not authenticated.")); return null; }
    setIsLoading(true);
    try {
      const newConversation = await chatService.createDirectConversation(isAuthenticated, currentUserId, payload); // Modified
      // Add to list or refetch. For simplicity, prepend and assume it's the most recent.
      setConversations(prev => [newConversation, ...prev.filter(c => c.id !== newConversation.id)]);
      return newConversation;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  const createGroupChat = useCallback(async (payload: CreateGroupConversationPayload) => {
    if (!currentUserId) { setError(new Error("User not authenticated.")); return null; }
    setIsLoading(true);
    try {
      const newConversation = await chatService.createGroupConversation(isAuthenticated, currentUserId, payload); // Modified
      setConversations(prev => [newConversation, ...prev.filter(c => c.id !== newConversation.id)]);
      return newConversation;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);
  
  // Function to update a conversation in the list (e.g., after a new message)
  const updateConversationInList = useCallback((updatedConv: Conversation) => {
    setConversations(prevConvs => {
      const existing = prevConvs.find(c => c.id === updatedConv.id);
      if (existing) {
        // Move to top and update
        return [updatedConv, ...prevConvs.filter(c => c.id !== updatedConv.id)];
      }
      // If it's a new conversation not yet in the list (e.g. from a push notification)
      return [updatedConv, ...prevConvs];
    });
  }, []);


  return { conversations, isLoading, error, fetchConversations: refreshConversations, loadMoreConversations, createDirectChat, createGroupChat, updateConversationInList };
};


// Hook for managing messages within a single conversation
export const useChatMessages = (conversationId?: string) => {
  const { user: authUser } = useAppAuth();
  const { isAuthenticated } = useAuth(); // Added
  const currentUserId = authUser?.uid;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationDetails, setConversationDetails] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True initially until first messages load
  const [isSending, setIsSending] = useState(false); // General sending state
  const [isUploadingFile, setIsUploadingFile] = useState(false); // Specific for file uploads
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress 0-100
  const [error, setError] = useState<Error | null>(null);
  // hasMoreMessages and loadMoreMessages would need to be re-implemented if pagination for listenToMessages is added
  // For now, listenToMessages loads a fixed limit of recent messages.

  useEffect(() => {
    if (conversationId && currentUserId) {
      setIsLoading(true);
      setMessages([]); 
      setConversationDetails(null); // Clear previous details

      // Listen to conversation details in real-time
      const unsubscribeConversationDetails = chatService.listenToConversationDetails(
        isAuthenticated,
        conversationId,
        currentUserId,
        (details) => {
          setConversationDetails(details);
          // Set error to null if details are successfully fetched or if conversation is not found (details will be null)
          if (details !== undefined) setError(null); 
        },
        (err) => {
          console.error("Failed to listen to conversation details:", err);
          setError(err);
          setConversationDetails(null); // Clear details on error
        }
      );

      // Listen to messages in real-time
      const unsubscribeMessages = chatService.listenToMessages(
        isAuthenticated,
        conversationId,
        (newMessages) => {
          setMessages(newMessages);
          setIsLoading(false); 
          if (newMessages.length > 0) { // Only mark as read if there are messages and conversation is active
            chatService.markConversationAsRead(isAuthenticated, { conversationId }, currentUserId);
          }
        },
        30 
      );

      return () => {
        unsubscribeConversationDetails();
        unsubscribeMessages();
      };
    } else {
      setMessages([]);
      setConversationDetails(null);
      setIsLoading(false);
    }
  }, [conversationId, currentUserId, isAuthenticated]); // Added isAuthenticated to dependency array

  // Define a more specific payload for the postMessage function in the hook
  interface PostMessageHookPayload {
    content: string; // For text messages or caption for attachments
    attachment?: {
      uri: string; // Local URI of the file to attach
    };
  }

  const postMessage = useCallback(async (payload: PostMessageHookPayload) => {
    if (!conversationId || !currentUserId) {
      const err = new Error("Conversation ID or User ID not set. Cannot send message.");
      setError(err);
      console.error(err.message);
      throw err;
    }
    if (!isAuthenticated) {
      const err = new Error("User not authenticated. Cannot send message.");
      setError(err);
      console.error(err.message);
      throw err;
    }

    setIsSending(true);
    setError(null);
    setUploadProgress(0);

    try {
      let messageToSend: SendMessagePayload;

      if (payload.attachment && payload.attachment.uri) {
        setIsUploadingFile(true);
        const uploadResult = await uploadFile(
          payload.attachment.uri,
          conversationId,
          currentUserId,
          (progress) => setUploadProgress(progress)
        );
        setIsUploadingFile(false);

        messageToSend = {
          conversationId: conversationId,
          content: payload.content, // Caption for the attachment
          contentType: uploadResult.contentType as ChatMessage['contentType'], // Use ChatMessage['contentType']
          mediaUrl: uploadResult.mediaUrl,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
        };
      } else {
        // Regular text message
        if (!payload.content.trim()) {
          throw new Error("Cannot send an empty message.");
        }
        messageToSend = {
          conversationId: conversationId,
          content: payload.content,
          contentType: 'text',
        };
      }

      const sentMessage = await chatService.sendMessage(isAuthenticated, messageToSend, currentUserId);
      
      // Optimistic update for conversationDetails (last message)
      if (conversationDetails) {
        setConversationDetails(prev => prev ? ({
            ...prev,
            lastMessage: { 
              content: sentMessage.contentType === 'text' 
                         ? sentMessage.content.substring(0, 100) 
                         : `Attachment: ${sentMessage.fileName || sentMessage.contentType}`,
              timestamp: new Date().toISOString(), 
              senderId: sentMessage.senderId 
            },
            updatedAt: new Date().toISOString(),
        }) : null);
      }
      return sentMessage;

    } catch (e) {
      setError(e as Error);
      console.error("Failed to send message or upload file:", e);
      setIsUploadingFile(false); // Ensure this is reset on error
      throw e;
    } finally {
      setIsSending(false);
    }
  }, [conversationId, currentUserId, isAuthenticated, conversationDetails]);

  return {
    messages,
    conversationDetails,
    isLoadingMessages: isLoading,
    isSendingMessage: isSending,
    isUploadingFile,
    uploadProgress,
    error,
    postMessage,
  };
};
