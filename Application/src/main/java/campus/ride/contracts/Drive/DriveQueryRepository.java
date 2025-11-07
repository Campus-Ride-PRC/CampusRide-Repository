package campus.ride.contracts.Drive;

import campus.ride.contracts.Drive.DriveRow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DriveQueryRepository {
    Page<DriveRow> findAllBy(Pageable pageable);
}
