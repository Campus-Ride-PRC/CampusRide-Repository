package campus.ride.api.controller;

import campus.ride.interfaces.UserService;
import campus.ride.transfer.dtos.EmailRequestDto;
import campus.ride.transfer.dtos.UserResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/email")
    public ResponseEntity<UserResponseDto> findByEmail(@RequestBody EmailRequestDto request) {
        String sanitizedEmail = request.getEmail() != null ? request.getEmail().trim() : null;
        if (sanitizedEmail == null || sanitizedEmail.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<UserResponseDto> userOptional = userService.findByEmail(sanitizedEmail);
        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
