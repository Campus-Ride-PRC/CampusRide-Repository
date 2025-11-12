package campus.ride.interfaces;

import campus.ride.transfer.dtos.vehicle.VehicleDto;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public interface VehicleService {
    CompletableFuture<VehicleDto> getOrCreate(String model, String plate, String color, Long userId);
    Optional<VehicleDto> getByUserId(Long userId);
}