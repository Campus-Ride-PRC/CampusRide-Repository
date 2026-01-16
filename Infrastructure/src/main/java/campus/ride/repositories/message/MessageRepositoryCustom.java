package campus.ride.repositories.message;

import campus.ride.entities.Message;

/**
 * Custom repository interface for Message-specific operations.
 */
public interface MessageRepositoryCustom {

    /**
     * Save and refresh to get database-generated fields (sentAt, conversationId).
     */
    Message saveAndRefresh(Message message);
}
