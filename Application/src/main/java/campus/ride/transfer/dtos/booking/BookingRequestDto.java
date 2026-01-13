package campus.ride.transfer.dtos.booking;

public class BookingRequestDto {
    private Long driveId;
    private Long pickupAddressId;
    private Long paymentMethodId;

    public BookingRequestDto() {
    }

    public BookingRequestDto(Long driveId, Long pickupAddressId, Long paymentMethodId) {
        this.driveId = driveId;
        this.pickupAddressId = pickupAddressId;
        this.paymentMethodId = paymentMethodId;
    }

    public Long getDriveId() {
        return driveId;
    }

    public void setDriveId(Long driveId) {
        this.driveId = driveId;
    }

    public Long getPickupAddressId() {
        return pickupAddressId;
    }

    public void setPickupAddressId(Long pickupAddressId) {
        this.pickupAddressId = pickupAddressId;
    }

    public Long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }
}
