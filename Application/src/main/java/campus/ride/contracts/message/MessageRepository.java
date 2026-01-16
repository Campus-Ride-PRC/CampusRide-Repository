package campus.ride.contracts.message;

import campus.ride.entities.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Repository contract for Message entity.
 */
public interface MessageRepository {

    Message save(Message message);

    /**
     * Save and refresh to get database-generated fields (sentAt, conversationId).
     */
    Message saveAndRefresh(Message message);

    Optional<Message> findById(Long id);

    /**
     * Find messages in a conversation between two users, ordered by sent time
     * descending.
     */
    Page<Message> findByConversationIdOrderBySentAtDesc(String conversationId, Pageable pageable);

    /**
     * Find all distinct conversation IDs for a user.
     */
    List<String> findDistinctConversationIdsByUserId(Long userId);

    /**
     * Find the latest message in a conversation.
     */
    Optional<Message> findTopByConversationIdOrderBySentAtDesc(String conversationId);

    /**
     * Count unread messages in a conversation for a specific user.
     */
    Long countByConversationIdAndReceiverIdAndIsReadFalse(String conversationId, Long receiverId);

    /**
     * Mark all messages as read in a conversation for a specific receiver.
     */
    void markConversationAsRead(String conversationId, Long receiverId);
}
