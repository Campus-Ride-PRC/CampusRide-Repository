package campus.ride.entities;

import jakarta.persistence.*;

@Entity
@Table(
        name = "vehicles",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_vehicles_user_id", columnNames = "user_id") // ensures 1 vehicle per user
        },
        indexes = {
                @Index(name = "ix_vehicles_user_id", columnList = "user_id"),
                @Index(name = "ix_vehicles_licence_plate", columnList = "vehicle_licence_plate")
        }
)
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleModel;

    @Column(name = "vehicle_licence_plate")
    private String vehicleLicencePlate;

    private String vehicleColor;


//  Currently optional because user authentication is not yet implemented.
//  When we add JWT-based auth, set 'optional = false' and 'nullable = false'.
//  because the id of the user would come from the user
    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    protected Vehicle() {}

    public Vehicle(User user, String vehicleModel, String vehicleLicencePlate, String vehicleColor) {
        this.user = user;
        this.vehicleModel = vehicleModel;
        this.vehicleLicencePlate = vehicleLicencePlate;
        this.vehicleColor = vehicleColor;
    }
//  this deleted after authorization
    public Vehicle(String vehicleModel, String vehicleLicencePlate, String vehicleColor) {
        this(null, vehicleModel, vehicleLicencePlate, vehicleColor);
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public String getVehicleLicencePlate() { return vehicleLicencePlate; }
    public void setVehicleLicencePlate(String vehicleLicencePlate) { this.vehicleLicencePlate = vehicleLicencePlate; }

    public String getVehicleColor() { return vehicleColor; }
    public void setVehicleColor(String vehicleColor) { this.vehicleColor = vehicleColor; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
