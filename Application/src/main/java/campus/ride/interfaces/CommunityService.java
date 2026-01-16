package campus.ride.interfaces;

import campus.ride.entities.Communities;
import campus.ride.transfer.dtos.community.CommunityDto;
import campus.ride.transfer.dtos.user.UserResponseDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface CommunityService {
    CompletableFuture<CommunityDto> createCommunity(String name, String description, UserResponseDto user);
    CompletableFuture<List<CommunityDto>> getNewCommunities(Long userId);
    CompletableFuture<List<CommunityDto>> getIncludedCommunities(Long userId);
}
