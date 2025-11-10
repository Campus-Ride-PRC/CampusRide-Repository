package campus.ride.transfer.dtos.faculty;

import campus.ride.transfer.dtos.address.AddressDto;

public class FacultyResponseDto {
    private Long id;
    private String name;
    private AddressDto address;

    public FacultyResponseDto() {
    }

    public FacultyResponseDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public AddressDto getAddress() {
        return address;
    }

    public void setAddress(AddressDto address) {
        this.address = address;
    }
}
