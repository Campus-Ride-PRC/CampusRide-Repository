package campus.ride.api.validations;

public final class VehicleValidator {
    private VehicleValidator() {}
    public static void softValidate(String model, String plate, String color) {
        if (plate != null && plate.isBlank()) throw new IllegalArgumentException("vehicleLicencePlate cannot be blank");
    }
}
