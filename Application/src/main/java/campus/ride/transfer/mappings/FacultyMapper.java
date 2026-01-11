package campus.ride.transfer.mappings;

import campus.ride.entities.Faculty;
import campus.ride.transfer.dtos.faculty.FacultyResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class FacultyMapper {

    private FacultyMapper(){

    }

    public static FacultyResponseDto toDto(Faculty faculty){
        if (faculty == null) {
            return null;
        }
        FacultyResponseDto dto = new FacultyResponseDto(faculty.getId(), faculty.getName());
        dto.setAddress(AddressMapper.toDto(faculty.getAddress()));
        return dto;
    }

    public static List<FacultyResponseDto> toDtoList(List<Faculty> faculties){
        if (faculties == null) {
            return null;
        }
        return faculties.stream()
                .map(FacultyMapper::toDto)
                .collect(Collectors.toList());
    }

    public static Faculty toEntity(FacultyResponseDto facultyResponseDto){
        if (facultyResponseDto == null) {
            return null;
        }
        return new Faculty(
                facultyResponseDto.getId(),
                facultyResponseDto.getName(),
                AddressMapper.toEntity(facultyResponseDto.getAddress())
        );
    }
}
