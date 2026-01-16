export interface MessageResponseDto {
    id: number;
    senderId: number;
    senderFirstName: string;
    senderLastName: string;
    receiverId: number;
    receiverFirstName: string;
    receiverLastName: string;
    content: string;
    sentAt: string;
    isReadBySender: boolean;
    isReadByReceiver: boolean;
    driveId?: number;
    conversationId: string;
}

export interface ConversationDto {
    otherUserId: number;
    otherUserFirstName: string;
    otherUserLastName: string;
    lastMessageContent: string;
    lastMessageSentAt: string;
    unreadCount: number;
    conversationId: string;
}

export interface MessageRequestDto {
    receiverId: number;
    content: string;
    driveId?: number;
}
