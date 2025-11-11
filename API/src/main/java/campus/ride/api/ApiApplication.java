package campus.ride.api;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ComponentScan(basePackages = "campus.ride")
@EnableCaching
@EnableAsync
public class ApiApplication {
	
	private static final Logger logger = LogManager.getLogger(ApiApplication.class);
	private final Environment environment;

	public ApiApplication(Environment environment) {
		this.environment = environment;
	}

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		String port = environment.getProperty("server.port", "8080");
		logger.info("========================================");
		logger.info("Swagger UI: http://localhost:{}/swagger-ui/index.html", port);
		logger.info("API Docs: http://localhost:{}/v3/api-docs", port);
		logger.info("========================================");
	}
}