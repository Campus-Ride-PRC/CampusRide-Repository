package campus.ride.useCases;

import campus.ride.entities.Address;
import campus.ride.entities.Drive;
import campus.ride.contracts.Drive.DriveQueryRepository;
import campus.ride.contracts.Drive.DriveRepository;
import campus.ride.contracts.Drive.DriveRow;
import campus.ride.interfaces.DriveService;
import campus.ride.transfer.dtos.drive.DriveCardDto;
import campus.ride.transfer.dtos.drive.DriveDto;
import campus.ride.transfer.mappings.DriveMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@Service
public class DriveServiceImpl implements DriveService {

    private final DriveRepository driveRepo; // domain repo (entities)
    private final DriveQueryRepository driveQueryRepo; // query repo (projections)

    @PersistenceContext
    private EntityManager em;

    public DriveServiceImpl(DriveRepository driveRepo, DriveQueryRepository driveQueryRepo) {
        this.driveRepo = driveRepo;
        this.driveQueryRepo = driveQueryRepo;
    }


    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Page<DriveDto>> getAllAsync(Pageable pageable) {
        Page<DriveDto> page = driveRepo.findAll(pageable).map(DriveMapper::toDto);
        return CompletableFuture.completedFuture(page);
    }


    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<DriveDto> getByIdAsync(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));
        return CompletableFuture.completedFuture(DriveMapper.toDto(d));
    }


    @Override
    @Async
    @Transactional
    public CompletableFuture<DriveDto> addAsync(DriveDto dto) {
        Address from = mustFindAddress(dto.getFromAddressId());
        Address to   = mustFindAddress(dto.getToAddressId());

        if (from.getId().equals(to.getId())) {
            throw new IllegalArgumentException("From and To addresses must be different.");
        }

        Drive entity = DriveMapper.toEntity(dto, from, to);

        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }

        Drive saved = driveRepo.save(entity);
        return CompletableFuture.completedFuture(DriveMapper.toDto(saved));
    }


    @Override
    @Async
    @Transactional
    public CompletableFuture<DriveDto> updateAsync(Long id, DriveDto dto) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));

        if (dto.getFromAddressId() != null) d.setFrom(mustFindAddress(dto.getFromAddressId()));
        if (dto.getToAddressId() != null) d.setTo(mustFindAddress(dto.getToAddressId()));
        if (dto.getPrice() != null) d.setPrice(dto.getPrice());
        if (dto.getTime() != null) d.setTime(dto.getTime());
        if (dto.getAvailableSeats() != null) d.setAvailableSeats(dto.getAvailableSeats());
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
    public CompletableFuture<Void> deleteAsync(Long id) {
        Drive d = driveRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Drive not found: " + id));
        driveRepo.delete(d); // now available via contract
        return CompletableFuture.completedFuture(null);
    }

    // carModel = null until M:N exists
    @Override
    @Async
    @Transactional(readOnly = true)
    public CompletableFuture<Page<DriveCardDto>> getDriverCardsAsync(Pageable pageable) {
        Page<DriveRow> rows = driveQueryRepo.findAllBy(pageable);
        Page<DriveCardDto> page = rows.map(r ->
                new DriveCardDto(
                        r.getId(), r.getTime(), r.getPrice(),
                        r.getFrom_LocationName(), r.getFrom_Neighborhood(),
                        r.getTo_LocationName(),   r.getTo_Neighborhood(),
                        null // TODO: populate once M:N (Drive<->User/Vehicle) exists
                )
        );
        return CompletableFuture.completedFuture(page);
    }


    private Address mustFindAddress(Long id) {
        Address a = em.find(Address.class, id);
        if (a == null) throw new IllegalArgumentException("Address not found: " + id);
        return a;
    }
}
