package campus.ride.useCases;

import campus.ride.interfaces.PaymentService;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final campus.ride.contracts.payment.PaymentRepository paymentRepository;
    private final campus.ride.contracts.booking.BookingRepository bookingRepository;
    private final StripeService stripeService;

    public PaymentServiceImpl(
            campus.ride.contracts.payment.PaymentRepository paymentRepository,
            campus.ride.contracts.booking.BookingRepository bookingRepository,
            StripeService stripeService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.stripeService = stripeService;
    }

    @Override
    public String createPaymentIntent(Long paymentId) {
        var payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        try {
            var intent = stripeService.createPaymentIntent(payment.getAmount(), "usd");
            payment.setTransactionId(intent.getId());
            paymentRepository.save(payment);
            return intent.getClientSecret();
        } catch (Exception e) {
            throw new RuntimeException("Stripe error", e);
        }
    }
}
