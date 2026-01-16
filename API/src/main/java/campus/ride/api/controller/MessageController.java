package campus.ride.api.controller;

import campus.ride.interfaces.MessageService;
import campus.ride.transfer.dtos.message.ConversationDto;
import campus.ride.transfer.dtos.message.MessageRequestDto;
import campus.ride.transfer.dtos.message.MessageResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messages", description = "Messaging APIs for direct user-to-user communication")
public class MessageController {

    private static final Logger logger = LogManager.getLogger(MessageController.class);

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @Operation(summary = "Send a message", description = "Send a new message to another user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Message sent successfully", content = @Content(schema = @Schema(implementation = MessageResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "404", description = "Receiver not found")
    })
    @PostMapping
    public CompletableFuture<ResponseEntity<MessageResponseDto>> sendMessage(@RequestBody MessageRequestDto request) {
        logger.info("Received request to send message to user ID: {}", request.getReceiverId());

        return messageService.sendMessage(request)
                .thenApply(message -> {
                    logger.info("Message sent successfully with ID: {}", message.getId());
                    return ResponseEntity.status(HttpStatus.CREATED).body(message);
                });
    }

    @Operation(summary = "Get all conversations", description = "Get a list of all conversations for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conversations retrieved successfully", content = @Content(schema = @Schema(implementation = ConversationDto.class)))
    })
    @GetMapping("/conversations")
    public CompletableFuture<ResponseEntity<List<ConversationDto>>> getConversations() {
        logger.info("Received request to get all conversations");

        return messageService.getConversations()
                .thenApply(conversations -> {
                    logger.info("Returning {} conversations", conversations.size());
                    return ResponseEntity.ok(conversations);
                });
    }

    @Operation(summary = "Get messages in a conversation", description = "Get paginated messages in a conversation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Messages retrieved successfully", content = @Content(schema = @Schema(implementation = MessageResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Conversation not found")
    })
    @GetMapping("/conversation/{conversationId}")
    public CompletableFuture<ResponseEntity<List<MessageResponseDto>>> getConversation(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        logger.info("Received request to get conversation: {}", conversationId);

        return messageService.getConversation(conversationId, page, size)
                .thenApply(messages -> {
                    logger.info("Returning {} messages", messages.size());
                    return ResponseEntity.ok(messages);
                });
    }

    @Operation(summary = "Mark a message as read", description = "Mark a specific message as read")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message marked as read", content = @Content(schema = @Schema(implementation = MessageResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "Message not found"),
            @ApiResponse(responseCode = "400", description = "Cannot mark message as read")
    })
    @PutMapping("/{id}/read")
    public CompletableFuture<ResponseEntity<MessageResponseDto>> markAsRead(@PathVariable Long id) {
        logger.info("Received request to mark message as read: {}", id);

        return messageService.markAsRead(id)
                .thenApply(message -> {
                    logger.info("Message marked as read: {}", id);
                    return ResponseEntity.ok(message);
                });
    }

    @Operation(summary = "Mark conversation as read", description = "Mark all messages in a conversation as read")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Conversation marked as read")
    })
    @PutMapping("/conversations/{conversationId}/read")
    public CompletableFuture<ResponseEntity<Void>> markConversationAsRead(@PathVariable String conversationId) {
        logger.info("Received request to mark conversation as read: {}", conversationId);

        return messageService.markConversationAsRead(conversationId)
                .thenApply(v -> {
                    logger.info("Conversation marked as read: {}", conversationId);
                    return ResponseEntity.noContent().<Void>build();
                });
    }
}
