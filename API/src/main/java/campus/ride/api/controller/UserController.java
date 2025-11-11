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
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<UserResponseDto> findByEmail(@RequestBody EmailRequestDto request) {
        logger.info("Received request to find user by email");
        logger.debug("Searching for user with email: {}", request.getEmail());
        
        UserResponseDto user = userService.findByEmail(request.getEmail());
        
        logger.info("User found with email: {}", request.getEmail());
        return ResponseEntity.ok(user);
    }

    @Operation(
            summary = "Create new user",
            description = "Creates a new user account with the provided information"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "User created successfully",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid user data"),
            @ApiResponse(responseCode = "409", description = "User already exists")
    })
    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestBody CreateUserRequestDto request) {
        logger.info("Received request to create new user");
        logger.debug("Creating user with email: {}", request.getEmail());
        
        UserResponseDto createdUser = userService.createUser(request);
        
        logger.info("Successfully created user with email: {}", createdUser.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
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
    public ResponseEntity<UserResponseDto> login(@RequestBody LoginRequestDto request) {
        logger.info("Received login request for email: {}", request.getEmail());

        UserResponseDto user = userService.login(request.getEmail(), request.getPassword());

        logger.info("Login successful for email: {}", request.getEmail());
        return ResponseEntity.ok(user);
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
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        logger.info("Received request to get all users");

        List<UserResponseDto> users = userService.getAllUsers();

        logger.info("Returning {} users", users.size());
        return ResponseEntity.ok(users);
    }
}
