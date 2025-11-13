package campus.ride.api.controller;

import campus.ride.transfer.dtos.address.AddressDto;
import campus.ride.transfer.dtos.vehicle.VehicleDto;
import campus.ride.interfaces.AddressService;
import campus.ride.interfaces.VehicleService;
import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveCreateRequest;
import campus.ride.transfer.dtos.drive.DriveDto;
import campus.ride.transfer.dtos.drive.DrivePageDto;
import campus.ride.interfaces.DriveService;

import campus.ride.api.validations.DriveValidator;
import campus.ride.api.validations.AddressValidator;
import campus.ride.api.validations.VehicleValidator;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/drives")
@Tag(name = "Drive", description = "Drive/Ride management APIs for creating and viewing available rides")
public class DriveController {

    private final DriveService driveService;
    private final AddressService addressService;
    private final VehicleService vehicleService;

    public DriveController(DriveService driveService,
                           AddressService addressService,
                           VehicleService vehicleService) {
        this.driveService = driveService;
        this.addressService = addressService;
        this.vehicleService = vehicleService;
    }

    @Operation(
            summary = "Get all drives",
            description = "Retrieves a paginated list of all available drives"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved drives",
                    content = @Content(schema = @Schema(implementation = Page.class))
            )
    })
    @GetMapping
    public Page<DriveCardDto> getAll(
            @Parameter(description = "Pagination parameters (page, size, sort)")
            Pageable pageable) {
        return driveService.getDriverCards(pageable);
    }



    @Operation(
            summary = "Get drive by ID",
            description = "Retrieves detailed information about a specific drive"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Drive found successfully",
                    content = @Content(schema = @Schema(implementation = DrivePageDto.class))
            ),
            @ApiResponse(responseCode = "404", description = "Drive not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DrivePageDto> getById(
            @Parameter(description = "Drive ID") @PathVariable Long id) {
        DrivePageDto dto = driveService.getDrivePageById(id);
        return ResponseEntity.ok(dto);
    }

    @Operation(
            summary = "Get drive cards",
            description = "Retrieves a paginated list of drive summary cards for display"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved drive cards",
                    content = @Content(schema = @Schema(implementation = Page.class))
            )
    })
    @GetMapping("/cards")
    public Page<DriveCardDto> getCards(
            @Parameter(description = "Pagination parameters (page, size, sort)")
            Pageable pageable) {
        return driveService.getDriverCards(pageable);
    }

    @Operation(
            summary = "Get drives by driver ID",
            description = "Retrieves all drives for a specific driver"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved driver's drives",
                    content = @Content(schema = @Schema(implementation = DriveCardDto.class))
            )
    })
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<java.util.List<DriveCardDto>> getDrivesByDriver(
            @Parameter(description = "Driver ID") @PathVariable Long driverId) {
        java.util.List<DriveCardDto> drives = driveService.getDrivesByDriverId(driverId);
        return ResponseEntity.ok(drives);
    }

    @Operation(
            summary = "Create new drive",
            description = "Creates a new ride/drive listing with origin, destination, time, and vehicle details"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Drive created successfully",
                    content = @Content(schema = @Schema(implementation = DriveDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid drive data"),
            @ApiResponse(responseCode = "422", description = "Validation failed")
    })
    @PostMapping
    public ResponseEntity<DriveDto> create(@RequestBody DriveCreateRequest req) {
        DriveValidator.validateForCreate(req);

        AddressValidator.requireCore(req.getFromStreet(), req.getFromNumber(), req.getFromNeighborhood());
        AddressValidator.requireCore(req.getToStreet(),   req.getToNumber(),   req.getToNeighborhood());

        VehicleValidator.softValidate(req.getVehicleModel(), req.getVehicleLicencePlate(), req.getVehicleColor());

        LocalDateTime time = LocalDateTime.of(req.getDay(), req.getHour());

        AddressDto from = addressService.getOrCreate(
                req.getFromStreet(), req.getFromNumber(), req.getFromNeighborhood(), req.getFromLocationName()
        ).join();
        
        AddressDto to = addressService.getOrCreate(
                req.getToStreet(), req.getToNumber(), req.getToNeighborhood(), req.getToLocationName()
        ).join();

        if (from.getId().equals(to.getId())) {
            throw new IllegalArgumentException("From and To addresses must be different.");
        }

        VehicleDto vehicle = vehicleService.getOrCreate(
                req.getVehicleModel(), req.getVehicleLicencePlate(), req.getVehicleColor(), req.getUserId()
        ).join();

        DriveDto dto = new DriveDto(
                null,
                from.getId(),
                to.getId(),
                req.getPrice(),
                time,
                req.getAvailableSeats(),
                req.getTotalNoSeats(),
                null,
                req.getUserId(),  // Driver ID
                vehicle.getId()   // Vehicle ID
        );

        DriveDto createdDrive = driveService.add(dto);
        return ResponseEntity.ok(createdDrive);
    }

    // PUT /api/drives/{id}
    @PutMapping("/{id}")
    public ResponseEntity<DriveDto> update(@PathVariable Long id, @RequestBody DriveDto dto) {
        DriveDto updatedDrive = driveService.update(id, dto);
        return ResponseEntity.ok(updatedDrive);
    }

    // DELETE /api/drives/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        driveService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
