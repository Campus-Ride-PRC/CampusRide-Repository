package campus.ride.infrastructure.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import jakarta.annotation.PostConstruct;

@Configuration
@EnableJpaRepositories(basePackages = {"campus.ride.repositories"})
@EntityScan(basePackages = {"campus.ride.entities"})
public class JpaConfig {
    
    private static final Logger logger = LogManager.getLogger(JpaConfig.class);
    
    @PostConstruct
    public void init() {
        logger.info("Infrastructure Layer - JPA Configuration initialized");
        logger.debug("JPA repositories base package: campus.ride.repositories");
        logger.debug("Entity scan base package: campus.ride.entities");
    }
}
