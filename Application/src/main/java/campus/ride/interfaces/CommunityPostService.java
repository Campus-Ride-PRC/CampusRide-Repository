package campus.ride.interfaces;

import campus.ride.transfer.dtos.community.CommunityPostDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface CommunityPostService {
    CompletableFuture<CommunityPostDto> createPost(Long communityId, String content, UserResponseDto author);
    CompletableFuture<List<CommunityPostDto>> getPostsByCommunity(Long communityId);
}
