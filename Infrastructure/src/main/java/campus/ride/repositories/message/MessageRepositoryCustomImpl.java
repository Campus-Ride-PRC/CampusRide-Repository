package campus.ride.repositories.message;

import campus.ride.entities.Message;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Custom repository implementation for Message entity.
 * Provides saveAndRefresh to get database-generated fields.
 */
@Repository
public class MessageRepositoryCustomImpl implements MessageRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Save message and refresh to get database-generated fields (sentAt,
     * conversationId).
     */
    @Transactional
    public Message saveAndRefresh(Message message) {
        entityManager.persist(message);
        entityManager.flush();
        entityManager.refresh(message);
        return message;
    }
}
