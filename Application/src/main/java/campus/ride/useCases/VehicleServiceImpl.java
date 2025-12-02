package campus.ride.useCases;

import campus.ride.entities.User;
import campus.ride.entities.Vehicle;
import campus.ride.contracts.user.UserRepository;
import campus.ride.contracts.vehicle.VehicleRepository;
import campus.ride.interfaces.VehicleService;
import campus.ride.transfer.dtos.vehicle.VehicleDto;
import campus.ride.transfer.mappings.VehicleMapper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository repo;
    private final UserRepository userRepository;

    public VehicleServiceImpl(VehicleRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<VehicleDto> getOrCreate(String model, String plate, String color, Long userId) {
        // If userId is not provided, try to get it from SecurityContext
        final Long targetUserId;
        if (userId == null) {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
            targetUserId = user.getId();
        } else {
            targetUserId = userId;
        }

        // First, check if user already has a vehicle
        Vehicle existingVehicle = repo.findByUserId(targetUserId).orElse(null);
        if (existingVehicle != null) {
            return CompletableFuture.completedFuture(VehicleMapper.toDto(existingVehicle));
        }
        
        // Get the user entity
        final User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + targetUserId));
        
        Vehicle vehicle;
        if (plate != null) {
            // Check if vehicle with this plate already exists
            vehicle = repo.findByVehicleLicencePlate(plate)
                    .orElseGet(() -> repo.save(new Vehicle(user, model, plate, color, user.getId())));
        } else {
            vehicle = repo.save(new Vehicle(user, model, null, color, user.getId()));
        }
        return CompletableFuture.completedFuture(VehicleMapper.toDto(vehicle));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Optional<VehicleDto>> getByUserId(Long userId) {
        return CompletableFuture.completedFuture(repo.findByUserId(userId)
                .map(VehicleMapper::toDto));
    }
}