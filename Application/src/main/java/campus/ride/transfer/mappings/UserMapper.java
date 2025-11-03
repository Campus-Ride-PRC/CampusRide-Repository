package campus.ride.transfer.mappings;

import campus.ride.entities.User;
import campus.ride.transfer.dtos.user.CreateUserRequestDto;
import campus.ride.transfer.dtos.user.UserResponseDto;

public class UserMapper {

    public static UserResponseDto toDto(User user) {
        if (user == null) {
            return null;
        }
        
        return new UserResponseDto(
            user.getId(),
            user.getEmail(),
            user.getAddress(),
            user.getPhoneNumber(),
            user.getFirstName(),
            user.getLastName(),
            user.getFaculty()
        );
    }

    public static User toEntity(UserResponseDto dto) {
        if (dto == null) {
            return null;
        }
        
        User user = new User(dto.getEmail(), null);
        user.setId(dto.getId());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setFaculty(dto.getFaculty());
        
        return user;
    }

    public static User fromCreateRequest(CreateUserRequestDto dto) {
        if (dto == null) {
            return null;
        }
        
        User user = new User(dto.getEmail(), dto.getPassword());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setFaculty(dto.getFaculty());
        
        return user;
    }
}
