package campus.ride.contracts.address;

import java.util.Optional;

import campus.ride.entities.Address;

public interface AddressRepository {
    Address save(Address a);
    Address saveAndFlush(Address a);
    void flush();
    Optional<Address> findById(Long id);
    Optional<Address> findByStreetAndNumberAndNeighborhood(String street, String number, String neighborhood);
}
