package campus.ride.api.controller;

import campus.ride.interfaces.AddressService;
import campus.ride.transfer.dtos.address.AddressDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/addresses")
@Tag(name = "Address", description = "Address management APIs")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    @Operation(summary = "Create a new address", description = "Creates a new address with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Address created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AddressDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public CompletableFuture<ResponseEntity<AddressDto>> createAddress(@Valid @RequestBody AddressDto addressDto) {
        return addressService.getOrCreate(
                addressDto.getStreet(),
                addressDto.getNumber(),
                addressDto.getNeighborhood(),
                addressDto.getLocationName(),
                addressDto.getCity(),
                addressDto.getLatitude(),
                addressDto.getLongitude()
        ).thenApply(dto -> ResponseEntity.status(HttpStatus.CREATED).body(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get address by ID", description = "Retrieves an address by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AddressDto.class))),
            @ApiResponse(responseCode = "404", description = "Address not found",
                    content = @Content)
    })
    public CompletableFuture<ResponseEntity<AddressDto>> getAddressById(@PathVariable Long id) {
        // TODO: Implement getById in AddressService
        return CompletableFuture.completedFuture(ResponseEntity.notFound().build());
    }
}
