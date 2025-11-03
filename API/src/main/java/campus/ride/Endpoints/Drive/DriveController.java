package campus.ride.Endpoints.Drive;

import campus.ride.Address;
import campus.ride.Vehicle;
import campus.ride.dtos.Drive.DriveCardDTO;
import campus.ride.Endpoints.Drive.dtos.DriveCreateRequest;
import campus.ride.dtos.Drive.DriveDTO;
import campus.ride.interfaces.AddressService;
import campus.ride.interfaces.VehicleService;
import campus.ride.interfaces.DriveService;

import campus.ride.Validators.DriveValidator;
import campus.ride.Validators.AddressValidator;
import campus.ride.Validators.VehicleValidator;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/drives")
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

    // GET /api/drives?page=…&size=…
    @GetMapping
    public CompletableFuture<Page<DriveDTO>> getAll(Pageable pageable) {
        return driveService.getAllAsync(pageable);
    }

    // GET /api/drives/{id}
    @GetMapping("/{id}")
    public CompletableFuture<ResponseEntity<DriveDTO>> getById(@PathVariable Long id) {
        return driveService.getByIdAsync(id).thenApply(ResponseEntity::ok);
    }

    // GET /api/drives/cards
    @GetMapping("/cards")
    public CompletableFuture<Page<DriveCardDTO>> getCards(Pageable pageable) {
        return driveService.getDriverCardsAsync(pageable);
    }

    // POST /api/drives
    @PostMapping
    public CompletableFuture<ResponseEntity<DriveDTO>> create(@RequestBody DriveCreateRequest req) {
        DriveValidator.validateForCreate(req);

        AddressValidator.requireCore(req.getFromStreet(), req.getFromNumber(), req.getFromNeighborhood());
        AddressValidator.requireCore(req.getToStreet(),   req.getToNumber(),   req.getToNeighborhood());

        VehicleValidator.softValidate(req.getVehicleModel(), req.getVehicleLicencePlate(), req.getVehicleColor());

        // combine day+hour to LocalDateTime
        LocalDateTime time = LocalDateTime.of(req.getDay(), req.getHour());

        CompletableFuture<Address> fromF = addressService.getOrCreate(
                req.getFromStreet(), req.getFromNumber(), req.getFromNeighborhood(), req.getFromLocationName()
        );
        CompletableFuture<Address> toF = addressService.getOrCreate(
                req.getToStreet(), req.getToNumber(), req.getToNeighborhood(), req.getToLocationName()
        );

        CompletableFuture<Vehicle> vehicleF = vehicleService.getOrCreate(
                req.getVehicleModel(), req.getVehicleLicencePlate(), req.getVehicleColor()
        );

        return CompletableFuture.allOf(fromF, toF, vehicleF)
                .thenCompose(v -> {
                    Address from = fromF.join();
                    Address to   = toF.join();

                    if (from.getId().equals(to.getId())) {
                        throw new IllegalArgumentException("From and To addresses must be different.");
                    }

                    DriveDTO dto = new DriveDTO(
                            null,
                            from.getId(),
                            to.getId(),
                            req.getPrice(),
                            time,
                            req.getAvailableSeats(),
                            req.getTotalNoSeats(),
                            null
                    );

                    return driveService.addAsync(dto).thenApply(ResponseEntity::ok);
                });
    }

    // PUT /api/drives/{id}
    @PutMapping("/{id}")
    public CompletableFuture<ResponseEntity<DriveDTO>> update(@PathVariable Long id, @RequestBody DriveDTO dto) {
        // (Optional) add lightweight API-side checks if you want
        return driveService.updateAsync(id, dto).thenApply(ResponseEntity::ok);
    }

    // DELETE /api/drives/{id}
    @DeleteMapping("/{id}")
    public CompletableFuture<ResponseEntity<Void>> delete(@PathVariable Long id) {
        return driveService.deleteAsync(id).thenApply(v -> ResponseEntity.noContent().build());
    }
}
