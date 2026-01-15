package campus.ride.transfer.dtos.payment;

import campus.ride.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long id;
    private Long bookingDriveId;
    private Long bookingUserId;
    private Long paymentMethodId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String transactionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PaymentDto() {
    }

    public PaymentDto(Long id, Long bookingDriveId, Long bookingUserId, Long paymentMethodId,
            BigDecimal amount, PaymentStatus status, String transactionId,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bookingDriveId = bookingDriveId;
        this.bookingUserId = bookingUserId;
        this.paymentMethodId = paymentMethodId;
        this.amount = amount;
        this.status = status;
        this.transactionId = transactionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingDriveId() {
        return bookingDriveId;
    }

    public void setBookingDriveId(Long bookingDriveId) {
        this.bookingDriveId = bookingDriveId;
    }

    public Long getBookingUserId() {
        return bookingUserId;
    }

    public void setBookingUserId(Long bookingUserId) {
        this.bookingUserId = bookingUserId;
    }

    public Long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
