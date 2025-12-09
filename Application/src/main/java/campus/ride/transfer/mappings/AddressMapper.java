package campus.ride.transfer.mappings;
import campus.ride.entities.Address;
import campus.ride.transfer.dtos.address.AddressDto;
public class AddressMapper {

    public static AddressDto toDto(Address address) {
        if (address == null) {
            return null;
        }

        return new AddressDto(
            address.getId(),
            address.getStreet(),
            address.getNumber(),
            address.getLocationName(),
            address.getNeighborhood()
        );
    }

    public static Address toEntity(AddressDto dto) {
        if (dto == null) {
            return null;
        }
        return new Address(dto.getStreet(), dto.getNumber(), dto.getNeighborhood(), dto.getLocationName());
    }
}
