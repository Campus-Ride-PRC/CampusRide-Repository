package campus.ride.useCases;

import campus.ride.contracts.faculty.FacultyRepository;
import campus.ride.entities.Faculty;
import campus.ride.interfaces.FacultyService;
import campus.ride.transfer.dtos.faculty.FacultyResponseDto;
import campus.ride.transfer.mappings.FacultyMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class FacultyServiceImpl implements FacultyService {

    private static final Logger logger = LogManager.getLogger(FacultyService.class);
    private final FacultyRepository facultyRepository;

    public FacultyServiceImpl(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<FacultyResponseDto>> findAllFaculties() {
        logger.debug("Retrieving all faculties from the repository");
        List<Faculty> faculties = facultyRepository.findAll();

        logger.debug("Found {} faculties. Mapping to DTOs.", faculties.size());

        return CompletableFuture.completedFuture(FacultyMapper.toDtoList(faculties));

    }
}
