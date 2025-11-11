package campus.ride.useCases;

import campus.ride.entities.Vehicle;
import campus.ride.contracts.Vehicle.VehicleRepository;
import campus.ride.interfaces.VehicleService;
import campus.ride.transfer.dtos.vehicle.VehicleDto;
import campus.ride.transfer.mappings.VehicleMapper;
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
    public CompletableFuture<VehicleDto> getOrCreate(String model, String plate, String color) {
        Vehicle vehicle;
        if (plate != null) {
            vehicle = repo.findByVehicleLicencePlate(plate)
                    .orElseGet(() -> repo.save(new Vehicle(null, model, plate, color)));
        } else {
            vehicle = repo.save(new Vehicle(null, model, null, color));
        }
        return CompletableFuture.completedFuture(VehicleMapper.toDto(vehicle));
    }
}