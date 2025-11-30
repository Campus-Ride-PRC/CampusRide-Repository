package campus.ride.interfaces;

import campus.ride.transfer.dtos.booking.BookingRequestDto;
import campus.ride.transfer.dtos.booking.BookingResponseDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface BookingService {
    CompletableFuture<BookingResponseDto> requestRide(BookingRequestDto requestDto);
    CompletableFuture<BookingResponseDto> acceptBooking(Long driveId, Long userId);
    CompletableFuture<BookingResponseDto> declineBooking(Long driveId, Long userId);
    CompletableFuture<BookingResponseDto> cancelBooking(Long driveId, Long userId);
    CompletableFuture<List<BookingResponseDto>> getBookingsByDrive(Long driveId);
    CompletableFuture<List<BookingResponseDto>> getBookingsByUser(Long userId);
    CompletableFuture<List<BookingResponseDto>> getMyBookings();
    CompletableFuture<List<BookingResponseDto>> getPendingBookingsByDrive(Long driveId);
    CompletableFuture<BookingResponseDto> getBooking(Long driveId, Long userId);
}
