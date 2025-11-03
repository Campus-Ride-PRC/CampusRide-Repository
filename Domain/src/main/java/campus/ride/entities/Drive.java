package campus.ride.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "drives",
        indexes = {
                @Index(name = "ix_drives_from_id", columnList = "from_id"),
                @Index(name = "ix_drives_to_id", columnList = "to_id"),
                @Index(name = "ix_drives_time", columnList = "time"),
                @Index(name = "ix_drives_created_at", columnList = "created_at"),
                @Index(name = "ix_drives_from_time", columnList = "from_id, time"),
                @Index(name = "ix_drives_to_time", columnList = "to_id, time")
        }
)
public class Drive {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_id", nullable = false)
    private Address from;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_id", nullable = false)
    private Address to;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private Integer availableSeats;

    @Column(nullable = false)
    private Integer totalNoSeats;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false,
            columnDefinition = "timestamp(6) DEFAULT now()")
    private LocalDateTime createdAt;

    protected Drive() {}

    public Drive(Address from, Address to, BigDecimal price, LocalDateTime time,
                 Integer availableSeats, Integer totalNoSeats, LocalDateTime createdAt) {
        this.from = from;
        this.to = to;
        this.price = price;
        this.time = time;
        this.availableSeats = availableSeats;
        this.totalNoSeats = totalNoSeats;
        this.createdAt = createdAt;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Address getFrom() { return from; }
    public void setFrom(Address from) { this.from = from; }

    public Address getTo() { return to; }
    public void setTo(Address to) { this.to = to; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }

    public Integer getTotalNoSeats() { return totalNoSeats; }
    public void setTotalNoSeats(Integer totalNoSeats) { this.totalNoSeats = totalNoSeats; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
