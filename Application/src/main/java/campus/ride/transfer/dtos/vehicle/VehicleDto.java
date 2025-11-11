package campus.ride.transfer.dtos.vehicle;

public class VehicleDto {
    private Long id;
    private String model;
    private String vehicleLicencePlate;
    private String color;
    private Long userId;

    public VehicleDto() {
    }

    public VehicleDto(Long id, String model, String vehicleLicencePlate, String color, Long userId) {
        this.id = id;
        this.model = model;
        this.vehicleLicencePlate = vehicleLicencePlate;
        this.color = color;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVehicleLicencePlate() {
        return vehicleLicencePlate;
    }

    public void setVehicleLicencePlate(String vehicleLicencePlate) {
        this.vehicleLicencePlate = vehicleLicencePlate;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
