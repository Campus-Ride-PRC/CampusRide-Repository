package campus.ride.transfer.dtos.drive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class DriveCreateRequest {
    private String fromStreet;
    private String fromNumber;
    private String fromNeighborhood;
    private String fromLocationName;

    private String toStreet;
    private String toNumber;
    private String toNeighborhood;
    private String toLocationName;

    private BigDecimal price;
    private LocalDate day;     // separate day

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm[:ss]")
    private LocalTime hour; // separate hour

    private Integer availableSeats;
    private Integer totalNoSeats;

    // Vehicle (not linked yet, but we store/ensure it exists)
    // dupa autorizare cand o sa avem id ul o sa putem si linkui
    private String vehicleModel;
    private String vehicleLicencePlate;
    private String vehicleColor;

    public DriveCreateRequest() {}


    public String getFromStreet() { return fromStreet; }
    public void setFromStreet(String fromStreet) { this.fromStreet = fromStreet; }
    public String getFromNumber() { return fromNumber; }
    public void setFromNumber(String fromNumber) { this.fromNumber = fromNumber; }
    public String getFromNeighborhood() { return fromNeighborhood; }
    public void setFromNeighborhood(String fromNeighborhood) { this.fromNeighborhood = fromNeighborhood; }
    public String getFromLocationName() { return fromLocationName; }
    public void setFromLocationName(String fromLocationName) { this.fromLocationName = fromLocationName; }

    public String getToStreet() { return toStreet; }
    public void setToStreet(String toStreet) { this.toStreet = toStreet; }
    public String getToNumber() { return toNumber; }
    public void setToNumber(String toNumber) { this.toNumber = toNumber; }
    public String getToNeighborhood() { return toNeighborhood; }
    public void setToNeighborhood(String toNeighborhood) { this.toNeighborhood = toNeighborhood; }
    public String getToLocationName() { return toLocationName; }
    public void setToLocationName(String toLocationName) { this.toLocationName = toLocationName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public LocalDate getDay() { return day; }
    public void setDay(LocalDate day) { this.day = day; }
    public LocalTime getHour() { return hour; }
    public void setHour(LocalTime hour) { this.hour = hour; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public Integer getTotalNoSeats() { return totalNoSeats; }
    public void setTotalNoSeats(Integer totalNoSeats) { this.totalNoSeats = totalNoSeats; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public String getVehicleLicencePlate() { return vehicleLicencePlate; }
    public void setVehicleLicencePlate(String vehicleLicencePlate) { this.vehicleLicencePlate = vehicleLicencePlate; }
    public String getVehicleColor() { return vehicleColor; }
    public void setVehicleColor(String vehicleColor) { this.vehicleColor = vehicleColor; }
}