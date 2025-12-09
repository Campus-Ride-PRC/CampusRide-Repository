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
    public CompletableFuture<AddressDto> getOrCreate(String street, String number, String neighborhood, String locationName, String city) {
        Address address = repo.findByStreetAndNumberAndNeighborhood(street, number, neighborhood)
                .orElseGet(() -> {
                    Address newAddress = new Address(street, number, neighborhood, locationName, city);
                    Address saved = repo.saveAndFlush(newAddress);
                    return saved;
                });
        return CompletableFuture.completedFuture(AddressMapper.toDto(address));
    }
}