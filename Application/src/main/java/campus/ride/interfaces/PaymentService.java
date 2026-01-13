package campus.ride.interfaces;

import campus.ride.transfer.dtos.payment.PaymentDto;
import campus.ride.transfer.dtos.payment.CheckoutSessionRequest;
import campus.ride.transfer.dtos.payment.CheckoutSessionResponse;
import java.util.concurrent.CompletableFuture;

public interface PaymentService {
    String createPaymentIntent(Long paymentId);
    
    /**
     * Creates a Stripe Checkout Session for a ride booking
     */
    CheckoutSessionResponse createCheckoutSession(CheckoutSessionRequest request);
    
    /**
     * Verifies a completed checkout session and creates the booking
     */
    void handleSuccessfulPayment(String sessionId);
    
    /**
     * Gets the Stripe public key for frontend
     */
    String getStripePublicKey();
}
