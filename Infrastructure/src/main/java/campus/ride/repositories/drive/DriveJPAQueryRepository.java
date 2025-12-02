package campus.ride.repositories.drive;

import campus.ride.contracts.drive.DriveQueryRepository;
import campus.ride.contracts.drive.DriveRow;
import campus.ride.entities.Drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriveJPAQueryRepository
        extends JpaRepository<Drive, Long>, DriveQueryRepository {

    @Override
    @Query("""
        SELECT d.id as id,
               d.time as time,
               d.price as price,
               CAST((d.totalNoSeats - (SELECT COUNT(b2) FROM campus.ride.entities.Booking b2 WHERE b2.drive = d AND b2.status = campus.ride.enums.BookingStatus.ACCEPTED AND b2.role = campus.ride.enums.BookingRole.CLIENT)) as int) as availableSeats,
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
        JOIN d.bookings b
        JOIN b.user u
        LEFT JOIN u.vehicle v
        WHERE b.role = campus.ride.enums.BookingRole.DRIVER
        """)
    Page<DriveRow> findAllBy(Pageable pageable);

    @Override
    @Query("""
        SELECT d.id as id,
               d.time as time,
               d.price as price,
               CAST((d.totalNoSeats - (SELECT COUNT(b2) FROM campus.ride.entities.Booking b2 WHERE b2.drive = d AND b2.status = campus.ride.enums.BookingStatus.ACCEPTED AND b2.role = campus.ride.enums.BookingRole.CLIENT)) as int) as availableSeats,
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
        JOIN d.bookings b
        JOIN b.user u
        LEFT JOIN u.vehicle v
        WHERE b.role = campus.ride.enums.BookingRole.DRIVER
          AND u.id = :driverId
        ORDER BY d.time ASC
        """)
    List<DriveRow> findAllByDriverId(@Param("driverId") Long driverId);
}