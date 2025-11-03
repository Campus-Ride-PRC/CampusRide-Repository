package campus.ride.interfaces;

import java.util.Optional;

import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;

public interface UserService {
    Optional<UserResponseDto> findByEmail(String email);
    UserResponseDto createUser(CreateUserRequestDto request);
}
