package campus.ride.transfer.dtos.address;

public class AddressDto {
    private Long id;
    private String street;
    private String number;
    private String locationName;
    private String neighborhood;

    public AddressDto() {
    }

    public AddressDto(Long id, String street, String number, String locationName, String neighborhood) {
        this.id = id;
        this.street = street;
        this.number = number;
        this.locationName = locationName;
        this.neighborhood = neighborhood;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }
}
