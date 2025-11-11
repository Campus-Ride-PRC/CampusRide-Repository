package campus.ride.interfaces;

import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto findByEmail(String email);
    UserResponseDto createUser(CreateUserRequestDto request);
    UserResponseDto login(String email, String password);
    List<UserResponseDto> getAllUsers();
}
