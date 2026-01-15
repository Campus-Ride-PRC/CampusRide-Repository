package campus.ride.repositories.payment;

import campus.ride.contracts.payment.PaymentMethodRepository;
import campus.ride.entities.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodJPARepository extends JpaRepository<PaymentMethod, Long>, PaymentMethodRepository {

    @Override
    List<PaymentMethod> findByUserId(Long userId);

    @Override
    default Optional<PaymentMethod> findDefaultByUserId(Long userId) {
        return findFirstByUserIdAndIsDefaultTrue(userId);
    }

    Optional<PaymentMethod> findFirstByUserIdAndIsDefaultTrue(Long userId);
}
