package campus.ride.useCases;


import campus.ride.Address;
import campus.ride.contracts.Address.AddressRepository;
import campus.ride.interfaces.AddressService;
import org.springframework.scheduling.annotation.Async;
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
    @Async
    @Transactional
    public CompletableFuture<Address> getOrCreate(String street, String number, String neighborhood, String locationName) {
        return CompletableFuture.completedFuture(
                repo.findByStreetAndNumberAndNeighborhood(street, number, neighborhood)
                        .orElseGet(() -> repo.save(new Address(street, number, neighborhood, locationName, null)))
        );
    }
}