package campus.ride.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI campusRideOpenAPI() {
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8080");
        localServer.setDescription("Local Development Server");

        Contact contact = new Contact();
        contact.setName("Campus Ride Team");
        contact.setEmail("support@campusride.com");

        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("Campus Ride API")
                .version("1.0.0")
                .description("API for Campus Ride application - a ride-sharing platform for campus users")
                .contact(contact)
                .license(license);

        Components components = new Components();
        
        // Manually create ErrorResponse schema
        Schema<?> fieldValidationErrorSchema = new Schema<>()
                .type("object")
                .description("Field validation error details")
                .addProperty("field", new Schema<>().type("string").description("Name of the field that failed validation"))
                .addProperty("rejectedValue", new Schema<>().type("object").description("The value that was rejected"))
                .addProperty("message", new Schema<>().type("string").description("Validation error message"));
        
        Schema<?> arraySchema = new Schema<>()
                .type("array")
                .description("List of field validation errors (for validation failures)");
        arraySchema.setItems(new Schema<>().$ref("#/components/schemas/FieldValidationError"));
        
        Schema<?> errorResponseSchema = new Schema<>()
                .type("object")
                .description("Standard error response format")
                .addProperty("timestamp", new Schema<>().type("string").format("date-time").description("Time when the error occurred"))
                .addProperty("status", new Schema<>().type("integer").format("int32").description("HTTP status code"))
                .addProperty("error", new Schema<>().type("string").description("HTTP status reason phrase"))
                .addProperty("message", new Schema<>().type("string").description("Error message"))
                .addProperty("path", new Schema<>().type("string").description("Request path that caused the error"))
                .addProperty("fieldErrors", arraySchema);
        
        components.addSchemas("FieldValidationError", fieldValidationErrorSchema);
        components.addSchemas("ErrorResponse", errorResponseSchema);

        return new OpenAPI()
                .components(components)
                .info(info)
                .servers(List.of(localServer));
    }
}
