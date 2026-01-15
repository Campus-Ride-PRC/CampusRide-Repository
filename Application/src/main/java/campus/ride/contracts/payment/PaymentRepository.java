package campus.ride.contracts.payment;

import campus.ride.entities.Payment;
import java.util.Optional;

public interface PaymentRepository {
    Optional<Payment> findById(Long id);

    Optional<Payment> findByBookingId(Long driveId, Long userId);

    Payment save(Payment payment);
}
