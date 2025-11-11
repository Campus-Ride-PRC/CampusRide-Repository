package campus.ride.entities;

import campus.ride.enums.BookingRole;
import campus.ride.enums.BookingStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "bookings",
        indexes = {
                @Index(name = "ix_bookings_user_id", columnList = "user_id"),
                @Index(name = "ix_bookings_drive_id", columnList = "drive_id"),
                @Index(name = "ix_bookings_status", columnList = "status")
        }
)
@IdClass(BookingId.class)
public class Booking {
    @Id
    @Column(name = "drive_id", nullable = false)
    private Long driveId;

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "drive_id", nullable = false, insertable = false, updatable = false)
    private Drive drive;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, insertable = false, updatable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingRole role;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Booking() {}

    public Booking(Long driveId, Long userId, Drive drive, User user, 
                   BookingStatus status, BookingRole role, 
                   LocalDateTime requestedAt, LocalDateTime updatedAt) {
        this.driveId = driveId;
        this.userId = userId;
        this.drive = drive;
        this.user = user;
        this.status = status;
        this.role = role;
        this.requestedAt = requestedAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Drive getDrive() { return drive; }
    public void setDrive(Drive drive) { this.drive = drive; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public BookingRole getRole() { return role; }
    public void setRole(BookingRole role) { this.role = role; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
