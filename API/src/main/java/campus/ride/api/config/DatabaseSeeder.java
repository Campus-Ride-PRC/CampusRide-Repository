package campus.ride.api.config;

import campus.ride.interfaces.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserService userService;
    private final JdbcTemplate jdbcTemplate;

    public DatabaseSeeder(UserService userService, JdbcTemplate jdbcTemplate) {
        this.userService = userService;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userService.findByEmail("john.doe@example.com").isPresent()) {
            System.out.println("Database already seeded. Skipping seeding...");
            return;
        }

        System.out.println("Starting database seeding...");

        String insertSql = "INSERT INTO users (email, password, phone_number, first_name, last_name, faculty) VALUES (?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(insertSql, 
            "john.doe@example.com", "password123", "+40712345678", "John", "Doe", "Computer Science");
        
        jdbcTemplate.update(insertSql, 
            "jane.smith@example.com", "password456", "+40723456789", "Jane", "Smith", "Engineering");
        
        jdbcTemplate.update(insertSql, 
            "bob.wilson@example.com", "password789", "+40734567890", "Bob", "Wilson", "Mathematics");
        
        jdbcTemplate.update(insertSql, 
            "alice.brown@example.com", "passwordabc", "+40745678901", "Alice", "Brown", "Physics");
        
        jdbcTemplate.update(insertSql, 
            "charlie.davis@example.com", "passwordxyz", "+40756789012", "Charlie", "Davis", "Computer Science");

        System.out.println("Database seeding completed successfully!");
        System.out.println("Created 5 sample users:");
        System.out.println("  - john.doe@example.com");
        System.out.println("  - jane.smith@example.com");
        System.out.println("  - bob.wilson@example.com");
        System.out.println("  - alice.brown@example.com");
        System.out.println("  - charlie.davis@example.com");
    }
}
