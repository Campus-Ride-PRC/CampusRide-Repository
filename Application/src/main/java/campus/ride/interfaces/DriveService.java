package campus.ride.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveDto;
import campus.ride.transfer.dtos.drive.DrivePageDto;
import campus.ride.transfer.dtos.drive.DriveUpdateRequestDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface DriveService {
    CompletableFuture<Page<DriveDto>> getAll(Pageable pageable);
    CompletableFuture<DriveDto> getById(Long id);
    CompletableFuture<DrivePageDto> getDrivePageById(Long id);
    CompletableFuture<DriveDto> add(DriveDto dto);
    CompletableFuture<DriveDto> update(Long id, DriveUpdateRequestDto dto);
    CompletableFuture<Void> delete(Long id);

    CompletableFuture<Page<DriveCardDto>> getDriverCards(Pageable pageable);
    CompletableFuture<List<DriveCardDto>> getDrivesByDriverId(Long driverId);
    CompletableFuture<List<DriveCardDto>> getMyDrives();
    CompletableFuture<List<DriveCardDto>> getMyRecentRides();
    CompletableFuture<Page<DriveCardDto>> getUpcomingDrives(Pageable pageable);
}