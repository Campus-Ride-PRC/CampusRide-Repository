package campus.ride.api.validations;

import campus.ride.transfer.dtos.booking.BookingRequestDto;

public class BookingValidator {
    
    public static void validateBookingRequest(BookingRequestDto request) {
        if (request == null) {
            throw new IllegalArgumentException("Booking request cannot be null");
        }
        
        if (request.getDriveId() == null) {
            throw new IllegalArgumentException("Drive ID is required");
        }
        
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        
        if (request.getDriveId() <= 0) {
            throw new IllegalArgumentException("Drive ID must be positive");
        }
        
        if (request.getUserId() <= 0) {
            throw new IllegalArgumentException("User ID must be positive");
        }
    }
}
