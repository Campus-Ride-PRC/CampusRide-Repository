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

    private String mapsUrl;

    protected Address() {} 

    public Address(String street, String number, String neighborhood, String locationName, String mapsUrl) {
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.locationName = locationName;
        this.mapsUrl = mapsUrl;
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

    public String getMapsUrl() { return mapsUrl; }
    public void setMapsUrl(String mapsUrl) { this.mapsUrl = mapsUrl; }
}
