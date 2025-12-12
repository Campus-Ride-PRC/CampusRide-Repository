package campus.ride.transfer.dtos.drive;

import campus.ride.transfer.dtos.address.AddressDto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DrivePageDto {
    private Long id;
    private LocalDateTime time;
    private BigDecimal price;
    private Integer availableSeats;
    private Integer totalNoSeats;
    private AddressDto fromAddress;
    private AddressDto toAddress;
    private String driverFirstName;
    private String driverLastName;
    private String vehicleModel;
    private String vehicleLicencePlate;
    private String vehicleColor;

    public DrivePageDto() {}

    public DrivePageDto(Long id, LocalDateTime time, BigDecimal price,
                        Integer availableSeats, Integer totalNoSeats,
                        AddressDto fromAddress, AddressDto toAddress,
                        String driverFirstName, String driverLastName,
                        String vehicleModel, String vehicleLicencePlate, String vehicleColor) {
        this.id = id;
        this.time = time;
        this.price = price;
        this.availableSeats = availableSeats;
        this.totalNoSeats = totalNoSeats;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.driverFirstName = driverFirstName;
        this.driverLastName = driverLastName;
        this.vehicleModel = vehicleModel;
        this.vehicleLicencePlate = vehicleLicencePlate;
        this.vehicleColor = vehicleColor;
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

    public AddressDto getFromAddress() { return fromAddress; }
    public void setFromAddress(AddressDto fromAddress) { this.fromAddress = fromAddress; }

    public AddressDto getToAddress() { return toAddress; }
    public void setToAddress(AddressDto toAddress) { this.toAddress = toAddress; }

    public String getDriverFirstName() { return driverFirstName; }
    public void setDriverFirstName(String driverFirstName) { this.driverFirstName = driverFirstName; }

    public String getDriverLastName() { return driverLastName; }
    public void setDriverLastName(String driverLastName) { this.driverLastName = driverLastName; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public String getVehicleLicencePlate() { return vehicleLicencePlate; }
    public void setVehicleLicencePlate(String vehicleLicencePlate) { this.vehicleLicencePlate = vehicleLicencePlate; }

    public String getVehicleColor() { return vehicleColor; }
    public void setVehicleColor(String vehicleColor) { this.vehicleColor = vehicleColor; }
}

