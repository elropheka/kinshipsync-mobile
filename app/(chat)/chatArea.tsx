import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Linking, // Added for opening file links
  ScrollView, // Added for Emoji Picker
  Modal, // Added for Dropdown Menu
  Pressable, // Added for closing menu on outside tap
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Added
import * as DocumentPicker from 'expo-document-picker'; // Added
import * as FileSystem from 'expo-file-system'; // Added
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { createChatAreaStyles } from '../../styles/app/(chat)/chatArea.styles';
import { useAppTheme } from '@/context/AppThemeContext'; // Ensure this path is correct
import { useChatMessages } from '../../hooks/useChat';
import { Spacing } from '../../constants/dimensions'; // Added Spacing
import { ChatMessage, ParticipantInfo } from '../../types/chatTypes';
import { GuestStatus } from '../../types/eventTypes';
import { useAppAuth } from '../../hooks/useAppAuth';
import { Colors } from '../../constants/Colors'; // Corrected path
import ColoredHeaderStatusBar from '@/components/common/Navigation/ColoredHeaderStatusBar';
import { HeaderButtonItems } from '@/components/common/Navigation/HeaderButtonItems';
import { emojiCategories } from '../../constants/emojis'; // Added for emoji picker
import { getUserProfileById } from '../../services/userService'; // Import userService function
import { updateGuestRsvp } from '../../services/eventService'; // Added for RSVP actions
import { updateMessageRsvpStatus } from '../../services/chatService'; // Added for updating message state
import { useAlert } from '@/context/AlertContext';
import { Avatar } from '../../components/common/Avatar';
import { useErrorAlert } from '@/hooks/useErrorAlert';
import { getErrorMessage } from '@/utils/errorUtils';

