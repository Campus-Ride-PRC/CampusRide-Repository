package campus.ride.repositories;

import campus.ride.contracts.UserRepository;
import campus.ride.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepositoryJpa extends JpaRepository<User, Integer>, UserRepository {
    @Override
    Optional<User> findByEmail(String email);
}
