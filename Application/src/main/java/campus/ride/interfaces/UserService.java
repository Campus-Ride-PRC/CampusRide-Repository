package campus.ride.interfaces;

import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.dtos.user.VerificationRequestDto;
import org.springframework.stereotype.Service;


import java.util.List;

public interface UserService {
    UserResponseDto findByEmail(String email);
    UserResponseDto createUser(CreateUserRequestDto request);
    UserResponseDto login(String email, String password);
    List<UserResponseDto> getAllUsers();
    String registerUser(CreateUserRequestDto request);
    UserResponseDto verifyUser(VerificationRequestDto request);
}
