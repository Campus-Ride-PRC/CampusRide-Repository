package campus.ride.transfer.dtos.booking;

public class BookingUpdateDto {
    private Long driveId;
    private Long userId;
    private String action; // "ACCEPT" or "DECLINE"

    public BookingUpdateDto() {}

    public BookingUpdateDto(Long driveId, Long userId, String action) {
        this.driveId = driveId;
        this.userId = userId;
        this.action = action;
    }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
