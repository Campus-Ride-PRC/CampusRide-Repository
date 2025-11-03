package campus.ride.contracts.user;

import campus.ride.entities.User;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    User save(User user);
}