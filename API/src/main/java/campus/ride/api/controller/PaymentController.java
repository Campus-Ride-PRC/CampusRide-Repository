package campus.ride.api.controller;

import campus.ride.interfaces.PaymentService;
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

    @Operation(summary = "Initiate Payment", description = "Creates a Stripe PaymentIntent for the given Payment ID and returns the client secret")
    @PostMapping("/{paymentId}/initiate")
    public ResponseEntity<Map<String, String>> initiatePayment(@PathVariable Long paymentId) {
        String clientSecret = paymentService.createPaymentIntent(paymentId);
        return ResponseEntity.ok(Map.of("clientSecret", clientSecret));
    }
}
