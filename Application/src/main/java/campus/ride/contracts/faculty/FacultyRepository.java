package campus.ride.contracts.faculty;

import campus.ride.entities.Faculty;

import java.util.Optional;

public interface FacultyRepository {
    Optional<Faculty> findById(Long id);
}
