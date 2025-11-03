package campus.ride.contracts.Drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

public interface DriveQueryRepository {
    Page<DriveRow> findAllBy(Pageable pageable);
}