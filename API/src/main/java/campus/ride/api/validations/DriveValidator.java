package campus.ride.api.validations;

import java.time.LocalDateTime;

import campus.ride.transfer.dtos.drive.DriveCreateRequest;

public final class DriveValidator {
    private DriveValidator() {}

    public static void validateForCreate(DriveCreateRequest r) {
        if (r.getFromAddress() == null) throw new IllegalArgumentException("fromAddress is required");
        if (r.getToAddress() == null) throw new IllegalArgumentException("toAddress is required");
        
        require(r.getFromAddress().getStreet(), "fromAddress.street");
        require(r.getFromAddress().getNumber(), "fromAddress.number");
        require(r.getFromAddress().getNeighborhood(), "fromAddress.neighborhood");
        require(r.getToAddress().getStreet(), "toAddress.street");
        require(r.getToAddress().getNumber(), "toAddress.number");
        require(r.getToAddress().getNeighborhood(), "toAddress.neighborhood");

        // userId is handled via SecurityContext
        // availableSeats defaults to totalNoSeats on creation

        if (r.getPrice() == null || r.getPrice().signum() <= 0) throw new IllegalArgumentException("price must be > 0");
        if (r.getDay() == null) throw new IllegalArgumentException("day is required");
        if (r.getHour() == null) throw new IllegalArgumentException("hour is required");
        if (r.getTotalNoSeats() == null) throw new IllegalArgumentException("totalNoSeats is required");

        if (r.getTotalNoSeats() <= 0) throw new IllegalArgumentException("totalNoSeats must be > 0");

        var time = LocalDateTime.of(r.getDay(), r.getHour());
        if (!time.isAfter(LocalDateTime.now())) throw new IllegalArgumentException("time must be in the future");
    }

    private static void require(String v, String name) {
        if (v == null || v.isBlank()) throw new IllegalArgumentException(name + " is required");
    }
}