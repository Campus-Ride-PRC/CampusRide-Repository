package campus.ride.contracts.drive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface DriveRow {
    Long getId();
    LocalDateTime getTime();
    BigDecimal getPrice();
    Integer getAvailableSeats();
    Integer getTotalNoSeats();

    String getFrom_LocationName();
    String getFrom_Neighborhood();

    String getTo_LocationName();
    String getTo_Neighborhood();

    String getDriver_FirstName();
    String getDriver_LastName();
    String getVehicle_Model();
}
