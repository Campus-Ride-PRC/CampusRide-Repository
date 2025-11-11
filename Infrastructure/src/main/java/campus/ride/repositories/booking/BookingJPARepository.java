package campus.ride.repositories.booking;

import campus.ride.contracts.booking.BookingRepository;
import campus.ride.entities.Booking;
import campus.ride.entities.BookingId;
import campus.ride.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingJPARepository extends JpaRepository<Booking, BookingId>, BookingRepository {
    List<Booking> findByDriveId(Long driveId);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByDriveIdAndStatus(Long driveId, BookingStatus status);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
}
