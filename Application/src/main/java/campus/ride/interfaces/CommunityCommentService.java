package campus.ride.interfaces;

import campus.ride.transfer.dtos.community.CommunityCommentDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface CommunityCommentService {
    CompletableFuture<CommunityCommentDto> createComment(Long postId, String content, UserResponseDto author);
    CompletableFuture<List<CommunityCommentDto>> getCommentsByPost(Long postId);
}
