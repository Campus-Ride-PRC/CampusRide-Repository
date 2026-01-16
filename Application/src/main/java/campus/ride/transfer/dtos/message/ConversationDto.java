package campus.ride.transfer.dtos.message;

import java.time.LocalDateTime;

/**
 * DTO for conversation list - shows the other user and last message info.
 */
public class ConversationDto {
    private Long otherUserId;
    private String otherUserFirstName;
    private String otherUserLastName;
    private String lastMessageContent;
    private LocalDateTime lastMessageSentAt;
    private Long unreadCount;
    private String conversationId;

    public ConversationDto() {
    }

    public ConversationDto(Long otherUserId, String otherUserFirstName, String otherUserLastName,
            String lastMessageContent, LocalDateTime lastMessageSentAt,
            Long unreadCount, String conversationId) {
        this.otherUserId = otherUserId;
        this.otherUserFirstName = otherUserFirstName;
        this.otherUserLastName = otherUserLastName;
        this.lastMessageContent = lastMessageContent;
        this.lastMessageSentAt = lastMessageSentAt;
        this.unreadCount = unreadCount;
        this.conversationId = conversationId;
    }

    // Getters and Setters
    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserFirstName() {
        return otherUserFirstName;
    }

    public void setOtherUserFirstName(String otherUserFirstName) {
        this.otherUserFirstName = otherUserFirstName;
    }

    public String getOtherUserLastName() {
        return otherUserLastName;
    }

    public void setOtherUserLastName(String otherUserLastName) {
        this.otherUserLastName = otherUserLastName;
    }

    public String getLastMessageContent() {
        return lastMessageContent;
    }

    public void setLastMessageContent(String lastMessageContent) {
        this.lastMessageContent = lastMessageContent;
    }

    public LocalDateTime getLastMessageSentAt() {
        return lastMessageSentAt;
    }

    public void setLastMessageSentAt(LocalDateTime lastMessageSentAt) {
        this.lastMessageSentAt = lastMessageSentAt;
    }

    public Long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(Long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
}
