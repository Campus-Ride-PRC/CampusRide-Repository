package campus.ride.api.controller;

import campus.ride.interfaces.MessageNotificationService;
import campus.ride.transfer.dtos.message.MessageResponseDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * WebSocket-based implementation of MessageNotificationService.
 * Pushes real-time message notifications to connected clients.
 */
@Service
public class MessageWebSocketController implements MessageNotificationService {

    private static final Logger logger = LogManager.getLogger(MessageWebSocketController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public MessageWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void notifyNewMessage(Long userId, MessageResponseDto message) {
        logger.info("Sending real-time message notification to user ID: {}", userId);

        // Send to topic that user is subscribed to
        messagingTemplate.convertAndSend("/topic/messages/" + userId, message);

        logger.debug("Message pushed to /topic/messages/{}", userId);
    }

    @Override
    public void notifySender(Long senderId, MessageResponseDto message) {
        logger.info("Notifying sender via WebSocket, user ID: {}", senderId);

        // Send to sender's topic for multi-device sync
        messagingTemplate.convertAndSend("/topic/messages/" + senderId, message);
    }
}
