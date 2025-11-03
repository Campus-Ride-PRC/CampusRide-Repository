package campus.ride.useCases;

import campus.ride.Vehicle;
import campus.ride.contracts.Vehicle.VehicleRepository;
import campus.ride.interfaces.VehicleService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository repo;

    public VehicleServiceImpl(VehicleRepository repo) {
        this.repo = repo;
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Vehicle> getOrCreate(String model, String plate, String color) {
        if (plate != null) {
            return CompletableFuture.completedFuture(
                    repo.findByVehicleLicencePlate(plate)
                            .orElseGet(() -> repo.save(new Vehicle(null, model, plate, color)))
            );
        }
        return CompletableFuture.completedFuture(repo.save(new Vehicle(null, model, null, color)));
    }
}