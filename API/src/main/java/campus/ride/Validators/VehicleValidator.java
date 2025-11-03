package campus.ride.Validators;

public final class VehicleValidator {
    private VehicleValidator() {}
    public static void softValidate(String model, String plate, String color) {
        // optional: only basic sanity; plate often unique in domain
        if (plate != null && plate.isBlank()) throw new IllegalArgumentException("vehicleLicencePlate cannot be blank");
    }
}