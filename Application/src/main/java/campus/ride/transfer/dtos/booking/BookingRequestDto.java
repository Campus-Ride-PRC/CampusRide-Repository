package campus.ride.transfer.dtos.booking;

public class BookingRequestDto {
    private Long driveId;

    public BookingRequestDto() {}

    public BookingRequestDto(Long driveId) {
        this.driveId = driveId;
    }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }
}
