package campus.ride.transfer.mappings;

import campus.ride.entities.Vehicle;
import campus.ride.transfer.dtos.vehicle.VehicleDto;

public final class VehicleMapper {
    private VehicleMapper() {}

    public static VehicleDto toDto(Vehicle entity) {
        if (entity == null) return null;
        return new VehicleDto(
                entity.getId(),
                entity.getVehicleModel(),
                entity.getVehicleLicencePlate(),
                entity.getVehicleColor(),
                entity.getUser() != null ? entity.getUser().getId() : null
        );
    }

    public static Vehicle toEntity(VehicleDto dto) {
        if (dto == null) return null;
        Vehicle v = new Vehicle(dto.getModel(), dto.getVehicleLicencePlate(), dto.getColor(), dto.getUserId());
        v.setId(dto.getId());
        return v;
    }
}
