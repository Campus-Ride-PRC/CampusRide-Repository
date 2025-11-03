package campus.ride.repositories.user;

import campus.ride.contracts.user.UserRepository;
import campus.ride.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepositoryJpa extends JpaRepository<User, Integer>, UserRepository {
    @Override
    Optional<User> findByEmail(String email);
}
