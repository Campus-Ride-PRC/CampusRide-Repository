package campus.ride.interfaces;

import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;

public interface UserService {
    UserResponseDto findByEmail(String email);
    UserResponseDto createUser(CreateUserRequestDto request);
}
