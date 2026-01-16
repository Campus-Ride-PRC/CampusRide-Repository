package campus.ride.interfaces;

import campus.ride.transfer.dtos.message.MessageResponseDto;

/**
 * Interface for pushing real-time message notifications.
 * Implemented in the API layer with WebSocket support.
 */
public interface MessageNotificationService {

    /**
     * Notify a user of a new message via real-time channel.
     * 
     * @param userId  The recipient's user ID
     * @param message The message to deliver
     */
    void notifyNewMessage(Long userId, MessageResponseDto message);

    /**
     * Notify the sender that their message was delivered (for multi-device sync).
     * 
     * @param senderId The sender's user ID
     * @param message  The message that was sent
     */
    void notifySender(Long senderId, MessageResponseDto message);
}
