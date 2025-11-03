package campus.ride.contracts.Address;

import campus.ride.Address;
import java.util.Optional;

public interface AddressRepository {
    Address save(Address a);
    Optional<Address> findById(Long id);
    Optional<Address> findByStreetAndNumberAndNeighborhood(String street, String number, String neighborhood);
}