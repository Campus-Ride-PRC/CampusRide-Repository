package campus.ride.interfaces;

import campus.ride.transfer.dtos.message.ConversationDto;
import campus.ride.transfer.dtos.message.MessageRequestDto;
import campus.ride.transfer.dtos.message.MessageResponseDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Service interface for message operations.
 */
public interface MessageService {

    /**
     * Send a new message.
     * 
     * @param request The message request containing receiver ID and content
     * @return The created message
     */
    CompletableFuture<MessageResponseDto> sendMessage(MessageRequestDto request);

    /**
     * Get paginated messages in a conversation.
     * 
     * @param conversationId The conversation ID (e.g., "28_47" or "28_47_45")
     * @param page           Page number (0-indexed)
     * @param size           Page size
     * @return List of messages in the conversation
     */
    CompletableFuture<List<MessageResponseDto>> getConversation(String conversationId, int page, int size);

    /**
     * Get all conversations for the current user.
     * 
     * @return List of conversations with last message and unread count
     */
    CompletableFuture<List<ConversationDto>> getConversations();

    /**
     * Mark a specific message as read.
     * 
     * @param messageId The message ID
     * @return The updated message
     */
    CompletableFuture<MessageResponseDto> markAsRead(Long messageId);

    /**
     * Mark all messages in a conversation as read for the current user.
     * 
     * @param conversationId The conversation ID (e.g., "28_47" or "28_47_45")
     */
    CompletableFuture<Void> markConversationAsRead(String conversationId);
}
