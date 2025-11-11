package campus.ride.api.controller;

import campus.ride.api.validations.BookingValidator;
import campus.ride.interfaces.BookingService;
import campus.ride.transfer.dtos.booking.BookingRequestDto;
import campus.ride.transfer.dtos.booking.BookingResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Tag(name = "Booking", description = "Booking management APIs for ride requests and confirmations")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Operation(
            summary = "Request a ride",
            description = "User requests to book a seat on a specific drive"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Booking request created successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid booking request"),
            @ApiResponse(responseCode = "404", description = "Drive or user not found")
    })
    @PostMapping("/request")
    public ResponseEntity<BookingResponseDto> requestRide(@RequestBody BookingRequestDto requestDto) {
        BookingValidator.validateBookingRequest(requestDto);
        BookingResponseDto response = bookingService.requestRide(requestDto);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Accept a booking",
            description = "Driver accepts a pending booking request"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Booking accepted successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Booking cannot be accepted"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PutMapping("/{driveId}/{userId}/accept")
    public ResponseEntity<BookingResponseDto> acceptBooking(
            @Parameter(description = "Drive ID") @PathVariable Long driveId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        BookingResponseDto response = bookingService.acceptBooking(driveId, userId);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Decline a booking",
            description = "Driver declines a pending booking request"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Booking declined successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Booking cannot be declined"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PutMapping("/{driveId}/{userId}/decline")
    public ResponseEntity<BookingResponseDto> declineBooking(
            @Parameter(description = "Drive ID") @PathVariable Long driveId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        BookingResponseDto response = bookingService.declineBooking(driveId, userId);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get bookings for a drive",
            description = "Retrieves all bookings for a specific drive"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved bookings",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            )
    })
    @GetMapping("/drive/{driveId}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByDrive(
            @Parameter(description = "Drive ID") @PathVariable Long driveId) {
        List<BookingResponseDto> bookings = bookingService.getBookingsByDrive(driveId);
        return ResponseEntity.ok(bookings);
    }

    @Operation(
            summary = "Get bookings for a user",
            description = "Retrieves all bookings for a specific user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved bookings",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            )
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUser(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        List<BookingResponseDto> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }

    @Operation(
            summary = "Get pending bookings for a drive",
            description = "Retrieves all pending booking requests for a specific drive"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved pending bookings",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            )
    })
    @GetMapping("/drive/{driveId}/pending")
    public ResponseEntity<List<BookingResponseDto>> getPendingBookings(
            @Parameter(description = "Drive ID") @PathVariable Long driveId) {
        List<BookingResponseDto> bookings = bookingService.getPendingBookingsByDrive(driveId);
        return ResponseEntity.ok(bookings);
    }

    @Operation(
            summary = "Get a specific booking",
            description = "Retrieves details of a specific booking"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Booking found successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            ),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @GetMapping("/{driveId}/{userId}")
    public ResponseEntity<BookingResponseDto> getBooking(
            @Parameter(description = "Drive ID") @PathVariable Long driveId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        BookingResponseDto booking = bookingService.getBooking(driveId, userId);
        return ResponseEntity.ok(booking);
    }
}
