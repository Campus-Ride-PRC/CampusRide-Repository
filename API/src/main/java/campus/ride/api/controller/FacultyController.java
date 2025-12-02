package campus.ride.api.controller;

import campus.ride.interfaces.FacultyService;
import java.util.List;
import campus.ride.transfer.dtos.faculty.FacultyResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api")
@Tag(name = "Faculties", description = "Faculties management APIs")
public class FacultyController {
    private static final Logger logger = LogManager.getLogger(FacultyController.class);

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @Operation(
            summary = "Find all faculties",
            description = "Retrieves a list of all faculties (name only)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Faculties found successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = FacultyResponseDto.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Faculties not found"),
    })
    @GetMapping("/faculties")
    public CompletableFuture<ResponseEntity<List<FacultyResponseDto>>> findAllFaculties() {
        logger.info("Received request to find all faculties");
        logger.debug("Searching for faculties");

        return facultyService.findAllFaculties()
                .thenApply(faculties -> {
                    logger.info("Returning {} faculties", faculties.size());
                    return ResponseEntity.ok(faculties);
                });
    }
}