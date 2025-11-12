package campus.ride.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveDto;

import java.util.concurrent.CompletableFuture;

public interface DriveService {
    CompletableFuture<Page<DriveDto>> getAllAsync(Pageable pageable);
    CompletableFuture<DriveDto> getByIdAsync(Long id);
    CompletableFuture<DriveDto> addAsync(DriveDto dto);
    CompletableFuture<DriveDto> updateAsync(Long id, DriveDto dto);
    CompletableFuture<Void> deleteAsync(Long id);

    CompletableFuture<Page<DriveCardDto>> getDriverCardsAsync(Pageable pageable);
}