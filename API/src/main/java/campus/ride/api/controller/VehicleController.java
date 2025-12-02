package campus.ride.api.controller;

import campus.ride.interfaces.VehicleService;
import campus.ride.transfer.dtos.vehicle.VehicleDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

import campus.ride.entities.User;
import campus.ride.contracts.user.UserRepository;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicle", description = "Vehicle management API")
public class VehicleController {

    private final VehicleService vehicleService;
    private final UserRepository userRepository;

    public VehicleController(VehicleService vehicleService, UserRepository userRepository) {
        this.vehicleService = vehicleService;
        this.userRepository = userRepository;
    }

    @Operation(summary = "Get my vehicle", description = "Retrieves the vehicle associated with the current user")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vehicle found",
                    content = @Content(schema = @Schema(implementation = VehicleDto.class))
            ),
            @ApiResponse(responseCode = "404", description = "Vehicle not found for this user")
    })
    @GetMapping("/my-vehicle")
    public CompletableFuture<ResponseEntity<VehicleDto>> getMyVehicle() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return vehicleService.getByUserId(user.getId())
                .thenApply(opt -> opt
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build()));
    }

    @Operation(summary = "Get vehicle by user ID", description = "Retrieves the vehicle associated with a specific user")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vehicle found",
                    content = @Content(schema = @Schema(implementation = VehicleDto.class))
            ),
            @ApiResponse(responseCode = "404", description = "Vehicle not found for this user")
    })
    @GetMapping("/user/{userId}")
    public CompletableFuture<ResponseEntity<VehicleDto>> getByUserId(@PathVariable Long userId) {
        return vehicleService.getByUserId(userId)
                .thenApply(opt -> opt
                        .map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build()));
    }
}
