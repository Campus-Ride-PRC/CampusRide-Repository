package campus.ride.useCases;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;

@Service
public class StripeService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.public.key}")
    private String stripePublicKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String getPublicKey() {
        return stripePublicKey;
    }

    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount.movePointRight(2).longValue()) // Convert to cents
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();

        return PaymentIntent.create(params);
    }

    /**
     * Creates a Stripe Checkout Session for a ride booking
     * @param amount The amount in the main currency unit (e.g., RON, not bani)
     * @param currency The 3-letter currency code (e.g., "ron", "usd")
     * @param driveId The drive ID for metadata
     * @param userId The user ID for metadata
     * @param pickupAddressId The pickup address ID for metadata
     * @param rideName Description for the line item
     * @param successUrl URL to redirect on successful payment
     * @param cancelUrl URL to redirect on cancelled payment
     * @return The created Stripe Checkout Session
     */
    public Session createCheckoutSession(
            BigDecimal amount,
            String currency,
            Long driveId,
            Long userId,
            Long pickupAddressId,
            String rideName,
            String successUrl,
            String cancelUrl) throws StripeException {

        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(rideName)
                        .setDescription("Campus Ride booking")
                        .build();

        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(currency)
                        .setUnitAmount(amount.movePointRight(2).longValue()) // Convert to smallest unit
                        .setProductData(productData)
                        .build();

        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(priceData)
                        .build();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(lineItem)
                .putMetadata("driveId", String.valueOf(driveId))
                .putMetadata("userId", String.valueOf(userId))
                .putMetadata("pickupAddressId", pickupAddressId != null ? String.valueOf(pickupAddressId) : "")
                .build();

        return Session.create(params);
    }

    /**
     * Retrieves a Stripe Checkout Session by ID
     */
    public Session retrieveSession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }
}
