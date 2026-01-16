package campus.ride.transfer.dtos.community;

import campus.ride.transfer.dtos.user.UserResponseDto;

public class CommunityDto {
    private Long id;
    private String name;
    private String description;
    private UserResponseDto creator;

    public CommunityDto() {
    }

    public CommunityDto(Long id, String name, String description, UserResponseDto creator) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.creator = creator;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserResponseDto getCreator() {
        return creator;
    }

    public void setCreator(UserResponseDto creator) {
        this.creator = creator;
    }
}
