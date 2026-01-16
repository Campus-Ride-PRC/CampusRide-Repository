package campus.ride.contracts.payment;

import campus.ride.entities.PaymentMethod;
import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository {
    Optional<PaymentMethod> findById(Long id);

    List<PaymentMethod> findByUserId(Long userId);

    Optional<PaymentMethod> findDefaultByUserId(Long userId);

    PaymentMethod save(PaymentMethod method);

    void delete(PaymentMethod method);
}
