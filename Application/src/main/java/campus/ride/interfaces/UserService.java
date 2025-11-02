package campus.ride.interfaces;

import campus.ride.transfer.dtos.UserResponseDto;
import java.util.Optional;

public interface UserService {
    Optional<UserResponseDto> findByEmail(String email);
}
