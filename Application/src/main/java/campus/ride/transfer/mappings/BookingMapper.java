package campus.ride.transfer.mappings;

import campus.ride.entities.Booking;
import campus.ride.transfer.dtos.booking.BookingResponseDto;

public class BookingMapper {
    public static BookingResponseDto toDto(Booking booking) {
        if (booking == null) {
            return null;
        }
        
        return new BookingResponseDto(
                booking.getDriveId(),
                booking.getUserId(),
                booking.getUser() != null ? booking.getUser().getEmail() : null,
                booking.getUser() != null ? booking.getUser().getFirstName() : null,
                booking.getUser() != null ? booking.getUser().getLastName() : null,
                booking.getDrive() != null && booking.getDrive().getDriver() != null ? booking.getDrive().getDriver().getEmail() : null,
                booking.getDrive() != null && booking.getDrive().getDriver() != null ? booking.getDrive().getDriver().getFirstName() : null,
                booking.getDrive() != null && booking.getDrive().getDriver() != null ? booking.getDrive().getDriver().getLastName() : null,
                booking.getDrive() != null ? booking.getDrive().getFrom().getLocationName() : null,
                booking.getDrive() != null ? booking.getDrive().getTo().getLocationName() : null,
                booking.getStatus(),
                booking.getRole(),
                booking.getRequestedAt(),
                booking.getUpdatedAt()
        );
    }
}
