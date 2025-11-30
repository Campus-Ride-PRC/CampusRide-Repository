package campus.ride.api.controller;

import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.EmailRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.dtos.user.LoginRequestDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import campus.ride.transfer.dtos.user.VerificationRequestDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User", description = "User management APIs")
public class UserController {

    private static final Logger logger = LogManager.getLogger(UserController.class);
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Find user by email",
            description = "Retrieves user information based on their email address"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User found successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "400", description = "Invalid email format")
    })
    @PostMapping("/email")
    public CompletableFuture<ResponseEntity<UserResponseDto>> findByEmail(@RequestBody EmailRequestDto request) {
        logger.info("Received request to find user by email");
        logger.debug("Searching for user with email: {}", request.getEmail());
        
        return userService.findByEmail(request.getEmail())
                .thenApply(user -> {
                    logger.info("User found with email: {}", request.getEmail());
                    return ResponseEntity.ok(user);
                });
    }

    @PostMapping("/exists")
    public CompletableFuture<ResponseEntity<Boolean>> userExists(@RequestBody EmailRequestDto request) {
        logger.info("Received request to find user by email with email: {}", request.getEmail());

        return userService.findByEmail(request.getEmail())
                .handle((user, ex) -> {
                    if (ex == null && user != null) {
                        logger.info("Already existing user found with email: {}", request.getEmail());
                        return ResponseEntity.status(HttpStatus.OK).body(true);
                    } else {
                        logger.info("User not found with email: {}", request.getEmail());
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
                    }
                });
    }

    @PostMapping("/register/create")
    public CompletableFuture<ResponseEntity<String>> registerUser(@RequestBody CreateUserRequestDto request) {
       logger.info("Received request to register new user");
        logger.debug("Registering user with email: {}", request.getEmail());

        return userService.registerUser(request)
                .thenApply(message -> {
                    logger.info("Successfully sent verification code for email: {}", request.getEmail());
                    return ResponseEntity.ok(message);
                });
    }
    
    @PostMapping("/register/verify")
    public CompletableFuture<ResponseEntity<UserResponseDto>> verifyUSer(@RequestBody VerificationRequestDto request){
        logger.info("Received request to verify user");
        logger.debug("Verifying user with email: {}", request.getEmail());

        return userService.verifyUser(request)
                .thenApply(user -> {
                    logger.info("User verified with email: {}", request.getEmail());
                    return ResponseEntity.status(HttpStatus.CREATED).body(user);
                });
    }

    @Operation(
            summary = "User login",
            description = "Authenticates a user with email and password"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid email or password"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/login")
    public CompletableFuture<ResponseEntity<UserResponseDto>> login(@RequestBody LoginRequestDto request) {
        logger.info("Received login request for email: {}", request.getEmail());

        return userService.login(request.getEmail(), request.getPassword())
                .thenApply(user -> {
                    logger.info("Login successful for email: {}", request.getEmail());
                    return ResponseEntity.ok(user);
                });
    }

    @Operation(
            summary = "Get current user profile",
            description = "Retrieves the profile of the currently authenticated user"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/me")
    public CompletableFuture<ResponseEntity<UserResponseDto>> getMe() {
        logger.info("Received request to get current user profile");
        return userService.getMe()
                .thenApply(user -> {
                    logger.info("Returning profile for user: {}", user.getEmail());
                    return ResponseEntity.ok(user);
                });
    }

    @Operation(
            summary = "Get all users",
            description = "Retrieves a list of all users"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Users retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            )
    })
    @GetMapping
    public CompletableFuture<ResponseEntity<List<UserResponseDto>>> getAllUsers() {
        logger.info("Received request to get all users");

        return userService.getAllUsers()
                .thenApply(users -> {
                    logger.info("Returning {} users", users.size());
                    return ResponseEntity.ok(users);
                });
    }
}
