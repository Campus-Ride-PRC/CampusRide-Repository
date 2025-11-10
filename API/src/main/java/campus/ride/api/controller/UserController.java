package campus.ride.api.controller;

import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.EmailRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;

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

    @PostMapping("/exists")
    public ResponseEntity<Boolean> userExists(@RequestBody EmailRequestDto request) {
        logger.info("Received request to find user by email with email: {}", request.getEmail());

        try{
            var user = userService.findByEmail(request.getEmail());
            logger.info("Already existing user found with email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body(true);
        }catch (Exception e){
            logger.info("User not found with email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
    }

    @PostMapping("/register/create")
    public ResponseEntity<String> registerUser(@RequestBody CreateUserRequestDto request) {
       logger.info("Received request to register new user");
        logger.debug("Registering user with email: {}", request.getEmail());

        String message = userService.registerUser(request);

        logger.info("Successfully sent verification code for email: {}", request.getEmail());
        return ResponseEntity.ok(message);
    }
    
    @PostMapping("/register/verify")
    public ResponseEntity<UserResponseDto> verifyUSer(@RequestBody VerificationRequestDto request){
        logger.info("Received request to verify user");
        logger.debug("Verifying user with email: {}", request.getEmail());

        UserResponseDto user = userService.verifyUser(request);
        logger.info("User verified with email: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
