package campus.ride.interfaces;

import campus.ride.entities.Communities;
import campus.ride.entities.CommunityMemberId;
import campus.ride.transfer.dtos.community.CommunityMemberDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface CommunityMemberService {
    CompletableFuture<CommunityMemberDto> addMemberToCommunity(Long communityId, Long userId);
    CompletableFuture<List<CommunityMemberDto>> getMembersByCommunityId(Long communityId);
}
