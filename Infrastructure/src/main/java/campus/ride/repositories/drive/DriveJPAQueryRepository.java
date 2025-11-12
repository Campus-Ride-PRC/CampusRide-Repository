package campus.ride.repositories.drive;

import campus.ride.contracts.drive.DriveQueryRepository;
import campus.ride.contracts.drive.DriveRow;
import campus.ride.entities.Drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DriveJPAQueryRepository
        extends JpaRepository<Drive, Long>, DriveQueryRepository {

    @Override
    @Query("""
        SELECT d.id as id,
               d.time as time,
               d.price as price,
               d.availableSeats as availableSeats,
               d.totalNoSeats as totalNoSeats,
               fromAddr.locationName as from_LocationName,
               fromAddr.neighborhood as from_Neighborhood,
               toAddr.locationName as to_LocationName,
               toAddr.neighborhood as to_Neighborhood,
               u.firstName as driver_FirstName,
               u.lastName as driver_LastName,
               v.vehicleModel as vehicle_Model
        FROM Drive d
        JOIN d.from fromAddr
        JOIN d.to toAddr
        JOIN d.driver u
        JOIN d.vehicle v
        """)
    Page<DriveRow> findAllBy(Pageable pageable);
}