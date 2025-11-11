package campus.ride.contracts.Drive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface DriveRow {
    Long getId();
    LocalDateTime getTime();
    BigDecimal getPrice();

    String getFrom_LocationName();
    String getFrom_Neighborhood();

    String getTo_LocationName();
    String getTo_Neighborhood();
}
