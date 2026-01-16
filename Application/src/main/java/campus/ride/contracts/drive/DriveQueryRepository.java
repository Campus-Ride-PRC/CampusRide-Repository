package campus.ride.contracts.drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DriveQueryRepository {
    Page<campus.ride.contracts.drive.DriveRow> findAllBy(Pageable pageable);
    
    @Query("""
        SELECT 
            d.id as id,
            d.time as time,
            d.price as price,
            d.totalNoSeats as totalNoSeats,
            (d.totalNoSeats - COALESCE((SELECT COUNT(b2) FROM Booking b2 WHERE b2.drive.id = d.id AND b2.status = campus.ride.enums.BookingStatus.ACCEPTED AND b2.role = campus.ride.enums.BookingRole.CLIENT), 0)) as availableSeats,
            f.locationName as from_LocationName,
            f.neighborhood as from_Neighborhood,
            f.number as from_Number,
            f.street as from_Street,
            t.locationName as to_LocationName,
            t.neighborhood as to_Neighborhood,
            t.number as to_Number,
            t.street as to_Street,
            dr.firstName as driver_FirstName,
            dr.lastName as driver_LastName,
            v.vehicleModel as vehicle_Model
        FROM Drive d
        JOIN d.from f
        JOIN d.to t
        JOIN d.bookings b
        JOIN b.user dr
        LEFT JOIN dr.vehicle v
        WHERE b.role = campus.ride.enums.BookingRole.DRIVER
        AND dr.id = :driverId
        ORDER BY d.time ASC
    """)
    List<campus.ride.contracts.drive.DriveRow> findAllByDriverId(@Param("driverId") Long driverId);
    
    @Query("""
        SELECT 
            d.id as id,
            d.time as time,
            d.price as price,
            d.totalNoSeats as totalNoSeats,
            (d.totalNoSeats - COALESCE((SELECT COUNT(b2) FROM Booking b2 WHERE b2.drive.id = d.id AND b2.status = campus.ride.enums.BookingStatus.ACCEPTED AND b2.role = campus.ride.enums.BookingRole.CLIENT), 0)) as availableSeats,
            f.locationName as from_LocationName,
            f.neighborhood as from_Neighborhood,
            f.number as from_Number,
            f.street as from_Street,
            t.locationName as to_LocationName,
            t.neighborhood as to_Neighborhood,
            t.number as to_Number,
            t.street as to_Street,
            dr.firstName as driver_FirstName,
            dr.lastName as driver_LastName,
            v.vehicleModel as vehicle_Model
        FROM Drive d
        JOIN d.from f
        JOIN d.to t
        JOIN d.bookings b
        JOIN b.user dr
        LEFT JOIN dr.vehicle v
        WHERE b.role = campus.ride.enums.BookingRole.DRIVER
        AND dr.id = :driverId
        AND d.time < :currentTime
        ORDER BY d.time DESC
    """)
    List<campus.ride.contracts.drive.DriveRow> findPastDrivesByDriverId(@Param("driverId") Long driverId, @Param("currentTime") LocalDateTime currentTime);
    
    @Query("""
        SELECT 
            d.id as id,
            d.time as time,
            d.price as price,
            d.totalNoSeats as totalNoSeats,
            (d.totalNoSeats - COALESCE((SELECT COUNT(b2) FROM Booking b2 WHERE b2.drive.id = d.id AND b2.status = campus.ride.enums.BookingStatus.ACCEPTED AND b2.role = campus.ride.enums.BookingRole.CLIENT), 0)) as availableSeats,
            f.locationName as from_LocationName,
            f.neighborhood as from_Neighborhood,
            f.number as from_Number,
            f.street as from_Street,
            t.locationName as to_LocationName,
            t.neighborhood as to_Neighborhood,
            t.number as to_Number,
            t.street as to_Street,
            dr.firstName as driver_FirstName,
            dr.lastName as driver_LastName,
            v.vehicleModel as vehicle_Model
        FROM Drive d
        JOIN d.from f
        JOIN d.to t
        JOIN d.bookings b
        JOIN b.user dr
        LEFT JOIN dr.vehicle v
        WHERE b.role = campus.ride.enums.BookingRole.DRIVER
        AND b.status = campus.ride.enums.BookingStatus.ACCEPTED
        AND d.time > :currentTime
        AND dr.id != :driverId
        ORDER BY d.time ASC
    """)
    Page<campus.ride.contracts.drive.DriveRow> findUpcomingDrives(@Param("driverId") Long driverId, @Param("currentTime") LocalDateTime currentTime, Pageable pageable);
}
