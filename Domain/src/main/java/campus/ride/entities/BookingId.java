package campus.ride.entities;

import java.io.Serializable;
import java.util.Objects;

public class BookingId implements Serializable {
    private Long driveId;
    private Long userId;

    public BookingId() {}

    public BookingId(Long driveId, Long userId) {
        this.driveId = driveId;
        this.userId = userId;
    }

    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingId that = (BookingId) o;
        return Objects.equals(driveId, that.driveId) &&
               Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(driveId, userId);
    }
}
