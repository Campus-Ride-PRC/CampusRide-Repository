package campus.ride.interfaces;

import campus.ride.transfer.dtos.faculty.FacultyResponseDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface FacultyService {
    CompletableFuture<List<FacultyResponseDto>> findAllFaculties();
}
