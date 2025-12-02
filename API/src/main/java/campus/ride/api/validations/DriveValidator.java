package campus.ride.api.validations;

import java.time.LocalDateTime;

import campus.ride.transfer.dtos.drive.DriveCreateRequest;

public final class DriveValidator {
    private DriveValidator() {}

    public static void validateForCreate(DriveCreateRequest r) {
        require(r.getFromStreet(), "fromStreet");
        require(r.getFromNumber(), "fromNumber");
        require(r.getFromNeighborhood(), "fromNeighborhood");
        require(r.getToStreet(), "toStreet");
        require(r.getToNumber(), "toNumber");
        require(r.getToNeighborhood(), "toNeighborhood");

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