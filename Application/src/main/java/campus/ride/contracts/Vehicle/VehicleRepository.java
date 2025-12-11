package campus.ride.contracts.vehicle;

import campus.ride.entities.Vehicle;
import java.util.Optional;

public interface VehicleRepository {
    Vehicle save(Vehicle v);
    Vehicle saveAndFlush(Vehicle v);
    Optional<Vehicle> findById(Long id);
    Optional<Vehicle> findByVehicleLicencePlate(String plate);
    Optional<Vehicle> findByUserId(Long userId);
}
