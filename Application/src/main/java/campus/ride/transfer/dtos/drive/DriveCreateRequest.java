package campus.ride.transfer.dtos.drive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import campus.ride.transfer.dtos.address.AddressDto;

public class DriveCreateRequest {
    private AddressDto fromAddress;
    private AddressDto toAddress;

    private BigDecimal price;
    private LocalDate day;

    @Schema(type = "string", pattern = "HH:mm[:ss]")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm[:ss]")
    private LocalTime hour; // separate hour
    private Integer totalNoSeats;

    private String vehicleModel;
    private String vehicleLicencePlate;
    private String vehicleColor;

    private java.util.List<String> acceptedPaymentTypes;

    public DriveCreateRequest() {
    }

    public AddressDto getFromAddress() {
        return fromAddress;
    }

    public void setFromAddress(AddressDto fromAddress) {
        this.fromAddress = fromAddress;
    }

    public AddressDto getToAddress() {
        return toAddress;
    }

    public void setToAddress(AddressDto toAddress) {
        this.toAddress = toAddress;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getDay() {
        return day;
    }

    public void setDay(LocalDate day) {
        this.day = day;
    }

    public LocalTime getHour() {
        return hour;
    }

    public void setHour(LocalTime hour) {
        this.hour = hour;
    }

    public Integer getTotalNoSeats() {
        return totalNoSeats;
    }

    public void setTotalNoSeats(Integer totalNoSeats) {
        this.totalNoSeats = totalNoSeats;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleLicencePlate() {
        return vehicleLicencePlate;
    }

    public void setVehicleLicencePlate(String vehicleLicencePlate) {
        this.vehicleLicencePlate = vehicleLicencePlate;
    }

    public String getVehicleColor() {
        return vehicleColor;
    }

    public void setVehicleColor(String vehicleColor) {
        this.vehicleColor = vehicleColor;
    }

    public java.util.List<String> getAcceptedPaymentTypes() {
        return acceptedPaymentTypes;
    }

    public void setAcceptedPaymentTypes(java.util.List<String> acceptedPaymentTypes) {
        this.acceptedPaymentTypes = acceptedPaymentTypes;
    }

}