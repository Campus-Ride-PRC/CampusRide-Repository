package campus.ride.entities;

import jakarta.persistence.*;

@Entity
@Table(
        name = "addresses",
        indexes = {
                @Index(name = "ix_addresses_neighborhood", columnList = "neighborhood"),
                @Index(name = "ix_addresses_location_name", columnList = "location_name"),
                @Index(name = "ix_addresses_street_number", columnList = "street, number")
        }
)
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_name")
    private String locationName;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String number;

    @Column(nullable = false)
    private String neighborhood;

    @Column(nullable = true)
    private String city;

    @Column(nullable = true)
    private Double latitude;

    @Column(nullable = true)
    private Double longitude;

    protected Address() {} 

    public Address(String street, String number, String neighborhood, String locationName, String city, Double latitude, Double longitude) {
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.locationName = locationName;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
