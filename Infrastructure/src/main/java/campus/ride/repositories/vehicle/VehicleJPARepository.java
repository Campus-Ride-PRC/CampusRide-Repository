package campus.ride.repositories.vehicle;

import campus.ride.entities.Vehicle;
import campus.ride.contracts.vehicle.VehicleRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleJPARepository extends JpaRepository<Vehicle, Long>, VehicleRepository {
    Optional<Vehicle> findByVehicleLicencePlate(String plate);
}