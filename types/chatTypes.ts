export type ChatRole = 'admin' | 'member';

export interface ParticipantInfo {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  role: ChatRole; // Added role
  lastReadTimestamp?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: ParticipantInfo[];
  lastMessage?: ChatMessageSnippet | null;
  lastMessageTimestamp?: string;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  creatorId?: string;
  avatarUrl?: string | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderDisplayName?: string;
  senderAvatarUrl?: string | null;
  content: string;
  contentType: 'text' | 'image' | 'file' | 'system' | 'eventInvitation';
  mediaUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  timestamp: string;
  isReadBy?: string[];
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  reactions?: MessageReaction[];
  editedAt?: string;

  eventId?: string;
  guestId?: string;
  eventName?: string;
  rsvpStatus?: 'pending' | 'accepted' | 'declined';
}

export interface ChatMessageSnippet {
  content: string;
  timestamp: string;
  senderId?: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface CreateDirectConversationPayload {
  recipientId: string;
  initialMessage?: string;
}

export interface CreateGroupConversationPayload {
  name: string;
  participantIds: string[];
  initialMessage?: string;
  avatarUrl?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  contentType?: ChatMessage['contentType'];
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  eventId?: string;
  guestId?: string;
  eventName?: string;
  rsvpStatus?: 'pending' | 'accepted' | 'declined';
}

export interface MarkConversationAsReadPayload {
  conversationId: string;
}

export interface GetMessagesParams {
  conversationId: string;
  limit?: number;
  beforeMessageId?: string;
  afterMessageId?: string;
}
