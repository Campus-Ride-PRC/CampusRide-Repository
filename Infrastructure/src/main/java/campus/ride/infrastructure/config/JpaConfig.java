package campus.ride.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = {"campus.ride.repositories"})
@EntityScan(basePackages = {"campus.ride.entities"})
public class JpaConfig {
    // This configuration class handles JPA setup
}
