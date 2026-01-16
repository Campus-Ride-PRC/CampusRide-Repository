package campus.ride.api.controller;

import campus.ride.interfaces.CommunityPostService;
import campus.ride.transfer.dtos.community.CommunityPostDto;
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
@RequestMapping("/api/communities/posts")
@Tag(name = "Community Posts", description = "Community posts management APIs")
public class CommunityPostController {

    private final CommunityPostService postService;

    public CommunityPostController(CommunityPostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @Operation(summary = "Create a new post", description = "Creates a new post in a community")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Post created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommunityPostDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public CompletableFuture<ResponseEntity<CommunityPostDto>> createPost(@Valid @RequestBody CommunityPostDto postDto) {
        return postService.createPost(
                postDto.getCommunityId(),
                postDto.getContent(),
                postDto.getAuthor()
        ).thenApply(dto -> ResponseEntity.status(201).body(dto));
    }

    @GetMapping("/{communityId}")
    @Operation(summary = "Get posts by community", description = "Retrieves all posts from a specific community")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Posts retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Community not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public CompletableFuture<ResponseEntity<List<CommunityPostDto>>> getPostsByCommunity(@PathVariable Long communityId) {
        return postService.getPostsByCommunity(communityId)
                .thenApply(ResponseEntity::ok);
    }
}
