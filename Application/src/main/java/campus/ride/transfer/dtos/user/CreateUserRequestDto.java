package campus.ride.transfer.dtos.user;

import campus.ride.transfer.dtos.faculty.FacultyResponseDto;

public class CreateUserRequestDto {
    private String email;
    private String password;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private FacultyResponseDto faculty;

    public CreateUserRequestDto() {
    }

    public CreateUserRequestDto(String email, String password, String phoneNumber, String firstName, String lastName, FacultyResponseDto faculty) {
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.faculty = faculty;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public FacultyResponseDto getFaculty() {
        return faculty;
    }

    public void setFaculty(FacultyResponseDto faculty) {
        this.faculty = faculty;
    }
}
