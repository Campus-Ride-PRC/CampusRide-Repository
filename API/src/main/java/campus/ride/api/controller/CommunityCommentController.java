package campus.ride.api.controller;

import campus.ride.interfaces.CommunityCommentService;
import campus.ride.transfer.dtos.community.CommunityCommentDto;
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
@RequestMapping("/api/communities/comments")
@Tag(name = "Community Comments", description = "Community comments management APIs")
public class CommunityCommentController {

    private final CommunityCommentService commentService;

    public CommunityCommentController(CommunityCommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    @Operation(summary = "Create a new comment", description = "Creates a new comment on a post")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comment created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = CommunityCommentDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public CompletableFuture<ResponseEntity<CommunityCommentDto>> createComment(@Valid @RequestBody CommunityCommentDto commentDto) {
        return commentService.createComment(
                commentDto.getPostId(),
                commentDto.getContent(),
                commentDto.getAuthor()
        ).thenApply(dto -> ResponseEntity.status(201).body(dto));
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Get comments by post", description = "Retrieves all comments from a specific post")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comments retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Post not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public CompletableFuture<ResponseEntity<List<CommunityCommentDto>>> getCommentsByPost(@PathVariable Long postId) {
        return commentService.getCommentsByPost(postId)
                .thenApply(ResponseEntity::ok);
    }
}
