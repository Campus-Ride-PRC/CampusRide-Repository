package campus.ride.Validators;

public final class AddressValidator {
    private AddressValidator() {}
    public static void requireCore(String street, String number, String neighborhood) {
        if (street == null || street.isBlank()) throw new IllegalArgumentException("street is required");
        if (number == null || number.isBlank()) throw new IllegalArgumentException("number is required");
        if (neighborhood == null || neighborhood.isBlank()) throw new IllegalArgumentException("neighborhood is required");
    }
}