package campus.ride.transfer.dtos.drive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DriveCardDto {
    private Long id;
    private LocalDateTime time;
    private BigDecimal price;
    private String fromLocationName;
    private String fromNeighborhood;
    private String toLocationName;
    private String toNeighborhood;
    private String carModel;

    public DriveCardDto() {}

    public DriveCardDto(Long id, LocalDateTime time, BigDecimal price,
                         String fromLocationName, String fromNeighborhood,
                         String toLocationName, String toNeighborhood,
                         String carModel) {
        this.id = id;
        this.time = time;
        this.price = price;
        this.fromLocationName = fromLocationName;
        this.fromNeighborhood = fromNeighborhood;
        this.toLocationName = toLocationName;
        this.toNeighborhood = toNeighborhood;
        this.carModel = carModel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getFromLocationName() { return fromLocationName; }
    public void setFromLocationName(String fromLocationName) { this.fromLocationName = fromLocationName; }
    public String getFromNeighborhood() { return fromNeighborhood; }
    public void setFromNeighborhood(String fromNeighborhood) { this.fromNeighborhood = fromNeighborhood; }
    public String getToLocationName() { return toLocationName; }
    public void setToLocationName(String toLocationName) { this.toLocationName = toLocationName; }
    public String getToNeighborhood() { return toNeighborhood; }
    public void setToNeighborhood(String toNeighborhood) { this.toNeighborhood = toNeighborhood; }
    public String getCarModel() { return carModel; }
    public void setCarModel(String carModel) { this.carModel = carModel; }
}
