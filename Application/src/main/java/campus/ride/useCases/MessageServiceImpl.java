package campus.ride.useCases;

import campus.ride.contracts.drive.DriveRepository;
import campus.ride.contracts.message.MessageRepository;
import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.Drive;
import campus.ride.entities.Message;
import campus.ride.entities.User;
import campus.ride.exception.BadRequestException;
import campus.ride.exception.ResourceNotFoundException;
import campus.ride.interfaces.MessageNotificationService;
import campus.ride.interfaces.MessageService;
import campus.ride.transfer.dtos.message.ConversationDto;
import campus.ride.transfer.dtos.message.MessageRequestDto;
import campus.ride.transfer.dtos.message.MessageResponseDto;
import campus.ride.transfer.mappings.MessageMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private static final Logger logger = LogManager.getLogger(MessageServiceImpl.class);

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final DriveRepository driveRepository;
    private final MessageNotificationService notificationService;

    public MessageServiceImpl(MessageRepository messageRepository,
            UserRepository userRepository,
            DriveRepository driveRepository,
            MessageNotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.driveRepository = driveRepository;
        this.notificationService = notificationService;
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof String email) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
            return user.getId();
        }
        throw new BadRequestException("Unable to determine current user");
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<MessageResponseDto> sendMessage(MessageRequestDto request) {
        logger.info("Sending message to user ID: {}", request.getReceiverId());

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BadRequestException("Message content cannot be empty");
        }

        if (request.getReceiverId() == null) {
            throw new BadRequestException("Receiver ID is required");
        }

        Long senderId = getCurrentUserId();

        if (senderId.equals(request.getReceiverId())) {
            throw new BadRequestException("Cannot send message to yourself");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Receiver not found with ID: " + request.getReceiverId()));

        Message message;

        // Check if this is a drive-related message or private conversation
        if (request.getDriveId() != null) {
            // Drive-related message: validate that either sender or receiver is the driver
            Drive drive = driveRepository.findById(request.getDriveId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Drive not found with ID: " + request.getDriveId()));

            User driver = drive.getDriver();
            if (driver == null) {
                throw new BadRequestException("Drive has no assigned driver");
            }

            // Validate that either sender or receiver is the driver of this ride
            boolean senderIsDriver = driver.getId().equals(senderId);
            boolean receiverIsDriver = driver.getId().equals(request.getReceiverId());

            if (!senderIsDriver && !receiverIsDriver) {
                throw new BadRequestException(
                        "For drive-related messages, either sender or receiver must be the driver of the ride");
            }

            // Create message with drive context (generates conversation ID with drive)
            message = new Message(sender, receiver, request.getContent().trim(), drive);
            logger.info("Drive-related message created for drive ID: {}", request.getDriveId());
        } else {
            // Private conversation (no drive)
            message = new Message(sender, receiver, request.getContent().trim());
            logger.info("Private message created between users {} and {}", senderId, request.getReceiverId());
        }

        // Save and refresh to get database-generated fields (sentAt, conversationId)
        Message savedMessage = messageRepository.saveAndRefresh(message);
        logger.info("Message sent successfully with ID: {}", savedMessage.getId());

        // Convert to DTO for response and notification
        MessageResponseDto responseDto = MessageMapper.toDto(savedMessage);

        // Push real-time notification to receiver via WebSocket
        try {
            notificationService.notifyNewMessage(request.getReceiverId(), responseDto);
            // Also notify sender for multi-device sync
            notificationService.notifySender(senderId, responseDto);
            logger.info("WebSocket notifications sent for message ID: {}", savedMessage.getId());
        } catch (Exception e) {
            // Don't fail the request if WebSocket notification fails
            logger.warn("Failed to send WebSocket notification: {}", e.getMessage());
        }

        return CompletableFuture.completedFuture(responseDto);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<MessageResponseDto>> getConversation(String conversationId, int page, int size) {
        logger.info("Getting conversation: {}", conversationId);

        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByConversationIdOrderBySentAtDesc(conversationId, pageable);

        List<MessageResponseDto> messageDtos = messages.getContent().stream()
                .map(MessageMapper::toDto)
                .collect(Collectors.toList());

        logger.info("Found {} messages in conversation", messageDtos.size());
        return CompletableFuture.completedFuture(messageDtos);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<ConversationDto>> getConversations() {
        logger.info("Getting all conversations for current user");

        Long currentUserId = getCurrentUserId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        List<String> conversationIds = messageRepository.findDistinctConversationIdsByUserId(currentUserId);
        List<ConversationDto> conversations = new ArrayList<>();

        for (String conversationId : conversationIds) {
            Optional<Message> lastMessageOpt = messageRepository
                    .findTopByConversationIdOrderBySentAtDesc(conversationId);

            if (lastMessageOpt.isPresent()) {
                Message lastMessage = lastMessageOpt.get();

                // Determine the other user in the conversation
                User otherUser = lastMessage.getSender().getId().equals(currentUserId)
                        ? lastMessage.getReceiver()
                        : lastMessage.getSender();

                Long unreadCount = messageRepository.countByConversationIdAndReceiverIdAndIsReadFalse(
                        conversationId, currentUserId);

                ConversationDto conversationDto = new ConversationDto(
                        otherUser.getId(),
                        otherUser.getFirstName(),
                        otherUser.getLastName(),
                        lastMessage.getContent(),
                        lastMessage.getSentAt(),
                        unreadCount,
                        conversationId);

                conversations.add(conversationDto);
            }
        }

        // Sort by last message time (most recent first)
        conversations.sort((c1, c2) -> {
            if (c1.getLastMessageSentAt() == null && c2.getLastMessageSentAt() == null)
                return 0;
            if (c1.getLastMessageSentAt() == null)
                return 1;
            if (c2.getLastMessageSentAt() == null)
                return -1;
            return c2.getLastMessageSentAt().compareTo(c1.getLastMessageSentAt());
        });

        logger.info("Found {} conversations", conversations.size());
        return CompletableFuture.completedFuture(conversations);
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<MessageResponseDto> markAsRead(Long messageId) {
        logger.info("Marking message as read: {}", messageId);

        Long currentUserId = getCurrentUserId();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with ID: " + messageId));

        // Only the receiver can mark a message as read
        if (!message.getReceiver().getId().equals(currentUserId)) {
            throw new BadRequestException("You can only mark messages sent to you as read");
        }

        message.setIsReadByReceiver(true);
        Message savedMessage = messageRepository.save(message);

        logger.info("Message marked as read: {}", messageId);
        return CompletableFuture.completedFuture(MessageMapper.toDto(savedMessage));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Void> markConversationAsRead(String conversationId) {
        logger.info("Marking conversation as read: {}", conversationId);

        Long currentUserId = getCurrentUserId();

        messageRepository.markConversationAsRead(conversationId, currentUserId);

        logger.info("Conversation marked as read: {}", conversationId);
        return CompletableFuture.completedFuture(null);
    }
}
