package campus.ride.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveDto;
import campus.ride.transfer.dtos.drive.DrivePageDto;

import java.util.List;

public interface DriveService {
    Page<DriveDto> getAll(Pageable pageable);
    DriveDto getById(Long id);
    DrivePageDto getDrivePageById(Long id);
    DriveDto add(DriveDto dto);
    DriveDto update(Long id, DriveDto dto);
    void delete(Long id);

    Page<DriveCardDto> getDriverCards(Pageable pageable);
    List<DriveCardDto> getDrivesByDriverId(Long driverId);
}