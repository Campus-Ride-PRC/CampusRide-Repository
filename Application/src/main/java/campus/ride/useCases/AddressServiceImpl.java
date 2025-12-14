package campus.ride.useCases;
import campus.ride.contracts.address.AddressRepository;
import campus.ride.entities.Address;
import campus.ride.interfaces.AddressService;
import campus.ride.transfer.dtos.address.AddressDto;
import campus.ride.transfer.mappings.AddressMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository repo;

    public AddressServiceImpl(AddressRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional
    public CompletableFuture<AddressDto> getOrCreate(String street, String number, String neighborhood, String locationName, String city, Double latitude, Double longitude) {
        Address address = repo.findByStreetAndNumberAndNeighborhood(street, number, neighborhood)
                .map(existing -> {
                    if (latitude != null && existing.getLatitude() == null) {
                        existing.setLatitude(latitude);
                    }
                    if (longitude != null && existing.getLongitude() == null) {
                        existing.setLongitude(longitude);
                    }
                    if (locationName != null && existing.getLocationName() == null) {
                        existing.setLocationName(locationName);
                    }
                    if (city != null && existing.getCity() == null) {
                        existing.setCity(city);
                    }
                    return repo.save(existing);
                })
                .orElseGet(() -> {
                    Address newAddress = new Address(street, number, neighborhood, locationName, city, latitude, longitude);
                    return repo.saveAndFlush(newAddress);
                });
        return CompletableFuture.completedFuture(AddressMapper.toDto(address));
    }
}