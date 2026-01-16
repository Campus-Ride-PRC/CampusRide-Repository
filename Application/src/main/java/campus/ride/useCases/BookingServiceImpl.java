package campus.ride.useCases;

import campus.ride.contracts.address.AddressRepository;
import campus.ride.contracts.booking.BookingRepository;
import campus.ride.contracts.drive.DriveRepository;
import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.Address;
import campus.ride.entities.Booking;
import campus.ride.entities.BookingId;
import campus.ride.entities.Drive;
import campus.ride.entities.User;
import campus.ride.enums.BookingRole;
import campus.ride.enums.BookingStatus;
import campus.ride.exception.BadRequestException;
import campus.ride.exception.ResourceNotFoundException;
import campus.ride.interfaces.BookingService;
import campus.ride.transfer.dtos.booking.BookingRequestDto;
import campus.ride.transfer.dtos.booking.BookingResponseDto;
import campus.ride.transfer.mappings.BookingMapper;
import campus.ride.contracts.payment.PaymentMethodRepository;
import campus.ride.contracts.payment.PaymentRepository;
import campus.ride.entities.Payment;
import campus.ride.entities.PaymentMethod;
import campus.ride.enums.PaymentStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final DriveRepository driveRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
            DriveRepository driveRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            PaymentRepository paymentRepository,
            PaymentMethodRepository paymentMethodRepository) {
        this.bookingRepository = bookingRepository;
        this.driveRepository = driveRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.paymentRepository = paymentRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<BookingResponseDto> requestRide(BookingRequestDto requestDto) {
        // Validate drive exists
        Drive drive = driveRepository.findById(requestDto.getDriveId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Drive not found with id: " + requestDto.getDriveId()));

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Check if user is the driver
        if (drive.getDriver().getId().equals(user.getId())) {
            throw new BadRequestException("Driver cannot request their own ride");
        }

        // Check if booking already exists
        BookingId bookingId = new BookingId(requestDto.getDriveId(), user.getId());
        if (bookingRepository.existsById(bookingId)) {
            throw new BadRequestException("Booking already exists for this drive and user");
        }

        // Check if seats are available
        if (drive.getAvailableSeats() <= 0) {
            throw new BadRequestException("No available seats for this drive");
        }

        // Get pickup address if provided
        Address pickupAddress = null;
        if (requestDto.getPickupAddressId() != null) {
            pickupAddress = addressRepository.findById(requestDto.getPickupAddressId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Pickup address not found with id: " + requestDto.getPickupAddressId()));
        }

        // Create booking with PENDING status
        LocalDateTime now = LocalDateTime.now();
        Booking booking = new Booking(
                requestDto.getDriveId(),
                user.getId(),
                drive,
                user,
                BookingStatus.PENDING,
                BookingRole.CLIENT,
                now,
                now,
                pickupAddress);

        Booking savedBooking = bookingRepository.save(booking);

        // Process payment if method provided
        if (requestDto.getPaymentMethodId() != null) {
            PaymentMethod paymentMethod = paymentMethodRepository.findById(requestDto.getPaymentMethodId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Payment method not found: " + requestDto.getPaymentMethodId()));

            if (!paymentMethod.getUser().getId().equals(user.getId())) {
                throw new BadRequestException("Invalid payment method");
            }

            Payment payment = new Payment(
                    savedBooking,
                    paymentMethod,
                    drive.getPrice(),
                    PaymentStatus.PENDING,
                    null,
                    now);
            payment.setCreatedAt(now);
            paymentRepository.save(payment);
        }

        return CompletableFuture.completedFuture(BookingMapper.toDto(savedBooking));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<BookingResponseDto> acceptBooking(Long driveId, Long userId) {
        BookingId bookingId = new BookingId(driveId, userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!booking.getDrive().getDriver().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the driver can accept bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be accepted");
        }

        Drive drive = booking.getDrive();
        if (drive.getAvailableSeats() <= 0) {
            throw new BadRequestException("No available seats remaining");
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setUpdatedAt(LocalDateTime.now());

        driveRepository.save(drive);

        Booking updatedBooking = bookingRepository.save(booking);
        return CompletableFuture.completedFuture(BookingMapper.toDto(updatedBooking));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<BookingResponseDto> declineBooking(Long driveId, Long userId) {
        BookingId bookingId = new BookingId(driveId, userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!booking.getDrive().getDriver().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the driver can decline bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be declined");
        }

        // Update booking status
        booking.setStatus(BookingStatus.DECLINED);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking updatedBooking = bookingRepository.save(booking);
        return CompletableFuture.completedFuture(BookingMapper.toDto(updatedBooking));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<BookingResponseDto> cancelBooking(Long driveId, Long userId) {
        Long targetUserId = userId;
        if (targetUserId == null) {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            targetUserId = user.getId();
        }

        BookingId bookingId = new BookingId(driveId, targetUserId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELED) {
            throw new BadRequestException("Booking is already canceled");
        }

        if (booking.getStatus() == BookingStatus.ACCEPTED) {
            Drive drive = booking.getDrive();
            driveRepository.save(drive);
        }

        booking.setStatus(BookingStatus.CANCELED);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking updatedBooking = bookingRepository.save(booking);
        return CompletableFuture.completedFuture(BookingMapper.toDto(updatedBooking));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<BookingResponseDto>> getBookingsByDrive(Long driveId) {
        return CompletableFuture.completedFuture(bookingRepository.findByDriveId(driveId)
                .stream()
                .map(BookingMapper::toDto)
                .collect(Collectors.toList()));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<BookingResponseDto>> getBookingsByUser(Long userId) {
        return CompletableFuture.completedFuture(bookingRepository.findByUserIdAndRole(userId, BookingRole.CLIENT)
                .stream()
                .map(BookingMapper::toDto)
                .collect(Collectors.toList()));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<BookingResponseDto>> getMyBookings() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return CompletableFuture.completedFuture(bookingRepository.findByUserIdAndRole(user.getId(), BookingRole.CLIENT)
                .stream()
                .map(BookingMapper::toDto)
                .collect(Collectors.toList()));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<BookingResponseDto>> getPendingBookingsByDrive(Long driveId) {
        return CompletableFuture
                .completedFuture(bookingRepository.findByDriveIdAndStatus(driveId, BookingStatus.PENDING)
                        .stream()
                        .map(BookingMapper::toDto)
                        .collect(Collectors.toList()));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<BookingResponseDto> getBooking(Long driveId, Long userId) {
        BookingId bookingId = new BookingId(driveId, userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return CompletableFuture.completedFuture(BookingMapper.toDto(booking));
    }
}
