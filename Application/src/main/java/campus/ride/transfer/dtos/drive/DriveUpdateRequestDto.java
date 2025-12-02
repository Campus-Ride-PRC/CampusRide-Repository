package campus.ride.transfer.dtos.drive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DriveUpdateRequestDto {

    @NotNull(message = "Drive ID is required for update.")
    private Long id;

    @Size(min = 3, message = "Street name must be at least 3 characters.")
    private String fromStreet;
    private String fromNumber;
    private String fromNeighborhood;
    private String fromLocationName;

    @Size(min = 3, message = "Street name must be at least 3 characters.")
    private String toStreet;
    private String toNumber;
    private String toNeighborhood;
    private String toLocationName;

    private LocalDate day;

    @Schema(
            type = "string",
            pattern = "HH:mm"
    )
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime hour;

    @Min(value = 1, message = "Total number of seats must be at least 1.")
    private Integer totalNoSeats;

    @Min(value = 0, message = "Price cannot be negative.")
    private BigDecimal price;


    public DriveUpdateRequestDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFromStreet() {
        return fromStreet;
    }

    public void setFromStreet(String fromStreet) {
        this.fromStreet = fromStreet;
    }

    public String getFromNumber() {
        return fromNumber;
    }

    public void setFromNumber(String fromNumber) {
        this.fromNumber = fromNumber;
    }

    public String getFromNeighborhood() {
        return fromNeighborhood;
    }

    public void setFromNeighborhood(String fromNeighborhood) {
        this.fromNeighborhood = fromNeighborhood;
    }

    public String getFromLocationName() {
        return fromLocationName;
    }

    public void setFromLocationName(String fromLocationName) {
        this.fromLocationName = fromLocationName;
    }

    public String getToStreet() {
        return toStreet;
    }

    public void setToStreet(String toStreet) {
        this.toStreet = toStreet;
    }

    public String getToNumber() {
        return toNumber;
    }

    public void setToNumber(String toNumber) {
        this.toNumber = toNumber;
    }

    public String getToNeighborhood() {
        return toNeighborhood;
    }

    public void setToNeighborhood(String toNeighborhood) {
        this.toNeighborhood = toNeighborhood;
    }

    public String getToLocationName() {
        return toLocationName;
    }

    public void setToLocationName(String toLocationName) {
        this.toLocationName = toLocationName;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
