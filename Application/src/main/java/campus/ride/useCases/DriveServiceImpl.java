package campus.ride.useCases;

import campus.ride.entities.Address;
import campus.ride.entities.Booking;
import campus.ride.entities.Drive;
import campus.ride.entities.User;
import campus.ride.entities.Vehicle;
import campus.ride.enums.BookingRole;
import campus.ride.enums.BookingStatus;
import campus.ride.contracts.booking.BookingRepository;
import campus.ride.contracts.drive.DriveQueryRepository;
import campus.ride.contracts.drive.DriveRepository;
import campus.ride.contracts.drive.DriveRow;
import campus.ride.contracts.user.UserRepository;
import campus.ride.contracts.vehicle.VehicleRepository;
import campus.ride.interfaces.DriveService;
import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveDto;
import campus.ride.transfer.dtos.drive.DrivePageDto;
import campus.ride.transfer.mappings.DriveMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DriveServiceImpl implements DriveService {

    private final DriveRepository driveRepo;
    private final DriveQueryRepository driveQueryRepo;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    @PersistenceContext
    private EntityManager em;

    public DriveServiceImpl(DriveRepository driveRepo, 
                           DriveQueryRepository driveQueryRepo,
                           BookingRepository bookingRepository,
                           UserRepository userRepository,
                           VehicleRepository vehicleRepository) {
        this.driveRepo = driveRepo;
        this.driveQueryRepo = driveQueryRepo;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }


    @Override
    @Transactional(readOnly = true)
    public Page<DriveDto> getAll(Pageable pageable) {
        return driveRepo.findAll(pageable).map(DriveMapper::toDto);
    }


    @Override
    @Transactional(readOnly = true)
    public DriveDto getById(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));
        return DriveMapper.toDto(d);
    }

    @Override
    @Transactional(readOnly = true)
    public DrivePageDto getDrivePageById(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));
        
        return new DrivePageDto(
                d.getId(),
                d.getTime(),
                d.getPrice(),
                d.getAvailableSeats(),
                d.getTotalNoSeats(),
                d.getFrom().getLocationName(),
                d.getFrom().getNeighborhood(),
                d.getTo().getLocationName(),
                d.getTo().getNeighborhood(),
                d.getDriver().getFirstName(),
                d.getDriver().getLastName(),
                d.getVehicle().getVehicleModel(),
                d.getVehicle().getVehicleLicencePlate(),
                d.getVehicle().getVehicleColor()
        );
    }

    @Override
    @Transactional
    public DriveDto add(DriveDto dto) {
        Address from = mustFindAddress(dto.getFromAddressId());
        Address to   = mustFindAddress(dto.getToAddressId());

        if (from.getId().equals(to.getId())) {
            throw new IllegalArgumentException("From and To addresses must be different.");
        }

        User driver = dto.getDriverId() != null 
            ? userRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new IllegalArgumentException("Driver not found: " + dto.getDriverId()))
            : null;

        if (driver == null) {
            throw new IllegalArgumentException("Driver ID is required");
        }

        // Get or ensure vehicle
        Vehicle vehicle = null;
        if (dto.getVehicleId() != null) {
            vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found: " + dto.getVehicleId()));
        }

        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle ID is required");
        }

        Drive entity = DriveMapper.toEntity(dto, from, to);

        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }

        Drive saved = driveRepo.save(entity);

        // Create driver booking with ACCEPTED status
        LocalDateTime now = LocalDateTime.now();
        Booking driverBooking = new Booking(
            saved.getId(),
            driver.getId(),
            saved,
            driver,
            BookingStatus.ACCEPTED,
            BookingRole.DRIVER,
            now,
            now
        );
        bookingRepository.save(driverBooking);

        return DriveMapper.toDto(saved);
    }


    @Override
    @Transactional
    public DriveDto update(Long id, DriveDto dto) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));

        if (dto.getFromAddressId() != null) d.setFrom(mustFindAddress(dto.getFromAddressId()));
        if (dto.getToAddressId() != null) d.setTo(mustFindAddress(dto.getToAddressId()));
        if (dto.getPrice() != null) d.setPrice(dto.getPrice());
        if (dto.getTime() != null) d.setTime(dto.getTime());
        if (dto.getTotalNoSeats() != null) d.setTotalNoSeats(dto.getTotalNoSeats());

        if (d.getFrom() != null && d.getTo() != null && d.getFrom().getId().equals(d.getTo().getId())) {
            throw new IllegalArgumentException("From and To addresses must be different.");
        }

        Drive saved = driveRepo.save(d);
        return DriveMapper.toDto(saved);
    }


    @Override
    @Transactional
    public void delete(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));
        driveRepo.delete(d);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DriveCardDto> getDriverCards(Pageable pageable) {
        Page<DriveRow> rows = driveQueryRepo.findAllBy(pageable);
        return rows.map(r ->
                new DriveCardDto(
                        r.getId(), r.getTime(), r.getPrice(),
                        r.getAvailableSeats(), r.getTotalNoSeats(),
                        r.getFrom_LocationName(), r.getFrom_Neighborhood(),
                        r.getTo_LocationName(), r.getTo_Neighborhood(),
                        r.getDriver_FirstName(), r.getDriver_LastName(),
                        r.getVehicle_Model()
                )
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriveCardDto> getDrivesByDriverId(Long driverId) {
        List<DriveRow> rows = driveQueryRepo.findAllByDriverId(driverId);
        return rows.stream()
                .map(r -> new DriveCardDto(
                        r.getId(), r.getTime(), r.getPrice(),
                        r.getAvailableSeats(), r.getTotalNoSeats(),
                        r.getFrom_LocationName(), r.getFrom_Neighborhood(),
                        r.getTo_LocationName(), r.getTo_Neighborhood(),
                        r.getDriver_FirstName(), r.getDriver_LastName(),
                        r.getVehicle_Model()
                ))
                .collect(java.util.stream.Collectors.toList());
    }


    private Address mustFindAddress(Long id) {
        Address a = em.find(Address.class, id);
        if (a == null) throw new IllegalArgumentException("Address not found: " + id);
        return a;
    }
}
