package campus.ride.contracts.drive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface DriveRow {
    Long getId();
    LocalDateTime getTime();
    BigDecimal getPrice();
    Integer getTotalNoSeats();
    Integer getAvailableSeats();

    String getFrom_LocationName();
    String getFrom_Neighborhood();
    String getFrom_Number();
    String getFrom_Street();

    String getTo_LocationName();
    String getTo_Neighborhood();
    String getTo_Number();
    String getTo_Street();

    String getDriver_FirstName();
    String getDriver_LastName();
    String getVehicle_Model();
}
