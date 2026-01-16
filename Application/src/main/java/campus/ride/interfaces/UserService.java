package campus.ride.interfaces;

import campus.ride.transfer.dtos.user.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface UserService {
    CompletableFuture<UserResponseDto> findByEmail(String email);
    CompletableFuture<UserResponseDto> login(String email, String password);
    CompletableFuture<List<UserResponseDto>> getAllUsers();
    CompletableFuture<String> registerUser(CreateUserRequestDto request);
    CompletableFuture<UserResponseDto> verifyUser(VerificationRequestDto request);
    CompletableFuture<UserResponseDto> getMe();
    CompletableFuture<Void> sendFriendRequest(FriendRequestDto request);
    CompletableFuture<Long> getFriendCount();
    CompletableFuture<List<FriendRequestResponseDto>> getPendingFriendRequests();
    CompletableFuture<Void> acceptFriendRequest(Long requestId);
    CompletableFuture<Void> declineFriendRequest(Long requestId);
    CompletableFuture<List<FriendRequestStatusDto>> getFriendRequestStatus();
    CompletableFuture<List<FriendDto>> getFriends();
    CompletableFuture<FriendshipStatusDto> getFriendshipStatus(Long otherUserId);
    CompletableFuture<String> forgotPasswordVerifyCode(EmailRequestDto request);
    CompletableFuture<ResetPasswordRequestDto> verifyVerificationCode(VerificationRequestDto request);
    CompletableFuture<UserResponseDto> resetPassword(ResetPasswordRequestDto request);
}
