package campus.ride.repositories.faculty;

import campus.ride.contracts.faculty.FacultyRepository;
import campus.ride.entities.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyJPARepository extends JpaRepository<Faculty, Long>, FacultyRepository {
}
