package campus.ride.transfer.dtos.booking;

public class BookingRequestDto {
    private Long driveId;
    private Long userId;

    public BookingRequestDto() {}

    public BookingRequestDto(Long driveId, Long userId) {
        this.driveId = driveId;
        this.userId = userId;
    }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
