package campus.ride.api.controller;

import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.user.FriendDto;
import campus.ride.transfer.dtos.user.FriendRequestDto;
import campus.ride.transfer.dtos.user.FriendRequestResponseDto;
import campus.ride.transfer.dtos.user.FriendRequestStatusDto;
import campus.ride.transfer.dtos.user.FriendshipStatusDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Friend", description = "Friend management APIs")
public class FriendController {

    private static final Logger logger = LogManager.getLogger(FriendController.class);

    private final UserService userService;

    public FriendController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Send friend request",
            description = "Sends a friend request to another user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friend request sent successfully"
            ),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/friend-request")
    public CompletableFuture<ResponseEntity<Void>> sendFriendRequest(@RequestBody FriendRequestDto request) {
        logger.info("Received request to send friend request");
        return userService.sendFriendRequest(request)
                .thenApply(aVoid -> ResponseEntity.ok().build());
    }

    @Operation(
            summary = "Get friend count",
            description = "Gets the number of accepted friends for the current user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friend count retrieved successfully"
            )
    })
    @GetMapping("/friends/count")
    public CompletableFuture<ResponseEntity<Long>> getFriendCount() {
        logger.info("Received request to get friend count");
        return userService.getFriendCount()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get pending friend requests",
            description = "Gets all pending friend requests for the current user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Pending friend requests retrieved successfully"
            )
    })
    @GetMapping("/friend-requests/pending")
    public CompletableFuture<ResponseEntity<List<FriendRequestResponseDto>>> getPendingFriendRequests() {
        logger.info("Received request to get pending friend requests");
        return userService.getPendingFriendRequests()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Accept friend request",
            description = "Accepts a pending friend request"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friend request accepted successfully"
            ),
            @ApiResponse(responseCode = "404", description = "Friend request not found")
    })
    @PostMapping("/friend-requests/{requestId}/accept")
    public CompletableFuture<ResponseEntity<Void>> acceptFriendRequest(@PathVariable Long requestId) {
        logger.info("Received request to accept friend request with ID: {}", requestId);
        return userService.acceptFriendRequest(requestId)
                .thenApply(aVoid -> ResponseEntity.ok().build());
    }

    @Operation(
            summary = "Decline friend request",
            description = "Declines a pending friend request"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friend request declined successfully"
            ),
            @ApiResponse(responseCode = "404", description = "Friend request not found")
    })
    @PostMapping("/friend-requests/{requestId}/decline")
    public CompletableFuture<ResponseEntity<Void>> declineFriendRequest(@PathVariable Long requestId) {
        logger.info("Received request to decline friend request with ID: {}", requestId);
        return userService.declineFriendRequest(requestId)
                .thenApply(aVoid -> ResponseEntity.ok().build());
    }

    @Operation(
            summary = "Get friend request status",
            description = "Gets the status of friend requests sent by the current user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friend request status retrieved successfully"
            )
    })
    @GetMapping("/friend-requests/status")
    public CompletableFuture<ResponseEntity<List<FriendRequestStatusDto>>> getFriendRequestStatus() {
        logger.info("Received request to get friend request status");
        return userService.getFriendRequestStatus()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get friends",
            description = "Gets the list of accepted friends for the current user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friends retrieved successfully"
            )
    })
    @GetMapping("/friends")
    public CompletableFuture<ResponseEntity<List<FriendDto>>> getFriends() {
        logger.info("Received request to get friends");
        return userService.getFriends()
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get friendship status",
            description = "Gets the friendship status between the current user and another user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Friendship status retrieved successfully"
            ),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/friendship/{otherUserId}")
    public CompletableFuture<ResponseEntity<FriendshipStatusDto>> getFriendshipStatus(@PathVariable Long otherUserId) {
        logger.info("Received request to get friendship status with user ID: {}", otherUserId);
        return userService.getFriendshipStatus(otherUserId)
                .thenApply(ResponseEntity::ok);
    }
}
