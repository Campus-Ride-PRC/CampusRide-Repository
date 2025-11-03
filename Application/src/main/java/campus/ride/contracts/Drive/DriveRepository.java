package campus.ride.contracts.Drive;

import campus.ride.Drive;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DriveRepository {
    Page<Drive> findAll(Pageable pageable);
    Optional<Drive> findById(Long id);
    Drive save(Drive drive);
    void delete(Drive drive);
}
