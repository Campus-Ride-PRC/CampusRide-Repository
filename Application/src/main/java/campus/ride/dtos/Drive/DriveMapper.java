package campus.ride.dtos.Drive;

import campus.ride.Address;
import campus.ride.Drive;
import campus.ride.dtos.Drive.DriveDTO;

public class DriveMapper {
    public static DriveDTO toDto(Drive d) {
        return new DriveDTO(
                d.getId(),
                d.getFrom() != null ? d.getFrom().getId() : null,
                d.getTo()   != null ? d.getTo().getId()   : null,
                d.getPrice(),
                d.getTime(),
                d.getAvailableSeats(),
                d.getTotalNoSeats(),
                d.getCreatedAt()
        );
    }


    public static Drive toEntity(DriveDTO dto, Address from, Address to) {
        Drive d = new Drive(
                from,
                to,
                dto.getPrice(),
                dto.getTime(),
                dto.getAvailableSeats(),
                dto.getTotalNoSeats(),
                dto.getCreatedAt()
        );
        d.setId(dto.getId());
        return d;
    }
}