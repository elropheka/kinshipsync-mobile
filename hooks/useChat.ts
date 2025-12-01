import { useState, useCallback, useEffect } from 'react';
import * as chatService from '../services/chatService';
import { uploadFile } from '../services/storageService';
import {
  Conversation, ChatMessage,
  CreateDirectConversationPayload, CreateGroupConversationPayload,
  SendMessagePayload
} from '../types/chatTypes';
import { useAppAuth } from './useAppAuth';
import { useAuth } from '../context/AuthContext';

export const useConversations = () => {
  const { user: authUser } = useAppAuth();
  const { isAuthenticated } = useAuth();
  const currentUserId = authUser?.uid;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastConversation, setLastConversation] = useState<Conversation | undefined>(undefined);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);
  const conversationsLimit = 20;

  const fetchConversations = useCallback(async (isInitialFetch: boolean = false) => {
    if (!currentUserId || (!hasMoreConversations && !isInitialFetch)) return;

    setIsLoading(true);
    setError(null);
    try {
      const cursor = isInitialFetch ? undefined : lastConversation;
      const data = await chatService.getConversations(isAuthenticated, currentUserId, conversationsLimit, cursor);
      
      if (isInitialFetch) {
        setConversations(data);
      } else {
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
  }, [currentUserId, hasMoreConversations, lastConversation, conversationsLimit, isAuthenticated]);

  useEffect(() => {
    if (currentUserId) {
      setLastConversation(undefined);
      setHasMoreConversations(true);
      fetchConversations(true); 
    } else {
      setConversations([]); 
      setLastConversation(undefined);
      setHasMoreConversations(true);
    }
  }, [currentUserId, fetchConversations]); 

  const loadMoreConversations = () => {
    if (hasMoreConversations && !isLoading) {
      fetchConversations(false);
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
      const newConversation = await chatService.createDirectConversation(isAuthenticated, currentUserId, payload);
      setConversations(prev => [newConversation, ...prev.filter(c => c.id !== newConversation.id)]);
      return newConversation;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, isAuthenticated]);

  const createGroupChat = useCallback(async (payload: CreateGroupConversationPayload) => {
    if (!currentUserId) { setError(new Error("User not authenticated.")); return null; }
    setIsLoading(true);
    try {
      const newConversation = await chatService.createGroupConversation(isAuthenticated, currentUserId, payload);
      setConversations(prev => [newConversation, ...prev.filter(c => c.id !== newConversation.id)]);
      return newConversation;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, isAuthenticated]);
  
  const updateConversationInList = useCallback((updatedConv: Conversation) => {
    setConversations(prevConvs => {
      const existing = prevConvs.find(c => c.id === updatedConv.id);
      if (existing) {
        return [updatedConv, ...prevConvs.filter(c => c.id !== updatedConv.id)];
      }
      return [updatedConv, ...prevConvs];
    });
  }, []);


  return { conversations, isLoading, error, fetchConversations: refreshConversations, loadMoreConversations, createDirectChat, createGroupChat, updateConversationInList };
};


export const useChatMessages = (conversationId?: string) => {
  const { user: authUser } = useAppAuth();
  const { isAuthenticated } = useAuth();
  const currentUserId = authUser?.uid;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationDetails, setConversationDetails] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (conversationId && currentUserId) {
      setIsLoading(true);
      setMessages([]); 
      setConversationDetails(null);

      const unsubscribeConversationDetails = chatService.listenToConversationDetails(
        isAuthenticated,
        conversationId,
        currentUserId,
        (details) => {
          setConversationDetails(details);
          if (details !== undefined) setError(null); 
        },
        (err) => {
          console.error("Failed to listen to conversation details:", err);
          setError(err);
          setConversationDetails(null);
        }
      );

      const unsubscribeMessages = chatService.listenToMessages(
        isAuthenticated,
        conversationId,
        (newMessages) => {
          setMessages(newMessages);
          setIsLoading(false);
          if (newMessages.length > 0) {
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
  }, [conversationId, currentUserId, isAuthenticated]);

  interface PostMessageHookPayload {
    content: string;
    attachment?: {
      uri: string;
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
          content: payload.content,
          contentType: uploadResult.contentType as ChatMessage['contentType'],
          mediaUrl: uploadResult.mediaUrl,
          fileName: uploadResult.fileName,
          fileSize: uploadResult.fileSize,
        };
      } else {
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
      setIsUploadingFile(false);
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