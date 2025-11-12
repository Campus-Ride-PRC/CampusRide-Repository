package campus.ride.transfer.mappings;

import campus.ride.entities.Faculty;
import campus.ride.transfer.dtos.faculty.FacultyResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class FacultyMapper {

    private FacultyMapper(){

    }

    public static FacultyResponseDto toDto(Faculty faculty){
        return new FacultyResponseDto(faculty.getId(), faculty.getName());
    }

    public static List<FacultyResponseDto> toDtoList(List<Faculty> faculties){
        return faculties.stream()
                .map(FacultyMapper::toDto)
                .collect(Collectors.toList());
    }

    public static Faculty toEntity(FacultyResponseDto facultyResponseDto){
        return new Faculty(
                facultyResponseDto.getId(),
                facultyResponseDto.getName(),
                AddressMapper.toEntity(facultyResponseDto.getAddress())
        );
    }
}

