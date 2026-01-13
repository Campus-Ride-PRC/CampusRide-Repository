package campus.ride.transfer.dtos.message;

/**
 * DTO for sending a new message.
 */
public class MessageRequestDto {
    private Long receiverId;
    private String content;
    private Long driveId; // Optional - for ride-related messages

    public MessageRequestDto() {
    }

    public MessageRequestDto(Long receiverId, String content) {
        this.receiverId = receiverId;
        this.content = content;
    }

    public MessageRequestDto(Long receiverId, String content, Long driveId) {
        this(receiverId, content);
        this.driveId = driveId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getDriveId() {
        return driveId;
    }

    public void setDriveId(Long driveId) {
        this.driveId = driveId;
    }
}
