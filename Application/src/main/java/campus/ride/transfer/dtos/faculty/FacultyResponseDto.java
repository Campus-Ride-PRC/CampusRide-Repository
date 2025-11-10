package campus.ride.transfer.dtos.faculty;

public class FacultyResponseDto {
    private String name;

    public FacultyResponseDto() {
    }

    public FacultyResponseDto(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
