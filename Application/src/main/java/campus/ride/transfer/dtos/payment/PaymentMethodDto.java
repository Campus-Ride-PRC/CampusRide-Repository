package campus.ride.transfer.dtos.payment;

import campus.ride.enums.PaymentMethodType;
import java.time.LocalDateTime;

public class PaymentMethodDto {
    private Long id;
    private Long userId;
    private String provider;
    private PaymentMethodType methodType;
    private String lastFour;
    private Boolean isDefault;
    private LocalDateTime createdAt;

    public PaymentMethodDto() {
    }

    public PaymentMethodDto(Long id, Long userId, String provider, PaymentMethodType methodType,
            String lastFour, Boolean isDefault, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.provider = provider;
        this.methodType = methodType;
        this.lastFour = lastFour;
        this.isDefault = isDefault;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public PaymentMethodType getMethodType() {
        return methodType;
    }

    public void setMethodType(PaymentMethodType methodType) {
        this.methodType = methodType;
    }

    public String getLastFour() {
        return lastFour;
    }

    public void setLastFour(String lastFour) {
        this.lastFour = lastFour;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
