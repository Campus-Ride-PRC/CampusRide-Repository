package campus.ride.api.controller;

import campus.ride.interfaces.PaymentService;
import campus.ride.transfer.dtos.payment.CheckoutSessionRequest;
import campus.ride.transfer.dtos.payment.CheckoutSessionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment", description = "Payment processing endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Operation(summary = "Get Stripe Public Key", description = "Returns the Stripe publishable key for frontend")
    @GetMapping("/stripe-key")
    public ResponseEntity<Map<String, String>> getStripePublicKey() {
        String publicKey = paymentService.getStripePublicKey();
        return ResponseEntity.ok(Map.of("publicKey", publicKey));
    }

    @Operation(summary = "Create Checkout Session", description = "Creates a Stripe Checkout Session for ride payment")
    @PostMapping("/create-checkout-session")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(@RequestBody CheckoutSessionRequest request) {
        CheckoutSessionResponse response = paymentService.createCheckoutSession(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Verify Payment Success", description = "Verifies a completed payment and creates the booking")
    @PostMapping("/verify-payment")
    public ResponseEntity<Map<String, String>> verifyPayment(@RequestParam String sessionId) {
        paymentService.handleSuccessfulPayment(sessionId);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Booking created successfully"));
    }

    @Operation(summary = "Initiate Payment", description = "Creates a Stripe PaymentIntent for the given Payment ID and returns the client secret")
    @PostMapping("/{paymentId}/initiate")
    public ResponseEntity<Map<String, String>> initiatePayment(@PathVariable Long paymentId) {
        String clientSecret = paymentService.createPaymentIntent(paymentId);
        return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
    }
}
