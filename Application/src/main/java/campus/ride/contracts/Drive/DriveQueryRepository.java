package campus.ride.contracts.drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DriveQueryRepository {
    Page<campus.ride.contracts.drive.DriveRow> findAllBy(Pageable pageable);
    
    @Query("""
        SELECT 
            d.id as id,
            d.time as time,
            d.price as price,
            d.availableSeats as availableSeats,
            d.totalNoSeats as totalNoSeats,
            f.locationName as from_LocationName,
            f.neighborhood as from_Neighborhood,
            t.locationName as to_LocationName,
            t.neighborhood as to_Neighborhood,
            dr.firstName as driver_FirstName,
            dr.lastName as driver_LastName,
            v.vehicleModel as vehicle_Model
        FROM Drive d
        JOIN d.from f
        JOIN d.to t
        JOIN d.driver dr
        JOIN d.vehicle v
        WHERE dr.id = :driverId
        ORDER BY d.time ASC
    """)
    List<campus.ride.contracts.drive.DriveRow> findAllByDriverId(@Param("driverId") Long driverId);
}
