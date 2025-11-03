package campus.ride.contracts.drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DriveQueryRepository {
    Page<DriveRow> findAllBy(Pageable pageable);
}
