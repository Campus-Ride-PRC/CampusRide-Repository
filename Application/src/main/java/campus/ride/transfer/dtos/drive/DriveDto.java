package campus.ride.transfer.dtos.drive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DriveDto {
    private Long id;
    private Long fromAddressId;
    private Long toAddressId;
    private BigDecimal price;
    private LocalDateTime time;
    private Integer availableSeats;
    private Integer totalNoSeats;
    private LocalDateTime createdAt;
    private Long driverId;
    private Long vehicleId;
    private java.util.List<String> acceptedPaymentTypes;

    public DriveDto() {
    }

    public DriveDto(Long id, Long fromAddressId, Long toAddressId,
            BigDecimal price, LocalDateTime time,
            Integer availableSeats, Integer totalNoSeats,
            LocalDateTime createdAt, Long driverId, Long vehicleId) {
        this.id = id;
        this.fromAddressId = fromAddressId;
        this.toAddressId = toAddressId;
        this.price = price;
        this.time = time;
        this.availableSeats = availableSeats;
        this.totalNoSeats = totalNoSeats;
        this.createdAt = createdAt;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFromAddressId() {
        return fromAddressId;
    }

    public void setFromAddressId(Long fromAddressId) {
        this.fromAddressId = fromAddressId;
    }

    public Long getToAddressId() {
        return toAddressId;
    }

    public void setToAddressId(Long toAddressId) {
        this.toAddressId = toAddressId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Integer getTotalNoSeats() {
        return totalNoSeats;
    }

    public void setTotalNoSeats(Integer totalNoSeats) {
        this.totalNoSeats = totalNoSeats;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public java.util.List<String> getAcceptedPaymentTypes() {
        return acceptedPaymentTypes;
    }

    public void setAcceptedPaymentTypes(java.util.List<String> acceptedPaymentTypes) {
        this.acceptedPaymentTypes = acceptedPaymentTypes;
    }
}
