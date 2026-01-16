package campus.ride.useCases;

import campus.ride.contracts.address.AddressRepository;
import campus.ride.contracts.booking.BookingRepository;
import campus.ride.contracts.drive.DriveRepository;
import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.*;
import campus.ride.enums.BookingRole;
import campus.ride.enums.BookingStatus;
import campus.ride.enums.PaymentStatus;
import campus.ride.exception.BadRequestException;
import campus.ride.exception.ResourceNotFoundException;
import campus.ride.interfaces.PaymentService;
import campus.ride.transfer.dtos.payment.CheckoutSessionRequest;
import campus.ride.transfer.dtos.payment.CheckoutSessionResponse;
import campus.ride.contracts.payment.PaymentRepository;
import campus.ride.contracts.payment.PaymentMethodRepository;
import com.stripe.model.checkout.Session;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final campus.ride.contracts.payment.PaymentRepository paymentRepository;
    private final campus.ride.contracts.booking.BookingRepository bookingRepository;
    private final DriveRepository driveRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final StripeService stripeService;

    public PaymentServiceImpl(
            campus.ride.contracts.payment.PaymentRepository paymentRepository,
            campus.ride.contracts.booking.BookingRepository bookingRepository,
            DriveRepository driveRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            PaymentMethodRepository paymentMethodRepository,
            StripeService stripeService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.driveRepository = driveRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.stripeService = stripeService;
    }

    @Override
    public String createPaymentIntent(Long paymentId) {
        var payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        try {
            var intent = stripeService.createPaymentIntent(payment.getAmount(), "ron");
            payment.setTransactionId(intent.getId());
            paymentRepository.save(payment);
            return intent.getClientSecret();
        } catch (Exception e) {
            throw new RuntimeException("Stripe error", e);
        }
    }

    @Override
    public CheckoutSessionResponse createCheckoutSession(CheckoutSessionRequest request) {
        // Get current user
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get drive
        Drive drive = driveRepository.findById(request.getDriveId())
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found"));

        // Validate user is not the driver
        if (drive.getDriver().getId().equals(user.getId())) {
            throw new BadRequestException("Cannot book your own ride");
        }

        // Check if already booked
        BookingId bookingId = new BookingId(request.getDriveId(), user.getId());
        if (bookingRepository.existsById(bookingId)) {
            throw new BadRequestException("You have already booked this ride");
        }

        // Check available seats
        if (drive.getAvailableSeats() <= 0) {
            throw new BadRequestException("No available seats");
        }

        // Build ride description
        String rideName = String.format("Ride: %s → %s", 
                drive.getFrom().getLocationName(), 
                drive.getTo().getLocationName());

        try {
            Session session = stripeService.createCheckoutSession(
                    drive.getPrice(),
                    "ron", // Romanian Lei
                    request.getDriveId(),
                    user.getId(),
                    request.getPickupAddressId(),
                    rideName,
                    request.getSuccessUrl(),
                    request.getCancelUrl()
            );

            return new CheckoutSessionResponse(session.getId(), session.getUrl());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create checkout session: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void handleSuccessfulPayment(String sessionId) {
        try {
            Session session = stripeService.retrieveSession(sessionId);
            
            // Verify payment was successful
            if (!"complete".equals(session.getStatus())) {
                throw new BadRequestException("Payment not completed");
            }

            // Extract metadata
            Long driveId = Long.parseLong(session.getMetadata().get("driveId"));
            Long userId = Long.parseLong(session.getMetadata().get("userId"));
            String pickupAddressIdStr = session.getMetadata().get("pickupAddressId");
            Long pickupAddressId = (pickupAddressIdStr != null && !pickupAddressIdStr.isEmpty()) 
                    ? Long.parseLong(pickupAddressIdStr) 
                    : null;

            // Check if booking already exists (avoid double booking)
            BookingId bookingId = new BookingId(driveId, userId);
            if (bookingRepository.existsById(bookingId)) {
                // Booking already created, possibly from webhook - skip
                return;
            }

            // Get entities
            Drive drive = driveRepository.findById(driveId)
                    .orElseThrow(() -> new ResourceNotFoundException("Drive not found"));
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            Address pickupAddress = null;
            if (pickupAddressId != null) {
                pickupAddress = addressRepository.findById(pickupAddressId)
                        .orElseThrow(() -> new ResourceNotFoundException("Pickup address not found"));
            }

            // Create booking
            LocalDateTime now = LocalDateTime.now();
            Booking booking = new Booking(
                    driveId,
                    userId,
                    drive,
                    user,
                    BookingStatus.PENDING,
                    BookingRole.CLIENT,
                    now,
                    now,
                    pickupAddress
            );

            bookingRepository.save(booking);

        } catch (Exception e) {
            throw new RuntimeException("Failed to handle payment: " + e.getMessage(), e);
        }
    }

    @Override
    public String getStripePublicKey() {
        return stripeService.getPublicKey();
    }
}
