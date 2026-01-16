package campus.ride.api.controller;

import campus.ride.interfaces.CommunityService;
import campus.ride.transfer.dtos.address.AddressDto;
import campus.ride.transfer.dtos.community.CommunityDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/communities")
@Tag(name = "Communities", description = "Community management APIs")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new community", description = "Creates a new community with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Community created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AddressDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    public CompletableFuture<ResponseEntity<CommunityDto>> createCommunity(@Valid @RequestBody CommunityDto communityDto){
        return communityService.createCommunity(
                communityDto.getName(),
                communityDto.getDescription(),
                communityDto.getCreator()
        ).thenApply(dto -> ResponseEntity.status(201).body(dto));
    }

    @GetMapping("/user-communities/{userId}")
    @Operation(summary = "Get user's included communities", description = "Retrieves communities that the user is a member of")
    public CompletableFuture<ResponseEntity<List<CommunityDto>>> getNewCommunities(@PathVariable Long userId) {
        return communityService.getIncludedCommunities(userId)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/new-communities/{userId}")
    @Operation(summary = "Get joined communities", description = "Returns communities the user IS a member of")
    public CompletableFuture<ResponseEntity<List<CommunityDto>>> getJoinedCommunities(@PathVariable Long userId) {
        return communityService.getNewCommunities(userId)
                .thenApply(ResponseEntity::ok);
    }


}
