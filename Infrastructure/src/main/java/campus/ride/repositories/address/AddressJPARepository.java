package campus.ride.repositories.address;

import campus.ride.contracts.address.AddressRepository;
import campus.ride.entities.Address;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressJPARepository extends JpaRepository<Address, Long>, AddressRepository {
    Optional<Address> findByStreetAndNumberAndNeighborhood(String street, String number, String neighborhood);
}