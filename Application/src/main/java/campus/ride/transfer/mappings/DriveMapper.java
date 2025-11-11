package campus.ride.transfer.mappings;

import campus.ride.entities.Address;
import campus.ride.entities.Drive;
import campus.ride.entities.User;
import campus.ride.entities.Vehicle;
import campus.ride.transfer.dtos.drive.DriveDto;

public class DriveMapper {
    public static DriveDto toDto(Drive d) {
        return new DriveDto(
                d.getId(),
                d.getFrom() != null ? d.getFrom().getId() : null,
                d.getTo()   != null ? d.getTo().getId()   : null,
                d.getPrice(),
                d.getTime(),
                d.getAvailableSeats(),
                d.getTotalNoSeats(),
                d.getCreatedAt(),
                d.getDriver() != null ? d.getDriver().getId() : null,
                d.getVehicle() != null ? d.getVehicle().getId() : null
        );
    }


    public static Drive toEntity(DriveDto dto, Address from, Address to, User driver, Vehicle vehicle) {
        Drive d = new Drive(
                from,
                to,
                dto.getPrice(),
                dto.getTime(),
                dto.getAvailableSeats(),
                dto.getTotalNoSeats(),
                dto.getCreatedAt(),
                driver,
                vehicle
        );
        d.setId(dto.getId());
        return d;
    }
}