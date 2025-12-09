package campus.ride.useCases;

import campus.ride.entities.Address;
import campus.ride.entities.Booking;
import campus.ride.entities.Drive;
import campus.ride.entities.User;
import campus.ride.entities.Vehicle;
import campus.ride.enums.BookingRole;
import campus.ride.enums.BookingStatus;
import campus.ride.contracts.address.AddressRepository;
import campus.ride.contracts.booking.BookingRepository;
import campus.ride.contracts.drive.DriveQueryRepository;
import campus.ride.contracts.drive.DriveRepository;
import campus.ride.contracts.drive.DriveRow;
import campus.ride.contracts.user.UserRepository;
import campus.ride.contracts.vehicle.VehicleRepository;
import campus.ride.interfaces.DriveService;
import campus.ride.transfer.dtos.address.AddressDto;
import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveDto;
import campus.ride.transfer.dtos.drive.DrivePageDto;
import campus.ride.transfer.dtos.drive.DriveUpdateRequestDto;
import campus.ride.transfer.mappings.DriveMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class DriveServiceImpl implements DriveService {

    private final DriveRepository driveRepo;
    private final DriveQueryRepository driveQueryRepo;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final AddressRepository addressRepository;

    @PersistenceContext
    private EntityManager em;

    public DriveServiceImpl(DriveRepository driveRepo, 
                           DriveQueryRepository driveQueryRepo,
                           BookingRepository bookingRepository,
                           UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           AddressRepository addressRepository) {
        this.driveRepo = driveRepo;
        this.driveQueryRepo = driveQueryRepo;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Page<DriveDto>> getAll(Pageable pageable) {
        return CompletableFuture.completedFuture(driveRepo.findAll(pageable).map(DriveMapper::toDto));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<DriveDto> getById(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));
        return CompletableFuture.completedFuture(DriveMapper.toDto(d));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<DrivePageDto> getDrivePageById(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));
        
        Address fromAddr = d.getFrom();
        Address toAddr = d.getTo();
        
        AddressDto fromAddressDto = new AddressDto(
                fromAddr.getId(),
                fromAddr.getStreet(),
                fromAddr.getNumber(),
                fromAddr.getLocationName(),
                fromAddr.getNeighborhood()
        );
        
        AddressDto toAddressDto = new AddressDto(
                toAddr.getId(),
                toAddr.getStreet(),
                toAddr.getNumber(),
                toAddr.getLocationName(),
                toAddr.getNeighborhood()
        );
        
        return CompletableFuture.completedFuture(new DrivePageDto(
                d.getId(),
                d.getTime(),
                d.getPrice(),
                d.getAvailableSeats(),
                d.getTotalNoSeats(),
                fromAddressDto,
                toAddressDto,
                d.getDriver().getFirstName(),
                d.getDriver().getLastName(),
                d.getVehicle().getVehicleModel(),
                d.getVehicle().getVehicleLicencePlate(),
                d.getVehicle().getVehicleColor()
        ));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<DriveDto> add(DriveDto dto) {
        Address from = mustFindAddress(dto.getFromAddressId());
        Address to   = mustFindAddress(dto.getToAddressId());

        if (from.getId().equals(to.getId())) {
            throw new IllegalArgumentException("From and To addresses must be different.");
        }

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

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

        return CompletableFuture.completedFuture(DriveMapper.toDto(saved));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<DriveDto> update(Long id, DriveUpdateRequestDto dto) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        if (!d.getDriver().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only the driver can update the drive");
        }

        // Update addresses if provided
        if (dto.getFromStreet() != null) {
            Address from = addressRepository.findByStreetAndNumberAndNeighborhood(
                    dto.getFromStreet(), dto.getFromNumber(), dto.getFromNeighborhood())
                    .orElseGet(() -> addressRepository.save(new Address(
                            dto.getFromStreet(), dto.getFromNumber(), dto.getFromNeighborhood(), dto.getFromLocationName())));
            d.setFrom(from);
        }

        if (dto.getToStreet() != null) {
            Address to = addressRepository.findByStreetAndNumberAndNeighborhood(
                    dto.getToStreet(), dto.getToNumber(), dto.getToNeighborhood())
                    .orElseGet(() -> addressRepository.save(new Address(
                            dto.getToStreet(), dto.getToNumber(), dto.getToNeighborhood(), dto.getToLocationName())));
            d.setTo(to);
        }

        if (dto.getPrice() != null) d.setPrice(dto.getPrice());
        
        if (dto.getDay() != null && dto.getHour() != null) {
            d.setTime(LocalDateTime.of(dto.getDay(), dto.getHour()));
        }
        
        if (dto.getTotalNoSeats() != null) d.setTotalNoSeats(dto.getTotalNoSeats());

        if (d.getFrom() != null && d.getTo() != null && d.getFrom().getId().equals(d.getTo().getId())) {
            throw new IllegalArgumentException("From and To addresses must be different.");
        }

        Drive saved = driveRepo.save(d);
        return CompletableFuture.completedFuture(DriveMapper.toDto(saved));
    }

    @Override
    @Async
    @Transactional
    public CompletableFuture<Void> delete(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        if (!d.getDriver().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Only the driver can delete the drive");
        }

        driveRepo.delete(d);
        return CompletableFuture.completedFuture(null);
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Page<DriveCardDto>> getDriverCards(Pageable pageable) {
        Page<DriveRow> rows = driveQueryRepo.findAllBy(pageable);
        return CompletableFuture.completedFuture(rows.map(r -> {
            AddressDto fromAddress = new AddressDto(
                    null,
                    r.getFrom_Street(),
                    r.getFrom_Number(),
                    r.getFrom_LocationName(),
                    r.getFrom_Neighborhood()
            );
            AddressDto toAddress = new AddressDto(
                    null,
                    r.getTo_Street(),
                    r.getTo_Number(),
                    r.getTo_LocationName(),
                    r.getTo_Neighborhood()
            );
            return new DriveCardDto(
                    r.getId(), r.getTime(), r.getPrice(),
                    r.getAvailableSeats(), r.getTotalNoSeats(),
                    fromAddress, toAddress,
                    r.getDriver_FirstName(), r.getDriver_LastName(),
                    r.getVehicle_Model()
            );
        }));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<DriveCardDto>> getDrivesByDriverId(Long driverId) {
        List<DriveRow> rows = driveQueryRepo.findAllByDriverId(driverId);
        return CompletableFuture.completedFuture(rows.stream()
                .map(r -> {
                    AddressDto fromAddress = new AddressDto(
                            null,
                            r.getFrom_Street(),
                            r.getFrom_Number(),
                            r.getFrom_LocationName(),
                            r.getFrom_Neighborhood()
                    );
                    AddressDto toAddress = new AddressDto(
                            null,
                            r.getTo_Street(),
                            r.getTo_Number(),
                            r.getTo_LocationName(),
                            r.getTo_Neighborhood()
                    );
                    return new DriveCardDto(
                            r.getId(), r.getTime(), r.getPrice(),
                            r.getAvailableSeats(),
                            r.getTotalNoSeats(),
                            fromAddress, toAddress,
                            r.getDriver_FirstName(), r.getDriver_LastName(),
                            r.getVehicle_Model()
                    );
                })
                .collect(java.util.stream.Collectors.toList()));
    }

    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<List<DriveCardDto>> getMyDrives() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return getDrivesByDriverId(user.getId());
    }

    private Address mustFindAddress(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Address ID cannot be null");
        }
        Address a = em.find(Address.class, id);
        if (a == null) throw new IllegalArgumentException("Address not found: " + id);
        return a;
    }
}
