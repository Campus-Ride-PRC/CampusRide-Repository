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
import java.util.concurrent.CompletableFuture;

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
    public CompletableFuture<ResponseEntity<BookingResponseDto>> requestRide(@RequestBody BookingRequestDto requestDto) {
        BookingValidator.validateBookingRequest(requestDto);
        return bookingService.requestRide(requestDto)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<BookingResponseDto>> acceptBooking(
            @Parameter(description = "Drive ID") @PathVariable Long driveId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        return bookingService.acceptBooking(driveId, userId)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<BookingResponseDto>> declineBooking(
            @Parameter(description = "Drive ID") @PathVariable Long driveId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        return bookingService.declineBooking(driveId, userId)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Cancel a booking",
            description = "User cancels their booking request"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Booking canceled successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Booking cannot be canceled"),
            @ApiResponse(responseCode = "404", description = "Booking not found")
    })
    @PutMapping("/{driveId}/cancel")
    public CompletableFuture<ResponseEntity<BookingResponseDto>> cancelBooking(
            @Parameter(description = "Drive ID") @PathVariable Long driveId) {
        return bookingService.cancelBooking(driveId, null)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<List<BookingResponseDto>>> getBookingsByDrive(
            @Parameter(description = "Drive ID") @PathVariable Long driveId) {
        return bookingService.getBookingsByDrive(driveId)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<List<BookingResponseDto>>> getBookingsByUser(
            @Parameter(description = "User ID") @PathVariable Long userId) {
        return bookingService.getBookingsByUser(userId)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get my bookings",
            description = "Retrieves all bookings for the current authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved bookings",
                    content = @Content(schema = @Schema(implementation = BookingResponseDto.class))
            )
    })
    @GetMapping("/my-bookings")
    public CompletableFuture<ResponseEntity<List<BookingResponseDto>>> getMyBookings() {
        return bookingService.getMyBookings()
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<List<BookingResponseDto>>> getPendingBookings(
            @Parameter(description = "Drive ID") @PathVariable Long driveId) {
        return bookingService.getPendingBookingsByDrive(driveId)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<BookingResponseDto>> getBooking(
            @Parameter(description = "Drive ID") @PathVariable Long driveId,
            @Parameter(description = "User ID") @PathVariable Long userId) {
        return bookingService.getBooking(driveId, userId)
                .thenApply(ResponseEntity::ok);
    }
}
