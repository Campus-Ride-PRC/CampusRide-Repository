package campus.ride.contracts.drive;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import campus.ride.entities.Drive;

public interface DriveRepository {
    Page<Drive> findAll(Pageable pageable);
    Optional<Drive> findById(Long id);
    Drive save(Drive drive);
    void delete(Drive drive);
}
