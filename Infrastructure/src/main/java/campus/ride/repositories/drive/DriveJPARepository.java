package campus.ride.repositories.drive;

import campus.ride.contracts.drive.DriveRepository;
import campus.ride.entities.Drive;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriveJPARepository
        extends JpaRepository<Drive, Long>, DriveRepository {

    @Override
    Page<Drive> findAll(Pageable pageable);
}