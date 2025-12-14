package campus.ride.transfer.dtos.booking;

import campus.ride.enums.BookingRole;
import campus.ride.enums.BookingStatus;
import campus.ride.transfer.dtos.address.AddressDto;
import java.time.LocalDateTime;

public class BookingResponseDto {
    private Long driveId;
    private Long userId;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private String driverEmail;
    private String driverFirstName;
    private String driverLastName;
    private String fromLocationName;
    private String toLocationName;
    private BookingStatus status;
    private BookingRole role;
    private LocalDateTime requestedAt;
    private LocalDateTime updatedAt;
    private AddressDto pickupAddress;

    public BookingResponseDto() {}

    public BookingResponseDto(Long driveId, Long userId, String userEmail,
                             String userFirstName, String userLastName,
                             String driverEmail, String driverFirstName, String driverLastName,
                             String fromLocationName, String toLocationName,
                             BookingStatus status, BookingRole role,
                             LocalDateTime requestedAt, LocalDateTime updatedAt,
                             AddressDto pickupAddress) {
        this.driveId = driveId;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.driverEmail = driverEmail;
        this.driverFirstName = driverFirstName;
        this.driverLastName = driverLastName;
        this.fromLocationName = fromLocationName;
        this.toLocationName = toLocationName;
        this.status = status;
        this.role = role;
        this.requestedAt = requestedAt;
        this.updatedAt = updatedAt;
        this.pickupAddress = pickupAddress;
    }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserFirstName() { return userFirstName; }
    public void setUserFirstName(String userFirstName) { this.userFirstName = userFirstName; }

    public String getUserLastName() { return userLastName; }
    public void setUserLastName(String userLastName) { this.userLastName = userLastName; }

    public String getDriverEmail() { return driverEmail; }
    public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }

    public String getDriverFirstName() { return driverFirstName; }
    public void setDriverFirstName(String driverFirstName) { this.driverFirstName = driverFirstName; }

    public String getDriverLastName() { return driverLastName; }
    public void setDriverLastName(String driverLastName) { this.driverLastName = driverLastName; }

    public String getFromLocationName() { return fromLocationName; }
    public void setFromLocationName(String fromLocationName) { this.fromLocationName = fromLocationName; }

    public String getToLocationName() { return toLocationName; }
    public void setToLocationName(String toLocationName) { this.toLocationName = toLocationName; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public BookingRole getRole() { return role; }
    public void setRole(BookingRole role) { this.role = role; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public AddressDto getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(AddressDto pickupAddress) { this.pickupAddress = pickupAddress; }
}
