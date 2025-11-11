package campus.ride.repositories.vehicle;

import campus.ride.entities.Vehicle;
import campus.ride.contracts.vehicle.VehicleRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleJPARepository extends JpaRepository<Vehicle, Long>, VehicleRepository {
    Optional<Vehicle> findByVehicleLicencePlate(String plate);
    
    @Query("SELECT v FROM Vehicle v WHERE v.user.id = :userId")
    Optional<Vehicle> findByUserId(@Param("userId") Long userId);
}