package campus.ride.interfaces;

import campus.ride.dtos.Drive.DriveDTO;
import campus.ride.dtos.Drive.DriveCardDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

public interface DriveService {
    CompletableFuture<Page<DriveDTO>> getAllAsync(Pageable pageable);
    CompletableFuture<DriveDTO> getByIdAsync(Long id);
    CompletableFuture<DriveDTO> addAsync(DriveDTO dto);
    CompletableFuture<DriveDTO> updateAsync(Long id, DriveDTO dto);
    CompletableFuture<Void> deleteAsync(Long id);

    CompletableFuture<Page<DriveCardDTO>> getDriverCardsAsync(Pageable pageable);
}