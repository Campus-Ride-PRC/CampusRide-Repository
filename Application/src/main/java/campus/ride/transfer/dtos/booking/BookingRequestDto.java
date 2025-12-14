package campus.ride.transfer.dtos.booking;

public class BookingRequestDto {
    private Long driveId;
    private Long pickupAddressId;

    public BookingRequestDto() {}

    public BookingRequestDto(Long driveId, Long pickupAddressId) {
        this.driveId = driveId;
        this.pickupAddressId = pickupAddressId;
    }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public Long getPickupAddressId() { return pickupAddressId; }
    public void setPickupAddressId(Long pickupAddressId) { this.pickupAddressId = pickupAddressId; }
}
