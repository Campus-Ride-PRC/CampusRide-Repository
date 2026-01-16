package campus.ride.interfaces;

import campus.ride.transfer.dtos.payment.PaymentMethodCreateRequest;
import campus.ride.transfer.dtos.payment.PaymentMethodDto;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface PaymentMethodService {
    CompletableFuture<List<PaymentMethodDto>> getMyPaymentMethods();

    CompletableFuture<PaymentMethodDto> getPaymentMethodById(Long id);

    CompletableFuture<PaymentMethodDto> addPaymentMethod(PaymentMethodCreateRequest req);

    CompletableFuture<Void> setDefaultPaymentMethod(Long id);

    CompletableFuture<Void> deletePaymentMethod(Long id);
}
