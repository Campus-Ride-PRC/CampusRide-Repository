package campus.ride.interfaces;

import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.dtos.user.VerificationRequestDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface UserService {
    CompletableFuture<UserResponseDto> findByEmail(String email);
    CompletableFuture<UserResponseDto> login(String email, String password);
    CompletableFuture<List<UserResponseDto>> getAllUsers();
    CompletableFuture<String> registerUser(CreateUserRequestDto request);
    CompletableFuture<UserResponseDto> verifyUser(VerificationRequestDto request);
    CompletableFuture<UserResponseDto> getMe();
}
