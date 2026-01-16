package campus.ride.api.controller;

import campus.ride.interfaces.PaymentMethodService;
import campus.ride.transfer.dtos.payment.PaymentMethodCreateRequest;
import campus.ride.transfer.dtos.payment.PaymentMethodDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/payment-methods")
@Tag(name = "Payment Methods", description = "Management of user payment methods")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @Operation(summary = "Get my payment methods")
    @GetMapping
    public CompletableFuture<ResponseEntity<List<PaymentMethodDto>>> getMyPaymentMethods() {
        return paymentMethodService.getMyPaymentMethods()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Add a new payment method")
    @PostMapping
    public CompletableFuture<ResponseEntity<PaymentMethodDto>> addPaymentMethod(
            @RequestBody @Valid PaymentMethodCreateRequest req) {
        return paymentMethodService.addPaymentMethod(req)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(summary = "Set default payment method")
    @PutMapping("/{id}/default")
    public CompletableFuture<ResponseEntity<Void>> setDefault(
            @Parameter(description = "Payment Method ID") @PathVariable Long id) {
        return paymentMethodService.setDefaultPaymentMethod(id)
                .thenApply(v -> ResponseEntity.ok().build());
    }

    @Operation(summary = "Delete a payment method")
    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> delete(
            @Parameter(description = "Payment Method ID") @PathVariable Long id) {
        return paymentMethodService.deletePaymentMethod(id)
                .thenApply(v -> ResponseEntity.noContent().build());
    }
}
