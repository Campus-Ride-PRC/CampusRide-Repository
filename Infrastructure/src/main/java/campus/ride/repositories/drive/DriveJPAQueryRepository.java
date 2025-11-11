package campus.ride.repositories.drive;

import campus.ride.contracts.drive.DriveQueryRepository;
import campus.ride.contracts.drive.DriveRow;
import campus.ride.entities.Drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriveJPAQueryRepository
        extends JpaRepository<Drive, Long>, DriveQueryRepository {

    @Override
    Page<DriveRow> findAllBy(Pageable pageable);
}