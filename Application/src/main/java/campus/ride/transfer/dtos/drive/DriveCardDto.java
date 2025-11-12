package campus.ride.transfer.dtos.drive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DriveCardDto {
    private Long id;
    private LocalDateTime time;
    private BigDecimal price;
    private Integer availableSeats;
    private Integer totalNoSeats;
    private String fromLocationName;
    private String fromNeighborhood;
    private String toLocationName;
    private String toNeighborhood;
    private String driverFirstName;
    private String driverLastName;
    private String vehicleModel;

    public DriveCardDto() {}

    public DriveCardDto(Long id, LocalDateTime time, BigDecimal price,
                         Integer availableSeats, Integer totalNoSeats,
                         String fromLocationName, String fromNeighborhood,
                         String toLocationName, String toNeighborhood,
                         String driverFirstName, String driverLastName,
                         String vehicleModel) {
        this.id = id;
        this.time = time;
        this.price = price;
        this.availableSeats = availableSeats;
        this.totalNoSeats = totalNoSeats;
        this.fromLocationName = fromLocationName;
        this.fromNeighborhood = fromNeighborhood;
        this.toLocationName = toLocationName;
        this.toNeighborhood = toNeighborhood;
        this.driverFirstName = driverFirstName;
        this.driverLastName = driverLastName;
        this.vehicleModel = vehicleModel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public Integer getTotalNoSeats() { return totalNoSeats; }
    public void setTotalNoSeats(Integer totalNoSeats) { this.totalNoSeats = totalNoSeats; }
    public String getFromLocationName() { return fromLocationName; }
    public void setFromLocationName(String fromLocationName) { this.fromLocationName = fromLocationName; }
    public String getFromNeighborhood() { return fromNeighborhood; }
    public void setFromNeighborhood(String fromNeighborhood) { this.fromNeighborhood = fromNeighborhood; }
    public String getToLocationName() { return toLocationName; }
    public void setToLocationName(String toLocationName) { this.toLocationName = toLocationName; }
    public String getToNeighborhood() { return toNeighborhood; }
    public void setToNeighborhood(String toNeighborhood) { this.toNeighborhood = toNeighborhood; }
    public String getDriverFirstName() { return driverFirstName; }
    public void setDriverFirstName(String driverFirstName) { this.driverFirstName = driverFirstName; }
    public String getDriverLastName() { return driverLastName; }
    public void setDriverLastName(String driverLastName) { this.driverLastName = driverLastName; }
    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
}
