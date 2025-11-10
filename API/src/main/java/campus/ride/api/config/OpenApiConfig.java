package campus.ride.api.config;

import campus.ride.api.errorDto.ErrorResponse;
import io.swagger.v3.core.converter.ModelConverters;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
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
        ModelConverters.getInstance().read(ErrorResponse.class).forEach(components::addSchemas);

        return new OpenAPI()
                .components(components)
                .info(info)
                .servers(List.of(localServer));
    }

    @Bean
    public OpenApiCustomizer globalErrorResponsesCustomizer() {
        return openApi -> {
            if (openApi.getPaths() == null) return;
            openApi.getPaths().values().forEach(pathItem -> {
                if (pathItem == null) return;
                java.util.stream.Stream.of(
                        pathItem.getGet(),
                        pathItem.getPost(),
                        pathItem.getPut(),
                        pathItem.getDelete(),
                        pathItem.getPatch(),
                        pathItem.getOptions(),
                        pathItem.getHead(),
                        pathItem.getTrace()
                ).filter(java.util.Objects::nonNull).forEach(operation -> {
                    ApiResponses responses = operation.getResponses();
                    if (responses == null) {
                        responses = new ApiResponses();
                        operation.setResponses(responses);
                    }
                    Schema<?> errorSchemaRef = new Schema<>().$ref("#/components/schemas/" + ErrorResponse.class.getSimpleName());
                    Content errorJson = new Content().addMediaType("application/json",
                            new MediaType().schema(errorSchemaRef));

                    responses.addApiResponse("400", new ApiResponse().description("Bad Request / Validation failed").content(errorJson));
                    responses.addApiResponse("404", new ApiResponse().description("Not Found").content(errorJson));
                    responses.addApiResponse("409", new ApiResponse().description("Conflict").content(errorJson));
                    responses.addApiResponse("500", new ApiResponse().description("Internal Server Error").content(errorJson));
                });
            });
        };
    }
}