interface MessageBubbleProps {
  message: ChatMessage;
  isUser: boolean;
  senderName?: string;
  senderAvatarUrl?: string;
  senderId?: string; // Added senderId
  currentUserId?: string; // For RSVP actions
  isAuthenticated: boolean; // For service calls
  styles: any; // Theme-aware styles
  currentColors: any; // Theme colors
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, senderName: initialSenderName, senderAvatarUrl: initialSenderAvatarUrl, senderId, currentUserId, isAuthenticated, styles, currentColors }) => {
  const { showSuccess, showError } = useAlert();
  const [displayName, setDisplayName] = useState(initialSenderName || (isUser ? '' : 'User'));
  const [avatarUrl, setAvatarUrl] = useState(initialSenderAvatarUrl);
  const [rsvpProcessed, setRsvpProcessed] = useState(message.rsvpStatus !== 'pending');
  const [isProcessingRsvp, setIsProcessingRsvp] = useState(false);
  const [profileFetchError, setProfileFetchError] = useState<Error | null>(null);

  useErrorAlert(profileFetchError, { title: 'Could not load profile' });

  useEffect(() => {
    if (!isUser && senderId && (displayName === 'User' || displayName === 'Unknown User' || !displayName)) {
      getUserProfileById(senderId)
        .then(profile => {
          if (profile && profile.displayName) {
            setDisplayName(profile.displayName);
          }
          if (profile && profile.avatarUrl) {
            setAvatarUrl(profile.avatarUrl);
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile for message bubble:", err);
          setProfileFetchError(err instanceof Error ? err : new Error(getErrorMessage(err)));
        });
    } else if (!isUser) {
      setDisplayName(initialSenderName || 'User');
      setAvatarUrl(initialSenderAvatarUrl);
    }
  }, [isUser, senderId, initialSenderName, initialSenderAvatarUrl, displayName]);

  useEffect(() => {
    setRsvpProcessed(message.rsvpStatus !== 'pending');
  }, [message.rsvpStatus]);

  const handleRsvpAction = async (action: 'accepted' | 'declined') => {
    if (!message.eventId || !message.guestId || !currentUserId || isProcessingRsvp) return;

    setIsProcessingRsvp(true);
    try {
      const guestStatusUpdate: GuestStatus = action === 'accepted' ? 'accepted' : 'declined';
      await updateGuestRsvp(isAuthenticated, message.eventId, message.guestId, { status: guestStatusUpdate });
      await updateMessageRsvpStatus(isAuthenticated, message.conversationId, message.id, action);
      showSuccess("RSVP Submitted", `You have ${action} the invitation.`);
    } catch (error: any) {
      console.error(`Error processing RSVP (${action}):`, error);
      showError("Error", `Could not submit RSVP: ${error.message}`);
    } finally {
      setIsProcessingRsvp(false);
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.messageBubbleContainer, isUser ? styles.userMessageContainer : styles.otherMessageContainer]}>
      {!isUser && (
        <Avatar
          name={displayName}
          avatarUrls={avatarUrl ? [avatarUrl] : []}
          size={32}
        />
      )}
      <View style={[styles.messageBubble, isUser ? styles.userMessage : styles.otherMessage]}>
        {!isUser && <Text style={styles.senderName}>{displayName}</Text>}
        
        {message.contentType === 'text' && (
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.otherMessageText]}>
            {message.content}
          </Text>
        )}

        {message.contentType === 'eventInvitation' && (
          <View>
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.otherMessageText]}>
              {message.content} {/* Main invitation text */}
            </Text>
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.otherMessageText, { fontWeight: 'bold', marginTop: Spacing.xxs }]}>
              Event: {message.eventName}
            </Text>
            {!isUser && !rsvpProcessed && message.rsvpStatus === 'pending' && (
              <View style={styles.rsvpButtonContainer}>
                <TouchableOpacity 
                  style={[styles.rsvpButton, styles.acceptButton]} 
                  onPress={() => handleRsvpAction('accepted')}
                  disabled={isProcessingRsvp}
                >
                  {isProcessingRsvp ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.rsvpButtonText}>Accept</Text>}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.rsvpButton, styles.declineButton]} 
                  onPress={() => handleRsvpAction('declined')}
                  disabled={isProcessingRsvp}
                >
                  {isProcessingRsvp ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.rsvpButtonText}>Decline</Text>}
                </TouchableOpacity>
              </View>
            )}
            {!isUser && rsvpProcessed && (
              <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.otherMessageText, styles.rsvpStatusText, { marginTop: Spacing.s }]}>
                You have {message.rsvpStatus}.
              </Text>
            )}
             {isUser && ( // If the sender is viewing the message
              <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.otherMessageText, styles.rsvpStatusText, { marginTop: Spacing.s, fontStyle: 'italic' }]}>
                Invitation sent. Status: {message.rsvpStatus}
              </Text>
            )}
          </View>
        )}

        {message.contentType === 'image' && message.mediaUrl && (
          <TouchableOpacity onPress={() => message.mediaUrl && Linking.openURL(message.mediaUrl)}>
            <Image source={{ uri: message.mediaUrl }} style={styles.chatImage} />
            {message.content && message.content.trim() !== '' && ( // Display caption if exists
              <Text style={[styles.messageText, styles.captionText, isUser ? styles.userMessageText : styles.otherMessageText, {marginTop: Spacing.xs}]}>
                {message.content}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {message.contentType === 'file' && message.mediaUrl && (
          <TouchableOpacity onPress={() => message.mediaUrl && Linking.openURL(message.mediaUrl)} style={styles.fileMessageContainer}>
            <Ionicons name="document-text-outline" size={24} color={isUser ? currentColors.primaryContrastText : currentColors.text} style={styles.fileIcon} />
            <View style={{flex: 1}}>
              <Text style={[styles.fileName, isUser ? styles.userMessageText : styles.otherMessageText]} numberOfLines={1}>
                {message.fileName || 'Attachment'}
              </Text>
              {message.fileSize && (
                <Text style={[styles.fileSize, isUser ? styles.userTimestamp : styles.otherTimestamp]}>
                  {`${(message.fileSize / 1024 / 1024).toFixed(2)} MB`}
                </Text>
              )}
               {message.content && message.content.trim() !== '' && ( // Display caption if exists
                <Text style={[styles.messageText, styles.captionText, isUser ? styles.userMessageText : styles.otherMessageText, {marginTop: Spacing.xxs}]}>
                  {message.content}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.otherTimestamp]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

const ChatAreaScreen: React.FC = () => {
  const { currentColors } = useAppTheme();
  const styles = createChatAreaStyles(currentColors);


  const router = useRouter();
  const { conversationId, chatTitle } = useLocalSearchParams<{ conversationId: string, chatTitle?: string }>();
  const { user: currentUser } = useAppAuth();
  const { showError } = useAlert();

  const { 
    messages, 
    isLoadingMessages, 
    error, 
    postMessage, 
    conversationDetails,
    isSendingMessage,
    isUploadingFile,  
    uploadProgress    
  } = useChatMessages(conversationId);

  const [inputText, setInputText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{ uri: string; type: 'image' | 'file'; name?: string, size?: number } | null>(null);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (messages.length) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const getOtherParticipant = useCallback((): ParticipantInfo | undefined => {
    if (!conversationDetails || !currentUser) return undefined;
    return conversationDetails.participants.find(p => p.userId !== currentUser.uid);
  }, [conversationDetails, currentUser]);
  
  const otherParticipantName = getOtherParticipant()?.displayName;
  const screenTitle = chatTitle || (conversationDetails?.type === 'group' ? conversationDetails.name : otherParticipantName) || 'Chat';

  const handleOpenChatSettings = () => {
    if (conversationId) {
      router.push({
        pathname: `/(chat)/conversationSettings`,
        params: { conversationId: conversationId }
      });
      setIsMenuVisible(false);
    }
  };

  const handleToggleSearch = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
    setIsMenuVisible(false);
    if (isSearchBarVisible) {
      setSearchQuery('');
    }
  };

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const requestPermissions = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibraryStatus !== 'granted') {
        showError('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    return true;
  }, [showError]);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);


  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      try {
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.exists) {
          if (fileInfo.size > MAX_FILE_SIZE_BYTES) {
            showError('File Too Large', `The selected image exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
            return;
          }
          setSelectedAttachment({ uri: asset.uri, type: 'image', name: asset.fileName || asset.uri.split('/').pop(), size: fileInfo.size });
        } else {
          showError("Error", "Selected file does not exist.");
          return;
        }
        setShowEmojiPicker(false);
      } catch (error) {
        console.error("Error getting file info for image:", error);
        showError("Error", "Could not get image details.");
      }
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.canceled === true || !result.assets || result.assets.length === 0) {
        return;
      }
      
      const asset = result.assets[0];

      if (asset.size && asset.size > MAX_FILE_SIZE_BYTES) {
        showError('File Too Large', `The selected document exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }
      setSelectedAttachment({ uri: asset.uri, type: 'file', name: asset.name, size: asset.size });
      setShowEmojiPicker(false);
    } catch (err) {
      console.error('Error picking document:', err);
      showError('Error', 'Could not pick document.');
    }
  };
  
  const handleSelectEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const handleSendMessage = async () => {
    if (!selectedAttachment && inputText.trim() === '') return;
    if (!conversationId) {
      showError("Error", "Conversation ID is missing.");
      return;
    }

    const messagePayload: any = {
      content: inputText.trim(),
    };

    if (selectedAttachment) {
      messagePayload.attachment = {
        uri: selectedAttachment.uri,
      };
    }

    try {
      await postMessage(messagePayload);
      setInputText('');
      setSelectedAttachment(null);
    } catch (e) {
      console.error("Failed to send message:", e);
      showError("Error", `Could not send message. ${e instanceof Error ? e.message : String(e)}`);
    }
  };
  
  if (isLoadingMessages && messages.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['left', 'right', 'bottom']}>
        <ColoredHeaderStatusBar backgroundColor={Colors.brown} contentStyle="light" />
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text>Loading messages...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]} edges={['left', 'right', 'bottom']}>
        <ColoredHeaderStatusBar backgroundColor={Colors.brown} contentStyle="light" />
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ColoredHeaderStatusBar backgroundColor={Colors.brown} contentStyle="light" />
      <Stack.Screen
        options={{
          title: screenTitle,
          ...HeaderButtonItems.headerRightIconOptions({
            label: 'More options',
            sfSymbol: 'ellipsis',
            ionicon: 'ellipsis-vertical',
            onPress: () => setIsMenuVisible(true),
            tintColor: currentColors.accentContrastText,
          }),
        }}
      />

      {/* Search Bar */}
      {isSearchBarVisible && (
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={currentColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <TouchableOpacity onPress={() => { setIsSearchBarVisible(false); setSearchQuery(''); }} style={styles.searchBarCloseButton}>
            <Ionicons name="close-outline" size={24} color={currentColors.text} />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.divider} />

      {/* Dropdown Menu Modal */}
      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
        animationType="fade"
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownMenuItem} onPress={handleOpenChatSettings}>
              <Ionicons name="settings-outline" size={22} color={currentColors.text} style={styles.dropdownMenuItemIcon} />
              <Text style={styles.dropdownMenuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownMenuItem} onPress={handleToggleSearch}>
              <Ionicons name="search-outline" size={22} color={currentColors.text} style={styles.dropdownMenuItemIcon} />
              <Text style={styles.dropdownMenuItemText}>Search</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} // 'height' can also work
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
      >
        <FlatList<ChatMessage>
          ref={flatListRef}
          data={
            isSearchBarVisible && searchQuery.trim() !== ''
              ? messages.filter(msg => 
                  msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (msg.contentType === 'eventInvitation' && msg.eventName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (msg.contentType === 'file' && msg.fileName?.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              : messages
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isUser = item.senderId === currentUser?.uid;
            const senderInfo = conversationDetails?.participants.find(p => p.userId === item.senderId);
            return (
              <MessageBubble
                message={item}
                isUser={isUser}
                senderName={senderInfo?.displayName}
                senderAvatarUrl={senderInfo?.avatarUrl as string}
                senderId={item.senderId}
                currentUserId={currentUser?.uid}
                isAuthenticated={!!currentUser}
                styles={styles}
                currentColors={currentColors}
              />
            );
          }}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <View style={styles.centered}>
                <Text style={styles.emptyChatText}>No messages yet. Start the conversation!</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowEmojiPicker(prev => !prev)} style={styles.iconButton}>
            <Ionicons name="happy-outline" size={24} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
            <Ionicons name="image-outline" size={24} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickDocument} style={styles.iconButton}>
            <Ionicons name="attach-outline" size={24} color={currentColors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={currentColors.textSecondary}
            multiline
            onFocus={() => setShowEmojiPicker(false)}
          />
          <TouchableOpacity
            style={[styles.sendButton, ( (inputText.trim() === '' && !selectedAttachment) || isSendingMessage || isUploadingFile) && styles.disabledSendButton]}
            onPress={handleSendMessage}
            disabled={(inputText.trim() === '' && !selectedAttachment) || isSendingMessage || isUploadingFile}
          >
            {isSendingMessage || isUploadingFile ? (
              <ActivityIndicator size="small" color={currentColors.primaryContrastText} />
            ) : (
              <Ionicons name="send" size={22} color={currentColors.primaryContrastText} />
            )}
          </TouchableOpacity>
        </View>

        {isUploadingFile && (
          <View style={styles.uploadProgressContainer}>
            <Text style={styles.uploadProgressText}>Uploading: {uploadProgress.toFixed(0)}%</Text>
            <ActivityIndicator size="small" color={currentColors.primary} />
          </View>
        )}

        {selectedAttachment && !isUploadingFile && (
          <View style={styles.attachmentPreviewContainer}>
            <Ionicons 
                name={selectedAttachment.type === 'image' ? "image-outline" : "document-text-outline"} 
                size={20} 
                color={currentColors.textSecondary} 
                style={styles.attachmentPreviewIcon}
            />
            <Text style={styles.attachmentPreviewText} numberOfLines={1}>
              {selectedAttachment.name || 'Attachment'}
            </Text>
            <TouchableOpacity onPress={() => setSelectedAttachment(null)} style={styles.removeAttachmentButton}>
              <Ionicons name="close-circle" size={20} color={currentColors.error} />
            </TouchableOpacity>
          </View>
        )}

        {showEmojiPicker && (
          <View style={styles.emojiPickerContainer}>
            <ScrollView showsVerticalScrollIndicator={true}> 
              {emojiCategories.map((category) => (
                <View key={category.title} style={styles.emojiCategory}>
                  <Text style={styles.emojiCategoryTitle}>{category.title}</Text>
                  <View style={styles.emojiRow}>
                    {category.emojis.map((emoji) => (
                      <TouchableOpacity
                        key={`${category.title}-${emoji}`} // Ensure unique keys across categories
                        onPress={() => handleSelectEmoji(emoji)}
                        style={styles.emojiButton}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatAreaScreen;
