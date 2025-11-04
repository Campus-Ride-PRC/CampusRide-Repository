package campus.ride.transfer.dtos.user;
import campus.ride.entities.Address;

public class UserResponseDto {
    private Long id;
    private String email;
    private String address;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String faculty;

    public UserResponseDto() {
    }

    public UserResponseDto(Long id, String email, Address address, String phoneNumber, String firstName, String lastName, String faculty) {
        this.id = id;
        this.email = email;
        this.address = address != null ? address.toString() : null;
        this.phoneNumber = phoneNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.faculty = faculty;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }
}
