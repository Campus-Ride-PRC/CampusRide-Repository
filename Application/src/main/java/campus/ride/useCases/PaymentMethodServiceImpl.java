package campus.ride.useCases;

import campus.ride.contracts.payment.PaymentMethodRepository;
import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.PaymentMethod;
import campus.ride.entities.User;
import campus.ride.interfaces.PaymentMethodService;
import campus.ride.transfer.dtos.payment.PaymentMethodCreateRequest;
import campus.ride.transfer.dtos.payment.PaymentMethodDto;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    public PaymentMethodServiceImpl(PaymentMethodRepository paymentMethodRepository, UserRepository userRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<PaymentMethodDto>> getMyPaymentMethods() {
        User user = getCurrentUser();
        List<PaymentMethod> methods = paymentMethodRepository.findByUserId(user.getId());

        List<PaymentMethodDto> dtos = methods.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return CompletableFuture.completedFuture(dtos);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<PaymentMethodDto> getPaymentMethodById(Long id) {
        PaymentMethod method = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found"));

        User user = getCurrentUser();
        if (!method.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        return CompletableFuture.completedFuture(toDto(method));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<PaymentMethodDto> addPaymentMethod(PaymentMethodCreateRequest req) {
        User user = getCurrentUser();

        // If setAsDefault is true, unset other defaults
        if (Boolean.TRUE.equals(req.getSetAsDefault())) {
            unsetDefaults(user.getId());
        } else {
            // If this is the first method, make it default automatically
            List<PaymentMethod> existing = paymentMethodRepository.findByUserId(user.getId());
            if (existing.isEmpty()) {
                req.setSetAsDefault(true);
            }
        }

        PaymentMethod method = new PaymentMethod(
                user,
                req.getProvider(),
                req.getMethodType(),
                req.getProviderPaymentId(),
                req.getLastFour(),
                req.getSetAsDefault() != null ? req.getSetAsDefault() : false);
        method.setCreatedAt(LocalDateTime.now());

        PaymentMethod saved = paymentMethodRepository.save(method);
        return CompletableFuture.completedFuture(toDto(saved));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Void> setDefaultPaymentMethod(Long id) {
        User user = getCurrentUser();
        PaymentMethod method = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found"));

        if (!method.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        unsetDefaults(user.getId());
        method.setIsDefault(true);
        paymentMethodRepository.save(method);

        return CompletableFuture.completedFuture(null);
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Void> deletePaymentMethod(Long id) {
        User user = getCurrentUser();
        PaymentMethod method = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found"));

        if (!method.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        paymentMethodRepository.delete(method);
        return CompletableFuture.completedFuture(null);
    }

    private void unsetDefaults(Long userId) {
        paymentMethodRepository.findDefaultByUserId(userId).ifPresent(m -> {
            m.setIsDefault(false);
            paymentMethodRepository.save(m);
        });
    }

    private PaymentMethodDto toDto(PaymentMethod entity) {
        return new PaymentMethodDto(
                entity.getId(),
                entity.getUser().getId(),
                entity.getProvider(),
                entity.getMethodType(),
                entity.getLastFour(),
                entity.getIsDefault(),
                entity.getCreatedAt());
    }
}
