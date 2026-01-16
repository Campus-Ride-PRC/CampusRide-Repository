package campus.ride.transfer.dtos.payment;

import java.math.BigDecimal;

public class CheckoutSessionRequest {
    private Long driveId;
    private Long pickupAddressId;
    private String successUrl;
    private String cancelUrl;

    public CheckoutSessionRequest() {
    }

    public CheckoutSessionRequest(Long driveId, Long pickupAddressId, String successUrl, String cancelUrl) {
        this.driveId = driveId;
        this.pickupAddressId = pickupAddressId;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
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

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }
}
