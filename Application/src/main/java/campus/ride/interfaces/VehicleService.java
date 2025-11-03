package campus.ride.interfaces;

import campus.ride.Vehicle;

import java.util.concurrent.CompletableFuture;

public interface VehicleService {
    CompletableFuture<Vehicle> getOrCreate(String model, String plate, String color);
}