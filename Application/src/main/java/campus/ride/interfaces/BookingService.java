package campus.ride.interfaces;

import campus.ride.transfer.dtos.booking.BookingRequestDto;
import campus.ride.transfer.dtos.booking.BookingResponseDto;

import java.util.List;

public interface BookingService {
    BookingResponseDto requestRide(BookingRequestDto requestDto);
    BookingResponseDto acceptBooking(Long driveId, Long userId);
    BookingResponseDto declineBooking(Long driveId, Long userId);
    List<BookingResponseDto> getBookingsByDrive(Long driveId);
    List<BookingResponseDto> getBookingsByUser(Long userId);
    List<BookingResponseDto> getPendingBookingsByDrive(Long driveId);
    BookingResponseDto getBooking(Long driveId, Long userId);
}
