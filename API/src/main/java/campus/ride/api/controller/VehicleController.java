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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicle", description = "Vehicle management API")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
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
    public ResponseEntity<VehicleDto> getByUserId(@PathVariable Long userId) {
        return vehicleService.getByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
