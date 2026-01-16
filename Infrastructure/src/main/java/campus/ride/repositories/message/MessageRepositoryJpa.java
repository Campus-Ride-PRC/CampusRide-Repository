package campus.ride.repositories.message;

import campus.ride.contracts.message.MessageRepository;
import campus.ride.entities.Message;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepositoryJpa extends JpaRepository<Message, Long>, MessageRepository, MessageRepositoryCustom {

        @Override
        Page<Message> findByConversationIdOrderBySentAtDesc(String conversationId, Pageable pageable);

        @Override
        Optional<Message> findTopByConversationIdOrderBySentAtDesc(String conversationId);

        @Override
        @Query("SELECT DISTINCT m.conversationId FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
        List<String> findDistinctConversationIdsByUserId(@Param("userId") Long userId);

        @Override
        @Query("SELECT COUNT(m) FROM Message m WHERE m.conversationId = :conversationId AND m.receiver.id = :receiverId AND m.isReadByReceiver = false")
        Long countByConversationIdAndReceiverIdAndIsReadFalse(@Param("conversationId") String conversationId,
                        @Param("receiverId") Long receiverId);

        @Override
        @Modifying
        @Query("UPDATE Message m SET m.isReadByReceiver = true WHERE m.conversationId = :conversationId AND m.receiver.id = :receiverId AND m.isReadByReceiver = false")
        void markConversationAsRead(@Param("conversationId") String conversationId,
                        @Param("receiverId") Long receiverId);
}
