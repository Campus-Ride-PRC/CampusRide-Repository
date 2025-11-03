package campus.ride.contracts.Vehicle;

import campus.ride.Vehicle;
import java.util.Optional;

public interface VehicleRepository {
    Vehicle save(Vehicle v);
    Optional<Vehicle> findById(Long id);
    Optional<Vehicle> findByVehicleLicencePlate(String plate);
}