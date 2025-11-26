package campus.ride.transfer.mappings;

import campus.ride.entities.Address;
import campus.ride.entities.Drive;
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


    public static Drive toEntity(DriveDto dto, Address from, Address to) {
        Drive d = new Drive(
                from,
                to,
                dto.getPrice(),
                dto.getTime(),
                dto.getTotalNoSeats(),
                dto.getCreatedAt()
        );
        d.setId(dto.getId());
        return d;
    }
}