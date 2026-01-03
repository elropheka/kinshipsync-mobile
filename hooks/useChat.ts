import { useState, useCallback, useEffect, useRef } from 'react';
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

  // Use ref to track isAuthenticated without triggering effect re-runs
  const isAuthenticatedRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Real-time listener for conversations
  useEffect(() => {
    if (!currentUserId || !isAuthenticatedRef.current) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const unsubscribe = chatService.listenToConversations(
      true,
      currentUserId,
      (updatedConversations) => {
        setConversations(updatedConversations);
        setIsLoading(false);
        setError(null);
      },
      50 // Increased limit for real-time list
    );

    return () => {
      unsubscribe();
    };
  }, [currentUserId]);

  // Manual refresh function (for pull-to-refresh)
  const refreshConversations = useCallback(async () => {
    if (!currentUserId || !isAuthenticatedRef.current) return;
    
    setIsLoading(true);
    try {
      // Fetch fresh data from Firestore
      const freshData = await chatService.getConversations(true, currentUserId, 50);
      setConversations(freshData);
      setError(null);
    } catch (e) {
      setError(e as Error);
      console.error("Failed to refresh conversations:", e);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  const loadMoreConversations = useCallback(() => {
    // With real-time listener, we show all recent conversations
  }, []);

  const createDirectChat = useCallback(async (payload: CreateDirectConversationPayload) => {
    if (!currentUserId || !isAuthenticatedRef.current) { setError(new Error("User not authenticated.")); return null; }
    setIsLoading(true);
    try {
      const newConversation = await chatService.createDirectConversation(true, currentUserId, payload);
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
    if (!currentUserId || !isAuthenticatedRef.current) { setError(new Error("User not authenticated.")); return null; }
    setIsLoading(true);
    try {
      const newConversation = await chatService.createGroupConversation(true, currentUserId, payload);
      setConversations(prev => [newConversation, ...prev.filter(c => c.id !== newConversation.id)]);
      return newConversation;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);
  
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

  // Use ref to track isAuthenticated without triggering effect re-runs
  const isAuthenticatedRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationDetails, setConversationDetails] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only set up listeners if we have valid IDs and user is authenticated
    // Using ref to check auth status without re-subscribing on auth micro-changes
    if (conversationId && currentUserId && isAuthenticatedRef.current) {
      setIsLoading(true);

      const unsubscribeConversationDetails = chatService.listenToConversationDetails(
        true,
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
        true,
        conversationId,
        (newMessages) => {
          setMessages(newMessages);
          setIsLoading(false);
          if (newMessages.length > 0) {
            chatService.markConversationAsRead(true, { conversationId }, currentUserId);
          }
        },
        30
      );

      return () => {
        unsubscribeConversationDetails();
        unsubscribeMessages();
      };
    } else if (!conversationId || !currentUserId) {
      setMessages([]);
      setConversationDetails(null);
      setIsLoading(false);
    }
  }, [conversationId, currentUserId]);

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