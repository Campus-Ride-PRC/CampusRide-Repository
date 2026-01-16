package campus.ride.contracts.booking;

import campus.ride.entities.Booking;
import campus.ride.entities.BookingId;
import campus.ride.enums.BookingRole;
import campus.ride.enums.BookingStatus;

import java.util.List;
import java.util.Optional;

public interface BookingRepository {
    Booking save(Booking booking);

    Optional<Booking> findById(BookingId id);

    List<Booking> findByDriveId(Long driveId);

    List<Booking> findByUserId(Long userId);

    List<Booking> findByUserIdAndRole(Long userId, BookingRole role);

    List<Booking> findByDriveIdAndStatus(Long driveId, BookingStatus status);

    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    boolean existsById(BookingId id);

    void deleteById(BookingId id);
}
