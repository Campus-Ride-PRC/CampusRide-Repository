package campus.ride.transfer.dtos.user;

import java.time.LocalDateTime;

public class FriendRequestStatusDto {
    private Long id;
    private Long receiverId;
    private String receiverFirstName;
    private String receiverLastName;
    private String status;
    private LocalDateTime updatedAt;

    public FriendRequestStatusDto(Long id, Long receiverId, String receiverFirstName, String receiverLastName, String status, LocalDateTime updatedAt) {
        this.id = id;
        this.receiverId = receiverId;
        this.receiverFirstName = receiverFirstName;
        this.receiverLastName = receiverLastName;
        this.status = status;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
