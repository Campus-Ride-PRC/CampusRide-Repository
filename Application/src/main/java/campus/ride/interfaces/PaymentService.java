package campus.ride.interfaces;

import campus.ride.transfer.dtos.payment.PaymentDto;
import java.util.concurrent.CompletableFuture;

public interface PaymentService {
    String createPaymentIntent(Long paymentId);
    // We will need methods here later, possibly for webhooks or status checks
    // For now, payment processing is integrated in BookingService
}
