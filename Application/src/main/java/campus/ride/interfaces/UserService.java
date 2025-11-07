package campus.ride.interfaces;

import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.dtos.user.VerificationRequestDto;
import org.springframework.stereotype.Service;


public interface UserService {
    UserResponseDto findByEmail(String email);
    String registerUser(CreateUserRequestDto request);
    UserResponseDto verifyUser(VerificationRequestDto request);
}
