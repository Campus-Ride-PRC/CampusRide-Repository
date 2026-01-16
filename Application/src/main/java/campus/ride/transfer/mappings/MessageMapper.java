package campus.ride.transfer.mappings;

import campus.ride.entities.Message;
import campus.ride.transfer.dtos.message.MessageResponseDto;

/**
 * Mapper for Message entity to DTOs.
 */
public class MessageMapper {

    private MessageMapper() {
        // Utility class
    }

    public static MessageResponseDto toDto(Message message) {
        if (message == null) {
            return null;
        }

        return new MessageResponseDto(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getFirstName(),
                message.getSender().getLastName(),
                message.getReceiver().getId(),
                message.getReceiver().getFirstName(),
                message.getReceiver().getLastName(),
                message.getContent(),
                message.getSentAt(),
                message.getIsReadBySender(),
                message.getIsReadByReceiver(),
                message.getDrive() != null ? message.getDrive().getId() : null,
                message.getConversationId());
    }
}
