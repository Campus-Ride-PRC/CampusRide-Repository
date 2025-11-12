package campus.ride.interfaces;

import campus.ride.transfer.dtos.faculty.FacultyResponseDto;

import java.util.List;

public interface FacultyService {
    List<FacultyResponseDto> findAllFaculties();
}
