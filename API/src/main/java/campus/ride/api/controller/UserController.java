package campus.ride.api.controller;

import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.EmailRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;

import campus.ride.transfer.dtos.user.VerificationRequestDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LogManager.getLogger(UserController.class);
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/email")
    public ResponseEntity<UserResponseDto> findByEmail(@RequestBody EmailRequestDto request) {
        logger.info("Received request to find user by email");
        logger.debug("Searching for user with email: {}", request.getEmail());
        
        UserResponseDto user = userService.findByEmail(request.getEmail());
        
        logger.info("User found with email: {}", request.getEmail());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody CreateUserRequestDto request) {
       logger.info("Received request to register new user");
        logger.debug("Registering user with email: {}", request.getEmail());

        String message = userService.registerUser(request);

        logger.info("Successfully sent verification code for email: {}", request.getEmail());
        return ResponseEntity.ok(message);
    }

    @PostMapping("/verify")
    public ResponseEntity<UserResponseDto> verifyUSer(@RequestBody VerificationRequestDto request){
        logger.info("Received request to verify user");
        logger.debug("Verifying user with email: {}", request.getEmail());

        UserResponseDto user = userService.verifyUser(request);
        logger.info("User verified with email: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
