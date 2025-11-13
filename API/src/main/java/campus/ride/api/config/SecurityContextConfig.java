package campus.ride.api.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class SecurityContextConfig {

    @PostConstruct
    public void init() {
        // Use MODE_THREADLOCAL instead of MODE_INHERITABLETHREADLOCAL
        // This is the default and works better with async processing
        SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_THREADLOCAL);
    }
}
