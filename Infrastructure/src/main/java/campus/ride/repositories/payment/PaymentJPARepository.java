package campus.ride.repositories.payment;

import campus.ride.contracts.payment.PaymentRepository;
import campus.ride.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentJPARepository extends JpaRepository<Payment, Long>, PaymentRepository {

    @Override
    default Optional<Payment> findByBookingId(Long driveId, Long userId) {
        return findByBookingDriveIdAndBookingUserId(driveId, userId);
    }

    Optional<Payment> findByBookingDriveIdAndBookingUserId(Long driveId, Long userId);
}
