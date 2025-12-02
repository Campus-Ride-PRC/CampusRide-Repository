package campus.ride.api.controller;

import campus.ride.transfer.dtos.address.AddressDto;
import campus.ride.transfer.dtos.vehicle.VehicleDto;
import campus.ride.interfaces.AddressService;
import campus.ride.interfaces.VehicleService;
import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveCreateRequest;
import campus.ride.transfer.dtos.drive.DriveDto;
import campus.ride.transfer.dtos.drive.DrivePageDto;
import campus.ride.transfer.dtos.drive.DriveUpdateRequestDto;
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

import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

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
    public CompletableFuture<ResponseEntity<Page<DriveCardDto>>> getAll(
            @Parameter(description = "Pagination parameters (page, size, sort)")
            Pageable pageable) {
        return driveService.getDriverCards(pageable)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<DrivePageDto>> getById(
            @Parameter(description = "Drive ID") @PathVariable Long id) {
        return driveService.getDrivePageById(id)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<Page<DriveCardDto>>> getCards(
            @Parameter(description = "Pagination parameters (page, size, sort)")
            Pageable pageable) {
        return driveService.getDriverCards(pageable)
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<java.util.List<DriveCardDto>>> getDrivesByDriver(
            @Parameter(description = "Driver ID") @PathVariable Long driverId) {
        return driveService.getDrivesByDriverId(driverId)
                .thenApply(ResponseEntity::ok);
    }

    @Operation(
            summary = "Get my drives",
            description = "Retrieves all drives for the current authenticated user (driver)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved my drives",
                    content = @Content(schema = @Schema(implementation = DriveCardDto.class))
            )
    })
    @GetMapping("/my-drives")
    public CompletableFuture<ResponseEntity<java.util.List<DriveCardDto>>> getMyDrives() {
        return driveService.getMyDrives()
                .thenApply(ResponseEntity::ok);
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
    public CompletableFuture<ResponseEntity<DriveDto>> create(@RequestBody DriveCreateRequest req) {
        DriveValidator.validateForCreate(req);

        AddressValidator.requireCore(req.getFromStreet(), req.getFromNumber(), req.getFromNeighborhood());
        AddressValidator.requireCore(req.getToStreet(),   req.getToNumber(),   req.getToNeighborhood());

        VehicleValidator.softValidate(req.getVehicleModel(), req.getVehicleLicencePlate(), req.getVehicleColor());

        LocalDateTime time = LocalDateTime.of(req.getDay(), req.getHour());

        CompletableFuture<AddressDto> fromFuture = addressService.getOrCreate(
                req.getFromStreet(), req.getFromNumber(), req.getFromNeighborhood(), req.getFromLocationName()
        );
        
        CompletableFuture<AddressDto> toFuture = addressService.getOrCreate(
                req.getToStreet(), req.getToNumber(), req.getToNeighborhood(), req.getToLocationName()
        );

        CompletableFuture<VehicleDto> vehicleFuture = vehicleService.getOrCreate(
                req.getVehicleModel(), req.getVehicleLicencePlate(), req.getVehicleColor(), null
        );

        return CompletableFuture.allOf(fromFuture, toFuture, vehicleFuture)
                .thenCompose(v -> {
                    AddressDto from = fromFuture.join();
                    AddressDto to = toFuture.join();
                    VehicleDto vehicle = vehicleFuture.join();

                    if (from.getId().equals(to.getId())) {
                        throw new IllegalArgumentException("From and To addresses must be different.");
                    }

                    DriveDto dto = new DriveDto(
                            null,
                            from.getId(),
                            to.getId(),
                            req.getPrice(),
                            time,
                            0,
                            req.getTotalNoSeats(),
                            null,
                            null,
                            vehicle.getId()
                    );

                    return driveService.add(dto).thenApply(ResponseEntity::ok);
                });
    }

    @Operation(
            summary = "Update drive",
            description = "Updates an existing drive with new details"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Drive updated successfully",
                    content = @Content(schema = @Schema(implementation = DriveDto.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid drive data"),
            @ApiResponse(responseCode = "404", description = "Drive not found")
    })
    @PutMapping()
    public CompletableFuture<ResponseEntity<DriveDto>> update(@RequestBody @Valid DriveUpdateRequestDto req) {
        // Validate address components if provided
        if (req.getFromStreet() != null) {
            AddressValidator.requireCore(req.getFromStreet(), req.getFromNumber(), req.getFromNeighborhood());
        }
        if (req.getToStreet() != null) {
            AddressValidator.requireCore(req.getToStreet(), req.getToNumber(), req.getToNeighborhood());
        }

        return driveService.update(req.getId(), req)
                .thenApply(ResponseEntity::ok);
    }

    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> delete(@PathVariable Long id) {
        return driveService.delete(id)
                .thenApply(v -> ResponseEntity.noContent().build());
    }
}
