package campus.ride.transfer.mappings;

import campus.ride.entities.Faculty;
import campus.ride.transfer.dtos.faculty.FacultyResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class FacultyMapper {

    private FacultyMapper(){

    }

    public static FacultyResponseDto toDto(Faculty faculty){
        return new FacultyResponseDto(faculty.getName());
    }

    public static List<FacultyResponseDto> toDtoList(List<Faculty> faculties){
        return faculties.stream()
                .map(FacultyMapper::toDto) // Echivalent cu .map(faculty -> toDto(faculty))
                .collect(Collectors.toList());
    }
}

