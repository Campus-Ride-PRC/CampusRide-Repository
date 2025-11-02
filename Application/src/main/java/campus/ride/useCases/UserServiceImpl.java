package campus.ride.useCases;

import campus.ride.contracts.UserRepository;
import campus.ride.entities.User;
import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.UserResponseDto;
import campus.ride.transfer.mappings.UserMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<UserResponseDto> findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        Optional<User> userOptional = userRepository.findByEmail(email.trim());
        return userOptional.map(UserMapper::toDto);
    }
}
