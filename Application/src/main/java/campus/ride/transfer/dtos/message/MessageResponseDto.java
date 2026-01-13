package campus.ride.transfer.dtos.message;

import java.time.LocalDateTime;

/**
 * DTO for returning message data.
 */
public class MessageResponseDto {
    private Long id;
    private Long senderId;
    private String senderFirstName;
    private String senderLastName;
    private Long receiverId;
    private String receiverFirstName;
    private String receiverLastName;
    private String content;
    private LocalDateTime sentAt;
    private Boolean isReadBySender;
    private Boolean isReadByReceiver;
    private Long driveId;
    private String conversationId;

    public MessageResponseDto() {
    }

    public MessageResponseDto(Long id, Long senderId, String senderFirstName, String senderLastName,
            Long receiverId, String receiverFirstName, String receiverLastName,
            String content, LocalDateTime sentAt, Boolean isReadBySender, Boolean isReadByReceiver,
            Long driveId, String conversationId) {
        this.id = id;
        this.senderId = senderId;
        this.senderFirstName = senderFirstName;
        this.senderLastName = senderLastName;
        this.receiverId = receiverId;
        this.receiverFirstName = receiverFirstName;
        this.receiverLastName = receiverLastName;
        this.content = content;
        this.sentAt = sentAt;
        this.isReadBySender = isReadBySender;
        this.isReadByReceiver = isReadByReceiver;
        this.driveId = driveId;
        this.conversationId = conversationId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderFirstName() {
        return senderFirstName;
    }

    public void setSenderFirstName(String senderFirstName) {
        this.senderFirstName = senderFirstName;
    }

    public String getSenderLastName() {
        return senderLastName;
    }

    public void setSenderLastName(String senderLastName) {
        this.senderLastName = senderLastName;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverFirstName() {
        return receiverFirstName;
    }

    public void setReceiverFirstName(String receiverFirstName) {
        this.receiverFirstName = receiverFirstName;
    }

    public String getReceiverLastName() {
        return receiverLastName;
    }

    public void setReceiverLastName(String receiverLastName) {
        this.receiverLastName = receiverLastName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public Boolean getIsReadBySender() {
        return isReadBySender;
    }

    public void setIsReadBySender(Boolean isReadBySender) {
        this.isReadBySender = isReadBySender;
    }

    public Boolean getIsReadByReceiver() {
        return isReadByReceiver;
    }

    public void setIsReadByReceiver(Boolean isReadByReceiver) {
        this.isReadByReceiver = isReadByReceiver;
    }

    public Long getDriveId() {
        return driveId;
    }

    public void setDriveId(Long driveId) {
        this.driveId = driveId;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
}
