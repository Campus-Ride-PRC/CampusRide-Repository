package campus.ride.transfer.dtos.user;

import java.time.LocalDateTime;

public class FriendRequestResponseDto {
    private Long id;
    private Long senderId;
    private String senderFirstName;
    private String senderLastName;
    private String senderEmail;
    private LocalDateTime sentAt;

    public FriendRequestResponseDto(Long id, Long senderId, String senderFirstName, String senderLastName, String senderEmail, LocalDateTime sentAt) {
        this.id = id;
        this.senderId = senderId;
        this.senderFirstName = senderFirstName;
        this.senderLastName = senderLastName;
        this.senderEmail = senderEmail;
        this.sentAt = sentAt;
    }

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

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
