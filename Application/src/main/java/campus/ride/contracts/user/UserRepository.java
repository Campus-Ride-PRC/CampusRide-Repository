package campus.ride.contracts.user;

import campus.ride.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    User save(User user);
    Optional<User> findByEmailAndPassword(String email, String password);
    List<User> findAll();
}