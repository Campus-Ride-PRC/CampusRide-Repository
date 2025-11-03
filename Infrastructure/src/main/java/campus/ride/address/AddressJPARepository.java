package campus.ride.address;

import campus.ride.Address;
import campus.ride.contracts.Address.AddressRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressJPARepository extends JpaRepository<Address, Long>, AddressRepository {
    Optional<Address> findByStreetAndNumberAndNeighborhood(String street, String number, String neighborhood);
}